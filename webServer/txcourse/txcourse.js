var fs = require("fs");
var mysql = require("mysql");
var json = require("json");
var underscore = require('underscore');
var Task = require("node-common/task");
var moment = require("moment");
var logger = console;

String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
}

var ret = {"errno" : 0, "error" : "success"};

function _CDN_CGI() {} //用于存储全局变量信息

_CDN_CGI.config = require('../svr_test');

function Mydb(db_info) {
	this.db_info = db_info;

	var pool = mysql.createPool(this.db_info);

	this.pool = pool;
}

Mydb.prototype.execute_sql = function(sql) {
	var _this = this;

	var f = new Task.future();
	_this.pool.query(sql, function(err, rows, fields) {
		try {
			if (err) {
				logger.error('sql error: ' + err);
                throw err;
			}
			f.return(rows);
		} catch (e) {
			f.return(false);
		}
	});
	return f.wait();
}

exports.main = function(_){
	logger = _.logger;
	var pz_conn = new Mydb({
        host: _CDN_CGI.config['host'],
        user: _CDN_CGI.config['user'],
        password: _CDN_CGI.config['password'],
        database: _CDN_CGI.config['database']
    });
    _CDN_CGI.pz_conn = pz_conn;

	_.get("/txcourse/courselist",function(req,res){
		new Task.task(function() {
			var start_date = (req.query.start_time == undefined) ? moment().format("YYYY-MM-DD") : req.query.start_time;
			var end_date = (req.query.end_time == undefined) ? moment().format("YYYY-MM-DD") : req.query.end_time; 

			sql = "select subject,count(*) as num,created  from t_sys_course_base_info where created>='" + start_date + "' and created<='" + end_date+  "' group by subject,created;"
			logger.info("sql1:" + sql);
			var sys_rows = _CDN_CGI.pz_conn.execute_sql(sql);

			sql2 = "select subject,count(*) as num,created  from t_spe_course_info where created>='" + start_date + "' and created<='" + end_date+  "' group by subject,created;"
			logger.info("sql2:" + sql2);

			var spe_rows = _CDN_CGI.pz_conn.execute_sql(sql2);

			logger.info("start sys_rows: " + JSON.stringify(sys_rows) + "\n\n spe_rows:" + JSON.stringify(spe_rows))

			var data = [];
			underscore.each(sys_rows, function(item){
				underscore.each(spe_rows, function(sub_item){
					if(item.subject == sub_item.subject && moment(item.created).format("YYYY-MM-DD") == moment(sub_item.created).format("YYYY-MM-DD")){
						item.num = sub_item.num + item.num;
					}
				});
				data.push(item);
			});

			logger.info("start data: " + JSON.stringify(data) + "\n\n ")
			underscore.each(spe_rows, function(item){
				var flag = true;
				underscore.each(sys_rows,function (sub_item) {
					if(item.subject == sub_item.subject && moment(item.created).format("YYYY-MM-DD") == moment(sub_item.created).format("YYYY-MM-DD")){
						flag = false;
					}				
				});
				if(flag){
					data.push(item);
				}
			});
			logger.info("start data: " + JSON.stringify(data) + "\n\n ")
			var data_list = [];
			if(data.length){
				data_list = data;
			}
			res.render("txcourse/txcourse",{"data_list" : data, "start_time" : start_date, "end_time" : end_date, "moment": require("moment")});		
		}).run();
	});


	_.post("/txcourse/coursedetail",function(req,res){
		new Task.task(function() {
			var sql = "";
			var start_date = moment(req.body.time).format("YYYY-MM-DD");
			var subject = req.body.subject; 
			sql = "select b.grade,d.name,d.cid,d.time_plan,d.te_name,d.tu_name,b.course_min_price,b.course_max_price from t_sys_course_detail_info d, t_sys_course_base_info b where b.subject_package_id=d.subject_package_id and b.created = d.created and b.subject="+subject+" and b.created ='"+ start_date+"'"
			sql += " union select grade, name, cid, time_plan,te_name, '' as tu_name, 0 as course_min_price,0 as course_max_price from t_spe_course_info where subject=" + subject + " and created ='"+ start_date+"'";
			logger.info("sql:" + sql);
			var res_rows = _CDN_CGI.pz_conn.execute_sql(sql);

			var data = [];
			if(res_rows.length){
				data = res_rows;
			}

			res.render("txcourse/txcoursedetail",{"data_list" : data, "start_time" : start_date,"moment": require("moment")});		
		}).run();
	});
	
}

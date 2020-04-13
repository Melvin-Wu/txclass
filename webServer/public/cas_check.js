function cas_check(callback) {
    var ticket = getUrlParam("ticket");
    if( ticket ) {
        $.get (
            "http://cdntest.admin.ucloud.cn/cgi-bin/cas_client.cgi?TICKET=" + getUrlParam("ticket"),
            function(ret) {
                //console.log("success");
                console.log(ret["dd"]);
                if( ret["status"] < 0 ) {
                    self.location = "refuse_access.html";
                }
                callback();
            } );
    }
    else {
        $.post (
            "http://cdntest.admin.ucloud.cn/cgi-bin/cas_client.cgi",
            function(ret) {
                if( ret["status"] == 302 ){
                    console.info("redirect");
                    var url = ret["url"];
                    console.info(url);
                    location.href = url;
                }
                else if( ret["status"] == 200 ){
                    console.info("cookie");
                    console.info(ret["status"]);
                    console.info(ret["cas_user"]);
                    callback();
                }
                else {
                    console.info("not allow user");
                    self.location = "refuse_access.html";
                }
            });
    }
}


function getUrlParam(name){  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);  
	if (r!=null) return unescape(r[2]);  
		return null;  
}  


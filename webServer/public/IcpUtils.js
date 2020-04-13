
exports.RemoveSpaces = function (str){
	str += "";
	return str.replace(/\s/g,'');
}

exports.ParseStrBySep = function (str,sep) {
	var params=new Object();
	var arr = str.split(sep);
	for (var i=0;i<arr.length;i++){
		params[arr[i].split("=")[0]]=arr[i].split("=")[1];
	}
	
	return params;
}

exports.ParseSessionID = function (str) {
	var params=new Object();
	var arr = str.split("&");
	params["Account"] = arr[0];
	params["UserID"] = arr[1];
	
	return params;
}

/*
exports.GenerateCookieHeader = function (Account,UserID,Expire,MaxTime) {
	var userid = Account + "&" + UserID;
	var cookie_value = "SessionID=" + userid + ";Path=/;Max-Age=" + MaxTime ;
	return ("Set-Cookie:" + cookie_value + "\r\n");
}
*/

exports.GenerateCookieHeader = function(userName,authenticationSuccess,maxTime) {
	var cookie_value = userName + "=" + authenticationSuccess['cas:user'] + ";";
    //var cookie_value = new Object();
	for( key in authenticationSuccess) {
		if( key != 'cas:user') {
			cookie_value += key + "=" + authenticationSuccess[key] + ";";
		}
	}
	cookie_value += "Path=/;Max-Age=" + maxTime;
	return ("Set-Cookie:" + cookie_value + "\r\n");
}

/***
** 本JS专门用于提供浏览器一侧本地化日志的实现
*基于H5的写本地日志，IE9以上都是支持的，但是IE11有问题，不能在本地打开该页面，本地打开会失效
*不过，如果是服务器端发布出来的话，即使是IE11也可以正常用的
*优化以后IE11也支持下载了
***/

(function(logagent){
	window.logagent = window.logagent || logagent;
})(function(){
	var self = this;
	

	
  /* 生成和取得指定日志文件 yyyy-MM-dd-hh24
  */
	this.downloadLog = function(agentlog_id) {
		var browserMatch = uaMatch(); 
		var broserVer=browserMatch.browser+browserMatch.version; 
		if(broserVer.indexOf("IE11")>=0){
			//alert("版本浏览器是IE11");
			var downloadFileName = agentlog_id+ '-cc-agent.log';
	            try{
	            	var file = "data:text/plain;charset=utf-8,";
				    var logstr =localStorage.getItem(agentlog_id);
				    file += logstr;
	                var blobObject = new Blob([file]); 
	                window.navigator.msSaveBlob(blobObject, downloadFileName); 
	            }
	            catch(e){
	                alert("下载文件时出现错误"+e);
	            }
		}else{
			//alert("其他浏览器");
			try {
		    	var downloadFileName = agentlog_id+ '-cc-agent.log';
			    var file = "data:text/plain;charset=utf-8,";
			    var logstr =localStorage.getItem(agentlog_id);
			    var encoded = encodeURIComponent(logstr);//这一步为了下载是必须的
			    file += encoded;
			    var downloadevent = document.createElement('a');
			    downloadevent.href = file;
			    downloadevent.target   = '_blank';
			    downloadevent.download = downloadFileName;
			    document.body.appendChild(downloadevent);
			    downloadevent.click();
			    downloadevent.remove();
		    }catch(e){
		    		alert("您的浏览器不支持记录本地日志。IE11浏览器则可能是因为在本地打开的网页"+e);
		    	}
		}
		    
				
	};
	
	/* 定期清除日志，释放空间可以用到
	*/
	this.deleteLog = function(agentlog_id){
		    try {
		    	
			    var logstr =localStorage.removeItem(agentlog_id);
			    
		    }catch(e){
		    		alert("您的浏览器不支持记录本地日志。IE11浏览器则可能是因为在本地打开的网页"+e);
		    	}
		}

	
  /* 写日志的函数
  */
	this.log = function(loginfo) {
		if (typeof(localStorage) !== "undefined") {
	    var now = new Date();
			var yy = now.getFullYear();      //年
			var mm = now.getMonth() + 1;     //月
			var dd = now.getDate();          //日
			var hh = now.getHours();         //时
			var ii = now.getMinutes();       //分
			var ss = now.getSeconds();       //秒
			
			var log_clock = yy + "-";
			if(mm < 10) log_clock += "0";
			log_clock += mm + "-";
			if(dd < 10) log_clock += "0";
			log_clock += dd + "-";
			if(hh < 10) log_clock += "0";
			log_clock += hh ;
			
			//日志持久化寻址编号，采取日期来定位 yyyy-mm-dd-hh
	    var agentlog_id = log_clock;   //设置当前日志所在区间的名称编号，避免只写一个item过大失败
	    //alert(agentlog_id);
	    var logstr =localStorage.getItem(agentlog_id);
	    
	    if(typeof(logstr) == "undefined"){
	    		logstr="";
	    	}  
	    var str = "["+now + "]"+loginfo+"<br>\r\n";//将日志内容格式化，加入日期
	    logstr=logstr+str;
	    localStorage.setItem(agentlog_id, logstr );//将日志写入localStorage中,单个item不能超过5MB，不过一般一个小时的日志不可能超过这么多
      //console.log("记录日志");
		} else {
		    console.log("抱歉！您的浏览器不支持记录本地日志。IE11浏览器则可能是因为在本地打开的网页");
		}
	};


});

/* 判断取得当前浏览器的版本
 * */

function uaMatch(){ 
	//正则表达式方式来判定user-agent字符串，得到当前访问浏览器（http代理）的版本
	var userAgent = navigator.userAgent;
	rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
	rFirefox = /(firefox)\/([\w.]+)/;
	rOpera = /(opera).+version\/([\w.]+)/;
	rChrome = /(chrome)\/([\w.]+)/;
	rSafari = /version\/([\w.]+).*(safari)/; 
	var browser;
	var version; 
	var ua = userAgent.toLowerCase(); 
    var match = rMsie.exec(ua); 
    
	 if(match != null){ 
		 return { browser : "IE", version : match[2] || "0" }; 
	 } 
	 var match = rFirefox.exec(ua); 
	 if (match != null) { 
		 return { browser : match[1] || "", version : match[2] || "0" }; 
	 } 
	 var match = rOpera.exec(ua); 
	 if (match != null) { 
		 return { browser : match[1] || "", version : match[2] || "0" }; 
	 } 
	 var match = rChrome.exec(ua); 
	 if (match != null) { 
		 return { browser : match[1] || "", version : match[2] || "0" }; 
	 } 
	 var match = rSafari.exec(ua); 
	 if (match != null) { 
		 return { browser : match[2] || "", version : match[1] || "0" }; 
	 } 
	 if (match != null) { 
		 return { browser : "", version : "0" }; 
	 } 	
} 
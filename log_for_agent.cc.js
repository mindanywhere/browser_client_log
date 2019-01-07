/***
** 本JS专门用于提供浏览器一侧本地化日志的实现
***/

(function(logagent){
	window.logagent = window.logagent || logagent;
})(function(){
	var self = this;
	

	
  /* 生成和取得指定日志文件 yyyy-MM-dd-hh24
  */
	this.downloadLog = function(agentlog_id) {
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
		    		alert("您的浏览器不支持记录本地日志。IE11浏览器则可能是因为在本地打开的网页");
		    	}
				
	};
	
	/* 定期清除日志，释放空间可以用到
	*/
	this.deleteLog = function(agentlog_id){
		    try {
		    	
			    var logstr =localStorage.removeItem(agentlog_id);
			    
		    }catch(e){
		    		alert("您的浏览器不支持记录本地日志。IE11浏览器则可能是因为在本地打开的网页");
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
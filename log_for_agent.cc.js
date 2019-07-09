/***
** ��JSר�������ṩ�����һ�౾�ػ���־��ʵ��
*����H5��д������־��IE9���϶���֧�ֵģ�����IE11�����⣬�����ڱ��ش򿪸�ҳ�棬���ش򿪻�ʧЧ
*����������Ƿ������˷��������Ļ�����ʹ��IE11Ҳ���������õ�
*�Ż��Ժ�IE11Ҳ֧��������
***/

(function(logagent){
	window.logagent = window.logagent || logagent;
})(function(){
	var self = this;
	

	
  /* ���ɺ�ȡ��ָ����־�ļ� yyyy-MM-dd-hh24
  */
	this.downloadLog = function(agentlog_id) {
		var browserMatch = uaMatch(); 
		var broserVer=browserMatch.browser+browserMatch.version; 
		if(broserVer.indexOf("IE11")>=0){
			//alert("�汾�������IE11");
			var downloadFileName = agentlog_id+ '-cc-agent.log';
	            try{
	            	var file = "data:text/plain;charset=utf-8,";
				    var logstr =localStorage.getItem(agentlog_id);
				    file += logstr;
	                var blobObject = new Blob([file]); 
	                window.navigator.msSaveBlob(blobObject, downloadFileName); 
	            }
	            catch(e){
	                alert("�����ļ�ʱ���ִ���"+e);
	            }
		}else{
			//alert("���������");
			try {
		    	var downloadFileName = agentlog_id+ '-cc-agent.log';
			    var file = "data:text/plain;charset=utf-8,";
			    var logstr =localStorage.getItem(agentlog_id);
			    var encoded = encodeURIComponent(logstr);//��һ��Ϊ�������Ǳ����
			    file += encoded;
			    var downloadevent = document.createElement('a');
			    downloadevent.href = file;
			    downloadevent.target   = '_blank';
			    downloadevent.download = downloadFileName;
			    document.body.appendChild(downloadevent);
			    downloadevent.click();
			    downloadevent.remove();
		    }catch(e){
		    		alert("�����������֧�ּ�¼������־��IE11��������������Ϊ�ڱ��ش򿪵���ҳ"+e);
		    	}
		}
		    
				
	};
	
	/* ���������־���ͷſռ�����õ�
	*/
	this.deleteLog = function(agentlog_id){
		    try {
		    	
			    var logstr =localStorage.removeItem(agentlog_id);
			    
		    }catch(e){
		    		alert("�����������֧�ּ�¼������־��IE11��������������Ϊ�ڱ��ش򿪵���ҳ"+e);
		    	}
		}

	
  /* д��־�ĺ���
  */
	this.log = function(loginfo) {
		if (typeof(localStorage) !== "undefined") {
	    var now = new Date();
			var yy = now.getFullYear();      //��
			var mm = now.getMonth() + 1;     //��
			var dd = now.getDate();          //��
			var hh = now.getHours();         //ʱ
			var ii = now.getMinutes();       //��
			var ss = now.getSeconds();       //��
			
			var log_clock = yy + "-";
			if(mm < 10) log_clock += "0";
			log_clock += mm + "-";
			if(dd < 10) log_clock += "0";
			log_clock += dd + "-";
			if(hh < 10) log_clock += "0";
			log_clock += hh ;
			
			//��־�־û�Ѱַ��ţ���ȡ��������λ yyyy-mm-dd-hh
	    var agentlog_id = log_clock;   //���õ�ǰ��־������������Ʊ�ţ�����ֻдһ��item����ʧ��
	    //alert(agentlog_id);
	    var logstr =localStorage.getItem(agentlog_id);
	    
	    if(typeof(logstr) == "undefined"){
	    		logstr="";
	    	}  
	    var str = "["+now + "]"+loginfo+"<br>\r\n";//����־���ݸ�ʽ������������
	    logstr=logstr+str;
	    localStorage.setItem(agentlog_id, logstr );//����־д��localStorage��,����item���ܳ���5MB������һ��һ��Сʱ����־�����ܳ�����ô��
      //console.log("��¼��־");
		} else {
		    console.log("��Ǹ�������������֧�ּ�¼������־��IE11��������������Ϊ�ڱ��ش򿪵���ҳ");
		}
	};


});

/* �ж�ȡ�õ�ǰ������İ汾
 * */

function uaMatch(){ 
	//������ʽ��ʽ���ж�user-agent�ַ������õ���ǰ�����������http�����İ汾
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
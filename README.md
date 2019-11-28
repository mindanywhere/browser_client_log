# browser_client_log
 to log str(info) at the browser client side with the surpport of html5
用于在支持html5的浏览器客户端一侧记录日志，对于局域范围内特定客户群体记录客户操作行为用于分析。比较适合于企业内WEB应用出现各种bug出现时，分析收集故障现场的真实情况用。
日志本质上不是写在某个文件系统上指定的文件中，而是写在浏览器自身限定的一个区域中，不需要直接读取
而是通过js函数调取出来

经过实际测试验证发现localstorage方式存储有性能隐患，只能写入5MB数据，同时是同步阻塞写的数据，
数据量大的时候会卡，甚至卡死。
改用indexDB实现前端日志记录
具体记录的函数名和参数不变。
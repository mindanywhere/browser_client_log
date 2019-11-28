/*******************************************************************************
 * * 本JS专门用于提供浏览器一侧本地化日志的实现
 ******************************************************************************/

(function(logagent) {
	window.logagent = window.logagent || logagent;
})(function() {
	var self = this;

	// indexDB的实例
	let db
	// var objectStore
	const request = indexedDB.open('forCSWorkbench')
	request.onerror = function(event) {
		console.error('open indexedDB error')
	}
	request.onsuccess = function(event) {
		db = event.target.result
		console.log("now db is " + db)
		console.log('open indexedDB success')
	}
	/* 当发现目标表logs不存在的时候创建一个目标对象（表） */

	request.onupgradeneeded = function(event) {
		db = event.target.result
		console.log('upgrade indexedDB success')
		if (!db.objectStoreNames.contains('mylogs')) {
			/*
			 * 创建一个叫做 logs 的表，只能存储javascript类型的值，主键为id
			 * 
			 * const objectStore = db.createObjectStore('mylogs', { keyPath :
			 * 'time' })
			 *//* 不用time作为主键是避免数据重复，毕竟到毫秒也有可能冲突 */

			console.log('建立一个mylogs表')
			/* 创建一个叫做 logs 的表，可以存储任意类型的值，自动生成主键 */

			const objectStore = db.createObjectStore('mylogs', {
				autoIncrement : true
			})

			// 创建一个索引来通过时间time搜索，时间可能是重复的，所以不能使用 unique 索引。
			objectStore.createIndex('time_idx', 'time', {
				unique : false
			})

			// 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
			objectStore.transaction.oncomplete = function(event) {
				// 将数据保存到新创建的对象仓库
				const transaction = db.transaction('mylogs', 'readwrite')
				const store = transaction.objectStore('mylogs')
				store.add({
					time : new Date().getTime(),
					msg : '新建表的首次初始化数据'
				})
				console.log('向mylogs表中增加一条数据')
			}
		} else {
			console.log('mylogs表之前已经建立了')
		}

	}

	// 新增数据，最好不要用传参方式带入db，有可能会带入一个空的db
	function addLog(data, cnt) {
		if (cnt <= 2) {
			if (db !== undefined) {
				console.log("start to add log :db is " + db)
				const transaction = db.transaction('mylogs', 'readwrite')
				console.log("get transaction is " + transaction)
				const store = transaction.objectStore('mylogs')
				console.log("get objectStore is " + transaction)
				const request = store.add(data)
				request.onsuccess = function(e) {
					console.log('write log success，the data is' + data)
				}
				request.onerror = function(e) {
					console.error('write log fail', e)
				}
			} else {
				// 由于indexedDB是异步的，第一次打开页面时db可能还没有完成初始化，因此需要做一次1秒的延迟
				console.error('由于db还没有初始化完成，延迟1秒以后再记录日志')
				setTimeout(function() {
					addLog(data, cnt + 1)
				}, 1000);
			}
		} else {
			// 如果db还没有完成初始化，放弃记录日志
			console.error('由于db始终没有初始化完成，无法记录日志')
		}

	}

	/*
	 * 写入的日志 的数据结构 采取json var data = { time : new Date().getTime(), msg :
	 * '加入一条新的日志数据' }
	 */

	// 调用addLog函数，插入一条数据data
	// addLog(data, 1)

	// 取日志
	function getLog(cnt) {
		if (cnt <= 2) {
			if (db !== undefined) {
				const transaction = db.transaction('mylogs', 'readwrite')
				const store = transaction.objectStore('mylogs')
				// const request = store.get(key)
				const request = store.getAll()
				request.onsuccess = function(e) {
					console.log('get log success')
					console.log(e.target.result)
				}
				request.onerror = function(e) {
					console.error('get log fail')
				}
			} else {
				console.error('由于db还没有初始化完成，延迟1秒以后再读取日志')
				setTimeout(function() {
					getLog(cnt + 1)
				}, 3000);
			}
		} else {
			// 如果db还没有完成初始化，放弃记录日志
			console.error('由于db始终没有初始化完成，无法读取日志')
		}

	}

	// 建议在页面离开的时候执行，避免资源占用和多个页面建立多个连接产生潜在的冲突。
	function closeDb() {
		db.close();
		console.info("indexedDB关闭了")

	}

	/*
	 * 生成和取得指定日志文件 yyyy-MM-dd-hh24
	 */
	this.downloadLog = function(agentlog_id) {
		alert("在chrome浏览器中无需开发查看函数，通过开发者模式在application的indexDB中就可以看到")
	};

	/*
	 * 定期清除日志，释放空间可以用到
	 */
	this.deleteLog = function(agentlog_id) {
		alert("在chrome浏览器中无需开发清除函数，通过开发者模式在application的indexDB中就可以手动清除")
	}

	/*
	 * 写日志的函数
	 */
	this.log = function(loginfo) {
		var now = new Date();
		var yy = now.getFullYear(); // 年
		var mm = now.getMonth() + 1; // 月
		var dd = now.getDate(); // 日
		var hh = now.getHours(); // 时
		var ii = now.getMinutes(); // 分
		var ss = now.getSeconds(); // 秒
		var ms = now.getMilliseconds(); // 毫秒

		var agentlog_id = yy + "-";
		if (mm < 10)
			agentlog_id += "0";
		agentlog_id += mm + "-";
		if (dd < 10)
			agentlog_id += "0";
		agentlog_id += dd + ":";
		if (hh < 10)
			agentlog_id += "0";
		agentlog_id += hh + "-";
		if (ii < 10)
			agentlog_id += "0";
		agentlog_id += ii + "-";
		if (ss < 10)
			agentlog_id += "0";
		agentlog_id += ss;
		agentlog_id = agentlog_id + "." + ms

		if (typeof (logstr) == "undefined") {
			logstr = "";
		}
		var data = {
			time : agentlog_id,
			msg : loginfo
		}
		addLog(data, 1)
	};

});
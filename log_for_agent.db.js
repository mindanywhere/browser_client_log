/*******************************************************************************
 * * ��JSר�������ṩ�����һ�౾�ػ���־��ʵ��
 ******************************************************************************/

(function(logagent) {
	window.logagent = window.logagent || logagent;
})(function() {
	var self = this;

	// indexDB��ʵ��
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
	/* ������Ŀ���logs�����ڵ�ʱ�򴴽�һ��Ŀ����󣨱� */

	request.onupgradeneeded = function(event) {
		db = event.target.result
		console.log('upgrade indexedDB success')
		if (!db.objectStoreNames.contains('mylogs')) {
			/*
			 * ����һ������ logs �ı�ֻ�ܴ洢javascript���͵�ֵ������Ϊid
			 * 
			 * const objectStore = db.createObjectStore('mylogs', { keyPath :
			 * 'time' })
			 *//* ����time��Ϊ�����Ǳ��������ظ����Ͼ�������Ҳ�п��ܳ�ͻ */

			console.log('����һ��mylogs��')
			/* ����һ������ logs �ı����Դ洢�������͵�ֵ���Զ��������� */

			const objectStore = db.createObjectStore('mylogs', {
				autoIncrement : true
			})

			// ����һ��������ͨ��ʱ��time������ʱ��������ظ��ģ����Բ���ʹ�� unique ������
			objectStore.createIndex('time_idx', 'time', {
				unique : false
			})

			// ʹ������� oncomplete �¼�ȷ���ڲ�������ǰ����ֿ��Ѿ��������
			objectStore.transaction.oncomplete = function(event) {
				// �����ݱ��浽�´����Ķ���ֿ�
				const transaction = db.transaction('mylogs', 'readwrite')
				const store = transaction.objectStore('mylogs')
				store.add({
					time : new Date().getTime(),
					msg : '�½�����״γ�ʼ������'
				})
				console.log('��mylogs��������һ������')
			}
		} else {
			console.log('mylogs��֮ǰ�Ѿ�������')
		}

	}

	// �������ݣ���ò�Ҫ�ô��η�ʽ����db���п��ܻ����һ���յ�db
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
					console.log('write log success��the data is' + data)
				}
				request.onerror = function(e) {
					console.error('write log fail', e)
				}
			} else {
				// ����indexedDB���첽�ģ���һ�δ�ҳ��ʱdb���ܻ�û����ɳ�ʼ���������Ҫ��һ��1����ӳ�
				console.error('����db��û�г�ʼ����ɣ��ӳ�1���Ժ��ټ�¼��־')
				setTimeout(function() {
					addLog(data, cnt + 1)
				}, 1000);
			}
		} else {
			// ���db��û����ɳ�ʼ����������¼��־
			console.error('����dbʼ��û�г�ʼ����ɣ��޷���¼��־')
		}

	}

	/*
	 * д�����־ �����ݽṹ ��ȡjson var data = { time : new Date().getTime(), msg :
	 * '����һ���µ���־����' }
	 */

	// ����addLog����������һ������data
	// addLog(data, 1)

	// ȡ��־
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
				console.error('����db��û�г�ʼ����ɣ��ӳ�1���Ժ��ٶ�ȡ��־')
				setTimeout(function() {
					getLog(cnt + 1)
				}, 3000);
			}
		} else {
			// ���db��û����ɳ�ʼ����������¼��־
			console.error('����dbʼ��û�г�ʼ����ɣ��޷���ȡ��־')
		}

	}

	// ������ҳ���뿪��ʱ��ִ�У�������Դռ�úͶ��ҳ�潨��������Ӳ���Ǳ�ڵĳ�ͻ��
	function closeDb() {
		db.close();
		console.info("indexedDB�ر���")

	}

	/*
	 * ���ɺ�ȡ��ָ����־�ļ� yyyy-MM-dd-hh24
	 */
	this.downloadLog = function(agentlog_id) {
		alert("��chrome����������迪���鿴������ͨ��������ģʽ��application��indexDB�оͿ��Կ���")
	};

	/*
	 * ���������־���ͷſռ�����õ�
	 */
	this.deleteLog = function(agentlog_id) {
		alert("��chrome����������迪�����������ͨ��������ģʽ��application��indexDB�оͿ����ֶ����")
	}

	/*
	 * д��־�ĺ���
	 */
	this.log = function(loginfo) {
		var now = new Date();
		var yy = now.getFullYear(); // ��
		var mm = now.getMonth() + 1; // ��
		var dd = now.getDate(); // ��
		var hh = now.getHours(); // ʱ
		var ii = now.getMinutes(); // ��
		var ss = now.getSeconds(); // ��
		var ms = now.getMilliseconds(); // ����

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
(function($, doc) {
	var MIN_SOUND_TIME = 800;
	$.init({
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false
			swipe: true, //默认为true
			drag: true, //默认为true
			hold: true, //默认为false，不监听
			release: true //默认为false，不监听
		}
	});
	template.config('escape', false);

	if(mui.os.ios) {
		// 解决在ios上fixed元素focusin时位置出现错误的问题 
		document.addEventListener('DOMContentLoaded', function() {
			var footerDom = document.querySelector('footer');

			document.addEventListener('focusin', function() {
				footerDom.style.position = 'absolute';
			});
			document.addEventListener('focusout', function() {
				footerDom.style.position = 'fixed';
			});
		});
	}

	$.plusReady(function() {
		var _self = plus.webview.currentWebview();
		var groupChatID = _self.groupChatID;
		
		var webSocket = null;
		webSocket = getWebSocket(27);
		
		console.log(webSocket)

		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize"
		});
		
		var showKeyboard = function() {
			if($.os.ios) {
				var webView = plus.webview.currentWebview().nativeInstanceObject();
				webView.plusCallMethod({
					"setKeyboardDisplayRequiresUserAction": false
				});
			} else {
				var Context = plus.android.importClass("android.content.Context");
				var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				var main = plus.android.runtimeMainActivity();
				var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				//var view = ((ViewGroup)main.findViewById(android.R.id.content)).getChildAt(0);
				imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
				//alert("ll");
			}
		};
		var record = null;
		/*var record = [{
			sender: 'zs',
			type: 'text',
			content: 'Hi，欢迎加入活动群聊！'
		}];*/
		setTimeout(function() {
			mui.ajax({
				url: _base_url + '/followme/chat/getGroupChatLog',
				type: 'post', //HTTP请求类型
				/*		headers: {
							'Content-Type': 'application/json'
						},*/
				data: {
					groupChatID: groupChatID
				},
				dataType: 'json', //服务器返回json格式数据
				timeout: 10000,

				success: function(data) {
					for(i = 0; i < data.obj.groupChatInfoList.length; i++) {
						data.obj.groupChatInfoList[i].contentDate = timetrans(data.obj.groupChatInfoList[i].contentDate / 1000);
						data.obj.groupChatInfoList[i].profilePicture = _base_url + data.obj.groupChatInfoList[i].profilePicture;
					}
					userID = data.obj.loginUser.id;
					record = data.obj.groupChatInfoList;
					for(i = 0; i < record.length; i++) {
						record[i].loginUserID = data.obj.loginUser.id;
					}
					
					send(record);
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败!!！" + textStatus);
				}
			});

		}, 1000);

		var ui = {
			body: doc.querySelector('body'),
			footer: doc.querySelector('footer'),
			footerRight: doc.querySelector('.footer-right'),
			footerLeft: doc.querySelector('.footer-left'),
			btnMsgType: doc.querySelector('#msg-type'),
			boxMsgText: doc.querySelector('#msg-text'),
			boxMsgSound: doc.querySelector('#msg-sound'),
			btnMsgImage: doc.querySelector('#msg-image'),
			areaMsgList: doc.querySelector('#msg-list'),
			boxSoundAlert: doc.querySelector('#sound-alert'),
			h: doc.querySelector('#h'),
			content: doc.querySelector('.mui-content')
		};
		ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
		//alert(ui.boxMsgText.offsetWidth );
		var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
		var msgItemTap = function(msgItem, event) {
			var msgType = msgItem.getAttribute('msg-type');
			var msgContent = msgItem.getAttribute('msg-content')
			if(msgType == 'sound') {
				player = plus.audio.createPlayer(msgContent);
				var playState = msgItem.querySelector('.play-state');
				playState.innerText = '正在播放...';
				player.play(function() {
					playState.innerText = '点击播放';
				}, function(e) {
					playState.innerText = '点击播放';
				});
			}
		};
		var imageViewer = new $.ImageViewer('.msg-content-image', {
			dbl: false
		});
		var bindMsgList = function() {
			//绑定数据:
			/*tp.bind({
				template: 'msg-template',
				element: 'msg-list',
				model: record
			});*/
			ui.areaMsgList.innerHTML = template('msg-template', {
				"record": record
			});
			var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
			[].forEach.call(msgItems, function(item, index) {
				item.addEventListener('tap', function(event) {
					msgItemTap(item, event);
				}, false);
			});
			imageViewer.findAllImage();
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
		};
		bindMsgList();
		window.addEventListener('resize', function() {
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
		}, false);
		
		
		
		var send = function(msg) {
			console.log("send----")
			console.log(msg.groupChatID);
			record.push(msg);
			bindMsgList();
			//toRobot(msg.content);
		};
		
		
		
		
		var toRobot = function(info) {
			var apiUrl = 'http://www.tuling123.com/openapi/api';
			$.getJSON(apiUrl, {
				"key": 'acfbca724ea1b5db96d2eef88ce677dc',
				"info": info,
				"userid": plus.device.uuid
			}, function(data) {
				//alert(JSON.stringify(data));
				record.push({
					sender: 'zs',
					type: 'text',
					content: data.text
				});
				bindMsgList();
			});
		};

		function msgTextFocus() {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
		}
		//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchstart', function(event) {
			if(ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchmove', function(event) {
			if(ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		//					ui.footerRight.addEventListener('touchcancel', function(event) {
		//						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		//							msgTextFocus();
		//							event.preventDefault();
		//						}
		//					});
		//					ui.footerRight.addEventListener('touchend', function(event) {
		//						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		//							msgTextFocus();
		//							event.preventDefault();
		//						}
		//					});
		ui.footerRight.addEventListener('release', function(event) {
			if(ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				//showKeyboard();
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
				//							event.detail.gesture.preventDefault();
				 
				var msgText = document.getElementById("msg-text").value;
				var txt = {
					"content": msgText,
					"contentDate": timetrans(Date.parse(new Date())/1000),
					"groupChatID": groupChatID
				};
				
				ui.boxMsgText.value = '';
				$.trigger(ui.boxMsgText, 'input', null);
				webSocket.send(JSON.stringify(txt));
				webSocket.onmessage = function(event) {
					
					console.log(JSON.parse(event.data));
					console.log(event.data);
					var temp = JSON.parse(event.data);
					temp.profilePicture = _base_url + temp.profilePicture;
					console.log(temp.profilePicture);
					send(temp);
		}
				
				
			} else if(ui.btnMsgType.classList.contains('mui-icon-mic')) {
				ui.btnMsgType.classList.add('mui-icon-compose');
				ui.btnMsgType.classList.remove('mui-icon-mic');
				ui.boxMsgText.style.display = 'none';
				ui.boxMsgSound.style.display = 'block';
				ui.boxMsgText.blur();
				document.body.focus();
			} else if(ui.btnMsgType.classList.contains('mui-icon-compose')) {
				ui.btnMsgType.classList.add('mui-icon-mic');
				ui.btnMsgType.classList.remove('mui-icon-compose');
				ui.boxMsgSound.style.display = 'none';
				ui.boxMsgText.style.display = 'block';
				//--
				//showKeyboard();
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
			}
		}, false);
		ui.footerLeft.addEventListener('tap', function(event) {
			var btnArray = [{
				title: "拍照"
			}, {
				title: "从相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "选择照片",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				switch(index) {
					case 0:
						break;
					case 1:
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(path) {
							send({
								sender: 'self',
								type: 'image',
								content: "file://" + plus.io.convertLocalFileSystemURL(path)
							});
						}, function(err) {});
						break;
					case 2:
						plus.gallery.pick(function(path) {
							send({
								sender: 'self',
								type: 'image',
								content: path
							});
						}, function(err) {}, null);
						break;
				}
			});
		}, false);
		var setSoundAlertVisable = function(show) {
			if(show) {
				ui.boxSoundAlert.style.display = 'block';
				ui.boxSoundAlert.style.opacity = 1;
			} else {
				ui.boxSoundAlert.style.opacity = 0;
				//fadeOut 完成再真正隐藏
				setTimeout(function() {
					ui.boxSoundAlert.style.display = 'none';
				}, 200);
			}
		};
		var recordCancel = false;
		var recorder = null;
		var audio_tips = document.getElementById("audio_tips");
		var startTimestamp = null;
		var stopTimestamp = null;
		var stopTimer = null;
		ui.boxMsgSound.addEventListener('hold', function(event) {
			recordCancel = false;
			if(stopTimer) clearTimeout(stopTimer);
			audio_tips.innerHTML = "手指上划，取消发送";
			ui.boxSoundAlert.classList.remove('rprogress-sigh');
			setSoundAlertVisable(true);
			recorder = plus.audio.getRecorder();
			if(recorder == null) {
				plus.nativeUI.toast("不能获取录音对象");
				return;
			}
			startTimestamp = (new Date()).getTime();
			recorder.record({
				filename: "_doc/audio/"
			}, function(path) {
				if(recordCancel) return;
				send({
					sender: 'self',
					type: 'sound',
					content: path
				});
			}, function(e) {
				plus.nativeUI.toast("录音时出现异常: " + e.message);
			});
		}, false);
		ui.body.addEventListener('drag', function(event) {
			//console.log('drag');
			if(Math.abs(event.detail.deltaY) > 50) {
				if(!recordCancel) {
					recordCancel = true;
					if(!audio_tips.classList.contains("cancel")) {
						audio_tips.classList.add("cancel");
					}
					audio_tips.innerHTML = "松开手指，取消发送";
				}
			} else {
				if(recordCancel) {
					recordCancel = false;
					if(audio_tips.classList.contains("cancel")) {
						audio_tips.classList.remove("cancel");
					}
					audio_tips.innerHTML = "手指上划，取消发送";
				}
			}
		}, false);
		ui.boxMsgSound.addEventListener('release', function(event) {
			//console.log('release');
			if(audio_tips.classList.contains("cancel")) {
				audio_tips.classList.remove("cancel");
				audio_tips.innerHTML = "手指上划，取消发送";
			}
			//
			stopTimestamp = (new Date()).getTime();
			if(stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
				audio_tips.innerHTML = "录音时间太短";
				ui.boxSoundAlert.classList.add('rprogress-sigh');
				recordCancel = true;
				stopTimer = setTimeout(function() {
					setSoundAlertVisable(false);
				}, 800);
			} else {
				setSoundAlertVisable(false);
			}
			recorder.stop();
		}, false);
		ui.boxMsgSound.addEventListener("touchstart", function(e) {
			//console.log("start....");
			e.preventDefault();
		});
		ui.boxMsgText.addEventListener('input', function(event) {
			ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
			ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
			ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
			ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
			ui.content.style.paddingBottom = ui.footer.style.height;
		});
		var focus = false;
		ui.boxMsgText.addEventListener('tap', function(event) {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 0);
			focus = true;
			setTimeout(function() {
				focus = false;
			}, 1000);
			event.detail.gesture.preventDefault();
		}, false);
		//点击消息列表，关闭键盘
		ui.areaMsgList.addEventListener('click', function(event) {
			if(!focus) {
				ui.boxMsgText.blur();
			}
		})


	});
}(mui, document));

function timetrans(date) {
	var date = new Date(date * 1000); //如果date为13位不需要乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return Y + M + D + h + m + s;
}

function getWebSocket (loginUserID) {
	if('WebSocket' in window) {
		var url = "ws://" + "192.168.1.110:8080" + "/followme/chat/"+loginUserID;
		console.log(url);
		var webSocket = new WebSocket(url);
		console.log(webSocket);
		//连接发生错误的回调方法
		webSocket.onerror = function() {
			//		vHead.$Message.info("WebSocket连接发生错误")
			console.log("WebSocket连接发生错误")
		};

		//连接成功建立的回调方法
		webSocket.onopen = function() {
			console.log("socket连接")
		}

		

		//连接关闭的回调方法
		webSocket.onclose = function() {
			console.log("onclose")
		}
	} else {
		console.log("当前浏览器不支持socket通信")
	}
	
	return webSocket;
}


// 参数：prop = 属性，val = 值
function createJson(str1,prop, val) {
    // 如果 val 被忽略
    if(typeof val === "undefined") {
        // 删除属性
        delete str1[prop];
    }
    else {
        // 添加 或 修改
        str1[prop] = val;
    }
}
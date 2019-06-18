//mui初始化
mui.init();

mui.plusReady(function() {

	pullupRefresh();

});

function pullupRefresh() {
	setTimeout(function() {
		mui.ajax({
			url: _base_url + '/followme/chat/getUserAllChatLog',
			type: 'post', //HTTP请求类型
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,

			success: function(data) {
				for(i = 0; i < data.obj.length; i++) {
					data.obj[i].groupChatInfoList[data.obj[i].groupChatInfoList.length - 1].contentDate = timetrans(data.obj[i].groupChatInfoList[data.obj[i].groupChatInfoList.length - 1].contentDate / 1000);
				}
				var items = {
					items: data.obj
				};
				var html = template(document.getElementById('tpl').innerHTML, items);
				document.getElementById('chatList').innerHTML = html;

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("请求失败!!！" + textStatus);
			}
		})
	}, 1000);
}

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

//点击跳转到某一个聊天详情界面
function getChatGroup(groupChatID) {
	console.log(groupChatID);
	mui.openWindow({
		url: 'chat.html', //通过URL传参
		extras: {
			groupChatID: groupChatID
		}
	})
}
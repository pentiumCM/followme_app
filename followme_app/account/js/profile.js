mui.init()

var _userinfo;
var isfromloginsuccess = false;

var baseinfo = new Vue({
	el: '#user-baseinfo-id',
	data: {
		item: {},
		login: userHasLogined()
	},
	computed: {
		userName: function() {
			var uname = this.item;
			console.log("用户名称信息：", user)

			return uname;
		},
		isLogined: function() {
			this.login = userHasLogined();
		}
	},
	methods: {
		islogined: function() {
			this.login = userHasLogined();
		}
	}
})

mui.plusReady(function() {
	var wv = plus.webview.currentWebview();

	if(userHasLogined()) {
		console.log("进行用户名填充方法");

		document.getElementById("userName").innerText = getLoginUid();
		document.getElementById("userName").style.size = '20px';

		document.getElementById('user-login-id').addEventListener('tap', function() {
			openNewPage('profile-setting.html', '设置', true);
		})
	} else {
		document.getElementById('user-login-id').addEventListener('tap', function() {
			if(userHasLogined()) {
				return;
			}
			openNewPage('login.html', '登录', true);
		})
	}

})

var pages = ['profile-baseinfo.html'];

function tableDidSelected(row) {
	if(row == 1 || row == 2 || row == 3 || row == 4) {
		if(!userHasLogined()) {
			hud_toast('请先登录');
			return;
		}
	}
	switch(row) {
		case 0:
			openNewPage(pages[0], '修改资料', true, {
				'userinfo': _userinfo || ''
			});
			break;
		case 1:
			openNewPage('me/me-homepage.html', _userinfo['name'] || _userinfo['nickName'], true, {
				'uid': _userinfo['user_id']
			});
			break;
		default:
			break;
	}
}

//用户信息
function getUserProfile() {
	_userinfo = localStorage.getItem('loginuserinfo');
	baseinfo.islogined();
	baseinfo.item = localStorage.getItem('loginuserinfo');

}

//刷新资料
document.addEventListener('update-profile-success', function(event) {
	isfromloginsuccess = true;
	getUserProfile();
})

//退出登录
document.addEventListener('logout-event', function(event) {
	baseinfo.login = false;
	location.reload();
})


//执行刷新
window.addEventListener('refresh', function(e) { //执行刷新
	console.log("执行刷新方法");
	location.reload();
});
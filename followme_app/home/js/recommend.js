/*//mui初始化
mui.init();

//mui加载框架元素成功之后执行此函数
mui.plusReady(function() {
	console.log("进入顶部tab页加载方法");
	/*第一个参数需要传入一个页面的id。需要注意的是，这个页面id 就是我们包含顶部选项卡的页面，也就是当前我们这段js所在的页面*/
	var group = new webviewGroup("recommend.html", {
		/*items数组中传入的是子页对应选项卡该导入的子页面的id，有几个子页就添加几个子页，中间用逗号分隔*/
		items: [{
			id: "recommend.html", //这是子页1的路径
			url: "recommend.html",
			extras: {}
		}, {
			id: "actType.html", //这是子页2的路径
			url: "actType.html",
			extras: {}
		}],
		onChange: function(obj) {
			console.log("进入点击顶部tab方法");
			var c = document.querySelector(".mui-control-item.mui-active");
			if(c) {
				c.classList.remove("mui-active");
			}
			document.querySelector(".mui-scroll .mui-control-item:nth-child(" + (parseInt(obj.index) + 1) + ")").classList.add("mui-active");
		}
	});
	mui(".mui-scroll").on("tap", ".mui-control-item", function(e) {
		var wid = this.getAttribute("data-wid");
		group.switchTab(wid);
	});

});
mui.back = function() {
	var _self = plus.webview.currentWebview();
	_self.close("auto");
}*/

mui.init({
	swipeBack: false,
	keyEventBind: {
		backbutton: false //关闭back按键监听
	},
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
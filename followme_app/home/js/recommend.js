//mui初始化
mui.init();

//mui加载框架元素成功之后执行此函数
mui.plusReady(function() {
	var group = new webviewGroup("recommend.html", {
		items: [{
			id: "recommend.html", 		//这是子页1的路径
			url: "recommend.html",
			extras: {}
		}, {
			id: "actType.html", 		//这是子页2的路径
			url: "actType.html",
			extras: {}
		}],
		onChange: function(obj) {
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
}
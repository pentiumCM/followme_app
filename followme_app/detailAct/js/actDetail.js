//mui初始化
mui.init();
//mui加载框架元素成功之后执行此函数
mui.plusReady(function() {
    
	var _self = plus.webview.currentWebview();
	var actID = _self.actID;
	console.log("zi页面页面接收的id:",actID);
	
	
});

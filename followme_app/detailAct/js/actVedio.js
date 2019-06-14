
var actID = null;
//mui初始化
mui.init();
//mui加载框架元素成功之后执行此函数
mui.plusReady(function() {
    
	var _self = plus.webview.currentWebview();
	actID = _self.actID;
	console.log("vedio");
	console.log("zi页面页面接收的id:",actID);
	
	pullupRefresh();
	
	
});

function pullupRefresh() {
	//业务逻辑代码，比如通过ajax从服务器获取新数据； ...... 
	// 两个注意事项： 
	//1、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后

	setTimeout(function() {
		mui.ajax({
			url: _base_url + '/followme/query/queryActivityVedio',
			type: 'post', //HTTP请求类型
			/*		headers: {
						'Content-Type': 'application/json'
					},*/
			data: {
				actID: actID
			},
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,

			success: function(data) {
				console.log(data.code);
				var content = ''
				if(data.code == 200) { //查询成功
					document.getElementById("videoPath").src = _base_url + data.obj.vedioPath;
					console.log(_base_url + data.obj.vedioPath);
					document.getElementById("videoPath").play();
					$("#beginTime").text(transformTime(data.obj.beginTime = +new Date()));
					$("#clubName").text(data.obj.clubName);
					$("#lookDetail").val(data.obj.description)/*  模态框*/
					$("#beginCity").text(data.obj.beginCity);
					$("#actCost").text('￥'+data.obj.actCost);
					

				}
					//判断是否还有数据,若小于每次加载条数,结束
					//每次加载结束之后，如果还有数据则++,查询下一页数据
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("请求失败!!！" + textStatus);
			}
		})
	}, 1000);
}

function transformTime(timestamp = +new Date()) {
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + addZero(M) + '-' + addZero(d);
      } else {
          return '';
      }
}
function addZero(m) {
    return m < 10 ? '0' + m : m;
}
transformTime(); // "2018-08-08"

function detail(){
	var lookDet=document.getElementById("lookDetail");
	mui.alert(lookDet.value);
}

/*视频播放全屏*/
function getreqfullscreen (root) {
    var root = document.documentElement
    return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen
}
var fullscreen = getreqfullscreen();
function full() {
    fullscreen.call(document.getElementById("video"));
}
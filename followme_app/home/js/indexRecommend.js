//mui初始化
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

/**
 * 上拉加载具体业务实现
 */
var pageNum = 1; //初始从第一页查询
var pageSize = 4; //每页4个
var isOver = false; //是否加载完,默认未加载完，true为已加载完

function pullupRefresh() {
	//业务逻辑代码，比如通过ajax从服务器获取新数据； ...... 
	// 两个注意事项： 
	//1、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后

	setTimeout(function() {
		console.log("标识：", isOver);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(isOver); //参数为true代表没有更多数据了。
		mui.ajax({
			url: 'http://192.168.1.105:8080/followme/query/queryGif',
			type: 'post', //HTTP请求类型
			/*		headers: {
						'Content-Type': 'application/json'
					},*/
			data: {
				pageNum: pageNum,
				pageSize: pageSize
			},
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,

			success: function(data) {
				console.log(data);
				if(data.code == 200) { //查询成功

					var table = document.body.querySelector('.mui-table-view');
					var cells = document.body.querySelectorAll('.mui-table-view-cell');
					console.log("列表数据长度：", data.obj.list.length);
					for(var i = 0; i < data.obj.list.length; i++) {
						var item = data.obj.list[i];
						if(item) {
							var p_id = item.actID;
							var p_gif = item.gifPath;
							var p_clubName = item.clubName;
						}

						var li = document.createElement('li');
						li.className = 'mui-table-view-cell';

						/*渲染video标签*/
						/*li.innerHTML = '<video controls="" autoplay="" name="media" width="100%"><source src="'+p_gif+'" type="video/mp4"></video>';*/
						li.innerHTML = '<a class="mui-navigate-right">俱乐部ID： ' + p_id + '</a>';
						table.appendChild(li);
					}
					//判断是否还有数据,若小于每次加载条数,结束
					if(data.obj.list.length < pageSize) {
						isOver = true;
					}
					//每次加载结束之后，如果还有数据则++,查询下一页数据
					if(isOver == false) {
						pageNum++;
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("请求失败!!！" + textStatus);
				$loadingToast.fadeOut(100);
			}
		})
	}, 1000);
}
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

mui.plusReady(function() {
	pullupRefresh();
})



var count = 0;
var isOver = false; //是否加载完,默认未加载完，true为已加载完
/**
 * 上拉加载具体业务实现
 */
	function pullupRefresh(){
	setTimeout(function() {
		console.log("标识：", isOver);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(isOver);//参数为true代表没有更多数据了。
		mui.ajax({
			url: _base_url + 'followme/query/queryActivityType',
			type: 'post', //HTTP请求类型
			/*		headers: {
						'Content-Type': 'application/json'
					},*/
			dataType: 'json', //服务器返回json格式数据
			timeout: 10000,

			success: function(data) {
				console.log(data);
				var content=''
				if(data.code == 200) { //查询成功
					var table = document.body.querySelector('.mui-table-view');   //返回匹配的第一个元素
					table.innerHTML=""  
					console.log("列表数据长度：", data.obj.length);
					for(var i = 0; i < data.obj.length; i++) {
						var item = data.obj[i];
						if(item) {
							var des = item.description;          //活动图片描述
							var id = item.id;                    //活动图片ID
							var picUrl= item.pictureUrl;         //活动图片地址
						}
						var li = document.createElement('div');
						li.className = 'mui-table-view-cell';
						console.log(picUrl);
						/*渲染图片*/
						content='<div id="picture" class="mui-col-xs-6 "><img src="'+ _base_url +picUrl+'"><label>'+des+'</label></div>'
						
						li.innerHTML=content
						table.appendChild(li);
					}
/*					//判断是否还有数据,若小于每次加载条数,结束
					if(data.obj.list.length < pageSize) {
						isOver = true;
					}
					//每次加载结束之后，如果还有数据则++,查询下一页数据
					if(isOver == false) {
						pageNum++;
					}*/
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("请求失败!!！" + textStatus);
			}
		})
	}, 1000);
}
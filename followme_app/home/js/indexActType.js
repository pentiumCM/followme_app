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
var count = 0;
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	var content=''
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
		var table = document.body.querySelector('.mui-table-view');
		var cells = document.body.querySelectorAll('.mui-table-view-cell');
		for(var i = cells.length, len = i + 20; i < len; i++) {
			var li = document.createElement('div');
/*			li.className = 'mui-table-view-cell';
			content='<div id="details" class="mui-col-xs-4 "><img src="http:'+p_gif+'"> <p>'
			+p_clubName+'</p><br/><p><input name="checkbox" type="checkbox" class="Checkbox"><label>'+p_clubName+'</label>&nbsp;<label>￥'+p_actCost+'</label></p></div>'
						li.innerHTML=content*/
						table.appendChild(li);
			table.appendChild(li);
		}
	}, 1000);
}
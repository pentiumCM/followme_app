var pageStart = 0; //开始数据条数
var pageSize = 10; //每页显示条数
var isOver = false; //是否加载完,默认未加载完，true为已加载完


function getData() {
	var url = requestUrl;
	$.ajax({
		type: "get",
		url: url,
		timeout: 10000,
		data: {
			startLimit: _startLimit
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			if(data.success == true) {
				var list = data.data;

				for(i in list) {
					str = "";
					//$(".contentDiv").append(str);
					jQuery(str).insertBefore('#pullrefresh .mui-scroll .mui-table-view');
				}
				//判断是否还有数据,若小于每次加载条数,结束
				if(list.length < pageSize) {
					isOver = true;
				}
				//每次加载结束之后，如果还有数据则++
				if(isOver == false) {
					pageStart++;
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("请求失败!!！" + textStatus);
			$loadingToast.fadeOut(100);
		}
	});
}
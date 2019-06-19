//api接口定义


/**
 * type:请求类型
 * url:地址
 * pars:参数
 * success:成功回调
 * error:失败回调
 */
function _ajax (type , url , pars , success , error){
	if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.toast('无法连接网络!', {
			verticalAlign: 'top'
		});return;
	}
	
	var u = url;
	var token = localStorage.getItem("userToken");

	mui.ajax(u,{
			data:pars,
			headers:{'Content-Type':'application/json'},	 
			dataType:'json',
			type:type,
			timeout:20000,
			
			success:function(data){
				console.log("登录返回信息：",data);
				if('200' == data.status) {
					success(data);			// data
				}else{
					if(error){
						error(data['msg'] || '服务器返回错误');	
					}
				}
			},
			
			error:function(xhr,type,errorThrown){
				console.log('服务器返回错误:' + type);
				if(error){
					error('请求网络失败!');
				}
			}
	});
}

/**
 * Get请求操作
 */
function api_get(url , pars , success , error){
	_ajax('get' , url , pars , success , error);
}

/**
 * Post请求操作
 */
function api_post(url , pars , success , error){
	_ajax('post' , url , pars , success , error);
}


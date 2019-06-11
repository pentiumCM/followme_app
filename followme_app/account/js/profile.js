//mui初始化
mui.init();

//点击我的订单跳转
function tableDidSelected(type , cat_title){
	console.log(type);
	openNewPage('home_sub.html' , cat_title , true , {'typeId':type});
}

 
document.getElementById('user-baseinfo-id').addEventListener('tap', function() {
		mui.openWindow({
			url: 'login.html', //通过URL传参
		})
});
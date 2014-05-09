/**
* 模块依赖
*/

var net = require('net'),
	count = 0,
	user = {},
/**
* 创建服务器
*/
	server = net.createServer(function (conn){
		conn.setEncoding('utf8');
		//代表当前连接的昵称
		var nickname;
		conn.write(
			' > Welcome to \033[92mnode-chat\033[39m!\r\n' +
			' > ' + count + ' other people are connected at this time.\r\n' +
			' > please write your name and press enter: '
		);
		count++;
		
		conn.on('data', function (data) {
			//删除回车符
			data = data.replace('\r\n', '');
			
		})
		
		conn.on('close', function () {
			count--;
		})
	});
/**
* 监听
*/
server.listen(3000, function () {
	console.log('\033[96m	server listening on *:3000\033[39m');
});
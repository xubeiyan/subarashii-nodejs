const fs = require('fs');

let input = process.argv[2]  || 'block_ip.txt';
let output = process.argv[3] || 'output.txt';

fs.readFile(input, 'utf-8', (err, data) => {
	if (err) throw err;
	let ip_arr = data.split('\r\n');
	// console.log(ip_arr);
	
	let sorted = ip_arr.sort((a, b) => {
		let a_arr = a.split('.');
		let b_arr = b.split('.');
		
		if (Number(a_arr[0]) > Number(b_arr[0])) {
			return 1;
		} else if (Number(a_arr[0]) < Number(b_arr[0])) {
			return -1;
		}
		
		if (Number(a_arr[1]) > Number(b_arr[1])) {
			return 1;
		} else if (Number(a_arr[1]) < Number(b_arr[1])) {
			return -1;
		}
		
		if (Number(a_arr[2]) > Number(b_arr[2])) {
			return 1;
		} else if (Number(a_arr[2]) < Number(b_arr[2])) {
			return -1;
		}
		
		if (Number(a_arr[3]) > Number(b_arr[3])) {
			return 1;
		} else if (Number(a_arr[3]) < Number(b_arr[3])) {
			return -1;
		}
		
		return 0;
	});
	
	fs.writeFile(output, sorted.join('\r\n'), {encoding: 'utf-8'}, (err) => {
		if (err) throw err;
		console.log('ip sort complete, from ' + input + ' to ' + output + '...');
	});
});


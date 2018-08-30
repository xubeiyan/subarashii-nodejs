const fs = require('fs');

let input = process.argv[2]  || 'block_ip.txt';
let output = process.argv[3] || 'output.txt';

fs.readFile(input, 'utf-8', (err, data) => {
	if (err) throw err;
	let ip_arr = data.split('\r\n');
	// console.log(ip_arr);
	
	let sorted = ip_arr.sort((a, b) => {
		let a_arr = a.split('.').map(x => Number(x));
		let b_arr = b.split('.').map(x => Number(x));
		
		for (let i = 0; i < a_arr.length; ++i) {
			if (a_arr[i] > b_arr[i]) {
				return 1;
			} else if (a_arr[i] < b_arr[i]) {
				return -1;
			}
		}
		
		return 0;
	});
	
	fs.writeFile(output, sorted.join('\r\n'), {encoding: 'utf-8'}, (err) => {
		if (err) throw err;
		console.log('ip sort complete, from ' + input + ' to ' + output + '...');
	});
});


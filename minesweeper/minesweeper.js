var minesweeper = function () {
	var mineArea = document.getElementById('mine'),
		statsArea = document.getElementById('stats'),
		diffString = window.location.search,
		difficulty = ['10|9|9', '40|16|16', '99|30|16'], // 难度
		rows, columns, mineNum, sideLen = 40,
		NOTMINE = 0, ISMINE = 1, // 分别是不是雷，是雷
		NOTPLACED = 0, FLAGED = 1, NOTCONFIRM = 2, NUMBERED = 3, // 未标记，标记是雷（旗子，可能不是），不确定是不是雷（以？表示）, 已经被点出来(数字)
		gameState = 'start', // 游戏状态，有start，sweeping，win和boom四个状态
		remains = [],
		userStatus = [],
		remainsNotMines,  // 剩余的不是雷的方块
		// 初始化雷区，notPlaceMineIndex为第一下点到了雷则重新排布雷区
		init = function (notPlaceMineIndex) { 
			// 根据难度选择生成的格子数
			if (diffString == '') {
				diffString = '?easy';
			}
			
			var difficultText;
			// console.log(diffString);
			if (diffString == '?easy') {
				difficultText = difficulty[0];
			} else if (diffString == '?medium') {
				difficultText = difficulty[1];
			} else if (diffString == '?hard') {
				difficultText = difficulty[2];
			}
			mineNum = parseInt(difficultText.split('|')[0]);
			rows = parseInt(difficultText.split('|')[1]);
			columns = parseInt(difficultText.split('|')[2]);
			
			remainsNotMines = rows * columns - mineNum;
			
			console.log('change status to "start"...');
			console.log('this difficulty is ' + difficultText);
			
			// 初次运行则增加rows x columns的格子作为点的区域
			if (notPlaceMineIndex == undefined) {
				for (var i = 0; i < rows * columns; ++i) {
					var div = document.createElement('div');
					div.className = 'pic e';
					div.id = '' + i;
					div.addEventListener('click', click),
					div.addEventListener('contextmenu', function(e) {
						e.preventDefault();
						click(e);
					}),
					mineArea.appendChild(div);
				}
			}
			
			// 初始化用户点选状态
			for (var i = 0; i < rows * columns; ++i) {
				userStatus[i] = NOTPLACED;				
			}
			
			// 随机放置十枚雷
			var mines = [];
				
			for (var prepare = Math.floor(Math.random() * rows * columns); mines.length < mineNum; prepare = Math.floor(Math.random() * rows * columns)) {
				// 再生成则跳过点击的点
				if (notPlaceMineIndex != undefined) {
					if (prepare == notPlaceMineIndex) {
						continue;
					}
				}
				if (mines.indexOf(prepare) == -1) {
					mines.push(prepare);
				}
			};
			// console.log(mines.sort(function (a, b) {return a - b;}));
			for (var i = 0; i < rows * columns; ++i) {
				if (mines.indexOf(i) == -1) {
					remains[i] = NOTMINE;
				} else {
					remains[i] = ISMINE;
				}
			}
			// console.log(remains);
			printMines();
			// console.log(remains);
			// 修改div的宽度与高度
			mineArea.style.width = rows * sideLen + 'px';
			mineArea.style.height = columns * sideLen + 'px';
			gameState = 'start';
		},
		// 随便点一个
		click = function (event) {
			if (!(gameState == 'start' || gameState == 'sweeping')) {
				return;
			}
			var y = Math.floor(event.target.id / rows),
				x = event.target.id - y * rows;
			// 左键
			if (event.button == 0) {
				// 第一下点到雷需要重排雷并点开这个点
				if (gameState == 'start' ) {
					if (remains[event.target.id] == 1) {
						console.log('recreate the mines area...');
						init(event.target.id);
						around(x, y);
					}
					gameState = 'sweeping';
					console.log('change status to "sweeping"...');
				} 
				statsArea.innerHTML = '还剩' + remainsNotMines + '块';
				
				console.log('Left click: x->' + x + ' y->' + y);
				if (remains[event.target.id] == 1) {
					boom(event.target.id);
				} else {
					around(x, y);
				}
				if (remainsNotMines == 0) {
					win();
				}
			// 右键
			} else if (event.button == 2) {
				console.log('Right click: x->' + x + ' y->' + y);
				
				var boxStatus = userStatus[event.target.id];
				// 若是已经点出来的就不作任何操作
				if (boxStatus == NUMBERED) {
					return;
				}
				
				if (boxStatus == NOTPLACED) {
					userStatus[event.target.id] = FLAGED;
					document.getElementById('' + event.target.id).className = 'pic f';
				} else if (boxStatus == FLAGED) {
					userStatus[event.target.id] = NOTCONFIRM;
					document.getElementById('' + event.target.id).className = 'pic m';
				} else {
					userStatus[event.target.id] = NOTPLACED;
					document.getElementById('' + event.target.id).className = 'pic e';
				}
			}
		},
		// 检查周围八个格子
		around = function (x, y) {
			if (x < 0 || x > rows - 1) {
				return;
			}
			if (y < 0 || y > columns - 1) {
				return;
			}
			
			if (userStatus[x + y * rows] == NUMBERED) {
				return;
			}
			var aroundMinesNum = 0,
				check = function (xPos, yPos) {
					if (xPos < 0 || xPos > rows - 1) {
						return;
					}
					if (yPos < 0 || yPos > columns - 1) {
						return;
					}
					if (remains[yPos * rows + xPos] == 1) {
						aroundMinesNum += 1;
					}
				};
			userStatus[x + y * rows] = NUMBERED;
			
			check(x - 1, y - 1);
			check(x - 1, y);
			check(x - 1, y + 1);
			check(x, y - 1);
			check(x, y + 1);
			check(x + 1, y - 1);
			check(x + 1, y);
			check(x + 1, y + 1);
			
			// 周围没有则对周围八个格子进行测试
			if (aroundMinesNum == 0) {
				// console.log("x:" + x + " y:" + y + ' aroundMinesNum:' + aroundMinesNum);
				document.getElementById('' + (x + rows * y)).className = 'pic zero';
				around(x - 1, y - 1);
				around(x - 1, y);
				around(x - 1, y + 1);
				around(x, y - 1);
				around(x, y + 1);
				around(x + 1, y - 1);
				around(x + 1, y);
				around(x + 1, y + 1);
				remainsNotMines -= 1;
			} else {
				// console.log("x:" + x + " y:" + y + ' aroundMinesNum:' + aroundMinesNum);
				// 有则根据aroundMinesNum绘制数字
				if (aroundMinesNum == 1) {
					document.getElementById('' + (x + rows * y)).className = 'pic one';
				} else if (aroundMinesNum == 2) {
					document.getElementById('' + (x + rows * y)).className = 'pic two';
				} else if (aroundMinesNum == 3) {
					document.getElementById('' + (x + rows * y)).className = 'pic three';
				} else if (aroundMinesNum == 4) {
					document.getElementById('' + (x + rows * y)).className = 'pic four';
				} else if (aroundMinesNum == 5) {
					document.getElementById('' + (x + rows * y)).className = 'pic five';
				} else if (aroundMinesNum == 6) {
					document.getElementById('' + (x + rows * y)).className = 'pic six';
				} else if (aroundMinesNum == 7) {
					document.getElementById('' + (x + rows * y)).className = 'pic seven';
				} else if (aroundMinesNum == 8) {
					document.getElementById('' + (x + rows * y)).className = 'pic eight';
				}
				remainsNotMines -= 1;
			}
		},
		// 点到了雷
		boom = function (id) {
			console.log('change status to "boom"...');
			gameState = 'boom';
			statsArea.innerHTML = 'boom';
			for (var i = 0; i < rows * columns; ++i) {
				if (remains[i] == 1) {
					document.getElementById('' + i).className = 'pic q';
				}
			}
			document.getElementById(id).className = 'pic x';
		},
		
		// 胜利
		win = function () {
			console.log('change status to "win"...');
			gameState = 'win';
			for (var i = 0; i < rows * columns; ++i) {
				if (remains[i] == 1) {
					document.getElementById('' + i).className = 'pic f';
				}
			}
			statsArea.innerHTML = 'win';
		},
		// 打印用户点击信息 
		printUserStatus = function () {
			var output = '';
			for (var i = 0; i < line; ++i) {
				output += userStatus.slice(columns * i, columns * i + 30) + "\n";
			}
			console.log(output);
		},
		
		// 打印某个作弊（！）信息
		printMines = function () {
			var output = '',
				perline = rows;
			
			for (var i = 0; i < columns; ++i) {
				var start = rows * i,
					end = start + rows;
					
				// console.log('start: ' + start + ' end:' + end);
				output += remains.slice(start, end) + "\n";
			}
			console.log(output);
		};
		
	init();
	// mineArea.addEventListener('click', click);
};
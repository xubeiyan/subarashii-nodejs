var minesweeper = function () {
	var mineArea = document.getElementById('mine'),
		statsArea = document.getElementById('stats'),
		mines = 10, rows = 10, columns = 10, sideLen = 40,
		gameState = 'start', // 游戏状态
		remains = [],
		remainsNotMines = rows * columns - mines,
		init = function () { // 初始化雷区
			for (var i = 0; i < rows * columns; ++i) {
				remains[i] = i;
				var div = document.createElement('div');
				div.className = 'pic e';
				div.id = '' + i;
				div.addEventListener('click', click)
				mineArea.appendChild(div);
			}
			// 随机放置十枚雷
			var mines = [];
				
			for (var prepare = Math.floor(Math.random() * 100); mines.length < 10; prepare = Math.floor(Math.random() * 100)) {
				if (mines.indexOf(prepare) == -1) {
					mines.push(prepare);
				}
			};
			// mines = mines.sort()
			for (var i = 0; i < rows * columns; ++i) {
				if (mines.indexOf(i) == -1) {
					remains[i] = 0;
				} else {
					remains[i] = 1;
				}
			}
			// console.log(remains);
			printMines(10, 10);
			gameState = 'start';
		},
		// 随便点一个
		click = function (event) {
			if (gameState != 'start') {
				return;
			}
			var y = Math.floor(event.target.id / 10),
				x = event.target.id - y * 10;
			console.log('click: x->' + x + ' y->' + y);
			if (remains[event.target.id] == 1) {
				boom(event.target.id);
			} else {
				around(x, y);
			}
			console.log('还剩' + remainsNotMines + '块');
			if (remainsNotMines == 0) {
				win();
			}
		},
		// 检查周围八个格子
		around = function (x, y) {
			if (x < 0 || x > 9) {
				return;
			}
			if (y < 0 || y > 9) {
				return;
			}
			
			if (remains[x + y * rows] == 2) {
				return;
			}
			var aroundMinesNum = 0,
				check = function (xPos, yPos) {
					if (xPos < 0 || xPos > 9) {
						return;
					}
					if (yPos < 0 || yPos > 9) {
						return;
					}
					if (remains[yPos * rows + xPos] == 1) {
						aroundMinesNum += 1;
					}
				};
			remains[x + y * rows] = 2;
			
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
		}
		// 点到了雷
		boom = function (id) {
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
			gameState = 'win';
			for (var i = 0; i < rows * columns; ++i) {
				if (remains[i] == 1) {
					document.getElementById('' + i).className = 'pic f';
				}
			}
			statsArea.innerHTML = 'win';
		},
		printMines = function (line, perline) {
			var output = '';
			for (var i = 0; i < line; ++i) {
				output += remains.slice(rows * i, rows * i + perline) + "\n";
			}
			console.log(output);
		};
		
	init();
	// mineArea.addEventListener('click', click);
};
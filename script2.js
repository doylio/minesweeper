//Global variables and constants
const startBtn = document.querySelector(".startBtn");
const board = document.querySelector("#board");
let map = [];
let mineNum;
let boardSize;


//Returns error number
const errorLog = (n) => {
	if (n === 1 || n === 2) {
		return "Please enter valid numbers.";
	}
	if (n === 4) {
		return "Board size too big!";
	}
	if (n === 5) {
		return "Board size must be greater than zero";
	}

};

//Display error message
const errorDisplay = (text) => {
	const displayDiv = document.querySelector("#errorDisplay");
	displayDiv.firstElementChild.remove();
	node = document.createElement("p");
	node.appendChild(document.createTextNode(text));
	displayDiv.appendChild(node);
};

//Checks boardsize input for errors
const checkInputs = (boardSize, mineNum) => {
	if(isNaN(boardSize)) {
		return 1;
	}
	if(boardSize > 30) {
		return 4;
	}
	if(boardSize <= 0) {
		return 5;
	}

	return 0;
};

//Colors cell red if scroll down, undoes if scroll up
const highlite = (event) => {
	if(event.deltaY > 0) {
		event.target.style.backgroundColor = "red";
	}
	else if(event.deltaY < 0) {
		event.target.style.backgroundColor = "";
	}
};

//Returns boolean value if cell(r,c) is adjacent to cell(x,y)
const isAdjacent = (r, c, x, y) => {
	if((r - x > 1 || r - x < -1) || (c - y > 1 || c - y < -1)) {
		return false;
	}
	return true;
}

//Resets game
const restart = () => {
	document.querySelector(".startBtn").remove();
	while(board.children.length > 0) {
		board.firstElementChild.remove();
	}
	runGame();
};

//Automatically clears cells around zero values
const zeroCheck = () => {
	for(let c = 0; c < boardSize; c++) {
		for(let i = 0; i < boardSize; i++) {
			for(let j = 0; j < boardSize; j++) {
				for(let k = -1; k < 2; k++) {
					for(let l = -1; l < 2; l++) {
						//Exclude values which will go outside the array
						if((i + k) >= 0 && (i + k) < boardSize && (j + l) >= 0 && (j + l) < boardSize) {
							//Exclude current cell
							if(k !== 0 || l !== 0) {
								if(board.children[i + k].children[j + l].firstElementChild.innerText === "0") {
									sweepBtn(i, j);
								}
							}
						}
					}
				}
			}
		}
	}
}

//Returns boolean value of game win-state
const won = () => {
	if (document.querySelectorAll("button").length === mineNum) {
		return true;
	}
	return false;
};

//Removes a cell and replaces it with corresponding value in map[]
const sweepBtn = (row, column) => {
	//Format row and column to number
	row = Number(row);
	column = Number(column);

	//remove button
	const curCell = board.children[row].children[column];
	curCell.firstElementChild.remove();

	//replace with number from map[]
	let node = document.createElement("p");
	node.appendChild(document.createTextNode(map[row][column]));
	curCell.appendChild(node);


};

//Creates reset button
const resetBtn = () => {
	if(document.querySelector(".startBtn") === null) {
		let node = document.createElement("div");
		node.appendChild(document.createTextNode("Reset"));
		node.classList.add("startBtn");
		document.querySelector("body").appendChild(node);
		node.addEventListener("click", restart);
	}
}

//Activates when a cell is clicked
let clickCell = (event) => {
	const curRow = event.target.parentElement.classList[0];
	const curCol = event.target.classList[0];

	//Execute only on first cell click
	//Ensures that first click is a zero
	if(document.querySelectorAll("button").length === boardSize ** 2) {
		//Initialize mine array
		for(let i = 0; i < boardSize; i++) {
			map[i] = [];
		}
		//Randomly assign mineNum cells as mines
		let curMines = 0;
		while(curMines < mineNum) {
			let p = Math.floor(Math.random() * boardSize);
			let q = Math.floor(Math.random() * boardSize);
			if(map[p][q] === undefined) {
				if(!isAdjacent(curRow, curCol, p, q)){
					map[p][q] = "M";
					curMines++;
				}
			}
		}

		//Set all non mines to zero
		for(let i = 0; i < boardSize; i++) {
			for(let j = 0; j < boardSize; j++) {
				if(map[i][j] !== "M") {
					map[i][j] = 0;
				}
			}
		}

		//Iterate over each cell
		for(let i = 0; i < boardSize; i++) {
			for(let j = 0; j < boardSize; j++) {
				//Excludes mines
				if(map[i][j] !== "M") {
					//Iterate over cells within 1 of current cell
					for(let k = -1; k < 2; k++) {
						for(let l = -1; l < 2; l++) {
							//Exclude values which will go outside the array
							if((i + k) >= 0 && (j + l) >= 0 && (i + k) < boardSize && (j + l) < boardSize) {
								if(map[i + k][j + l] === "M") {
									map[i][j]++;
								}
							}
						}
					}
				}
			}
		}
	}

	//Check for mine
	if(map[curRow][curCol] === "M") {
		alert("BOOM!\nYou hit a mine...");
		resetBtn();
	}
	
	//Remove button
	else {
		sweepBtn(curRow, curCol);
	}

	//Auto clears cells around zero values
	if(map[curRow][curCol] === 0) {
		zeroCheck();
	}

	//Check for win
	if(won()) {
		alert("You win!!!");
		//Restart button
		resetBtn();
	}
};

//Activates when start button is pressed or game is reset
const runGame = () => {
	//Initialize page
	let row;
	let col;
	let newBtn;
	for(let i = 0; i < boardSize; i++) {
		row = document.createElement("div");
		board.appendChild(row);
		row.style.width = (boardSize * 20) + "px";
		for(let j = 0; j < boardSize; j++) {
			col = document.createElement("div");
			row.appendChild(col);
			col.classList.add(i);
			newBtn = document.createElement("button");
			newBtn.classList.add(j);
			col.appendChild(newBtn);
			newBtn.addEventListener("click", clickCell);
			newBtn.addEventListener("mousewheel", highlite);
		}
	}


	//Initialize mine array
	for(let i = 0; i < boardSize; i++) {
		map[i] = [];
	}
	//Randomly assign mineNum cells as mines
	let curMines = 0;
	while(curMines < mineNum) {
		let p = Math.floor(Math.random() * boardSize);
		let q = Math.floor(Math.random() * boardSize);
		if(map[p][q] === undefined) {
			map[p][q] = "M";
		}
		curMines++;
	}

	//Set all non mines to zero
	for(let i = 0; i < boardSize; i++) {
		for(let j = 0; j < boardSize; j++) {
			if(map[i][j] !== "M") {
				map[i][j] = 0;
			}
		}
	}

	//Iterate over each cell
	for(let i = 0; i < boardSize; i++) {
		for(let j = 0; j < boardSize; j++) {
			//Excludes mines
			if(map[i][j] !== "M") {
				//Iterate over cells within 1 of current cell
				for(let k = -1; k < 2; k++) {
					for(let l = -1; l < 2; l++) {
						//Exclude values which will go outside the array
						if((i + k) >= 0 && (j + l) >= 0 && (i + k) < boardSize && (j + l) < boardSize) {
							if(map[i + k][j + l] === "M") {
								map[i][j]++;
							}
						}
					}
				}
			}
		}
	}
	console.log(map);

};

//Takes initial inputs and processes them before running runGame()
//Activates when start button pressed
const inputCheck = () => {
	//Declare variables
	let check;
	boardSize = Number(document.querySelectorAll("input")[0].value);
	mineNum = Math.floor((boardSize ** 2) / 5);


	//Input error checking
	check = checkInputs(boardSize, mineNum);
	if(check !== 0) {
		errorDisplay(errorLog(check));
		console.log("Error #" + check);
		return check;
	}
	else {
		errorDisplay("");
	}

	document.querySelector("#startMenu").remove();
	runGame();
}



//Page code
startBtn.addEventListener("click", inputCheck);
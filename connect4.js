/*
* Connect Four
* Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
* column until a player gets four-in-a-row (horiz, vert, or diag) or until
* board fills (tie)
*/
const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/* 
* makeBoard: create in-JS board structure:
* board = array of rows, each row is array of cells (board[y][x])
*/
function makeBoard(){
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  let tempBoard = [];
  for(let y = 1; y <= HEIGHT; y++){
    for(let x = 1; x <= WIDTH; x++){
      tempBoard.push(null) ;
    }
    board.push(tempBoard);
    tempBoard = [];
  }
}


/*
* makeHtmlBoard: make HTML table and row of column tops. 
*/
function makeHtmlBoard(){
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  // Create a TR element for the first row of the board
  let top = document.createElement("tr");
  // Set the ID attribute "column-top" to the row
  top.setAttribute("id", "column-top");
  // Add a "click" event to execute the "handleClick" function when a cell in the first row of the board is clicked
  top.addEventListener("click", handleClick);

  // Loop through the number of "WIDTH" to add the columns to the first row of the board
  for (let x = 0; x < WIDTH; x++) {
    // Create a "TD" element
    let headCell = document.createElement("td");
    // Add the ID "X value" attribute to the created column
    headCell.setAttribute("id", x);
    // Add the created column to the first row of the board
    top.append(headCell);
  }
  // Add the first row created to the table "board"
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Loop through the number of "HEIGHT" to add the rows the board
  for (let y = 0; y < HEIGHT; y++) {
    // Create a TR element the board game
    const row = document.createElement("tr");
    // Loop through the number of "WIDTH" to add the columns to each row of the board
    for (let x = 0; x < WIDTH; x++) {
      // Create a "TD" element
      const cell = document.createElement("td");
      // Add the ID "Y-X" attribute for the cell position on the board
      cell.setAttribute("id", `${y}-${x}`);
      // Add the created column to row created before
      row.append(cell);
    }
  // Add the row created to the table "board"
    htmlBoard.append(row);
  }
}


/*
* findSpotForCol: given column x, return top empty y (null if filled) 
*/
function findSpotForCol(x){
  // TODO: write the real version of this, rather than always returning 0
  // check each row and column if the value is "null"
  for(let y = board.length - 1; y >= 0; y--){
    const boardRow = board[y];
    if(boardRow[x] == null){
      // return the top empty row to put the piece in that column
      return y;
    }
  }
  // if the column is filled return "null"
  return null;
}


/*
* placeInTable: update DOM to place piece into HTML table of board 
*/
function placeInTable(y, x){
  // TODO: make a div and insert into correct table cell
  // get "y-x" table cell clicked to put a new piece in the column
  let tableCell = document.getElementById(`${y}-${x}`);
  // create a new div element to put a piece in the board
  const newPlayerPiece = document.createElement("div");
  // add the "piece" class to the new div
  newPlayerPiece.setAttribute("class", "piece");
  // add the "p1" or "p2" class to the div
  newPlayerPiece.classList.add("p" + currPlayer);
  // add the new div to the cell in the board
  tableCell.append(newPlayerPiece);
  // update the board matrix with de player number
  board[y][x] = currPlayer;
}


/*
* endGame: announce game end 
*/
function endGame(msg) {
  // TODO: pop up alert message
  window.alert(msg);
}


/*
* handleClick: handle click of column top to play piece 
*/
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if(y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  if(y !== null){
    placeInTable(y, x);
  }

  // check for win
  if(checkForWin()){
    return endGame(`Player ${currPlayer} is the winner!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  let filledCellsResult = [];
  for(let y = 0; y < board.length; y++){
    const boardRow = board[y];
    filledCellsResult.push(boardRow.every(value => value > 0));
  }
  if(filledCellsResult.every(result => result == true)){
    // if all cells are filled call endGame function
    endGame();
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}


/*
* checkForWin: check board cell-by-cell for "does a win start here?" 
*/
function checkForWin(){
  function _win(cells){
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // start a loop to check the array for each column
  for (let y = 0; y < HEIGHT; y++){
    // start a loop to check the array for each row
    for (let x = 0; x < WIDTH; x++){
      // 4 variables are declared with the possible ways to win (horizontal, vertical or diagonal)
      // horizontal option: find the position of the piece of the player and check in the next 3 columns if the pieces are from the player changing the X value (adding 1)
      const horiz  = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // vertical option: find the position of the piece of the player and check in the next 3 rows if the pieces are from the player changing the Y value (adding 1)
      const vert   = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagonal right option: find the position of the piece of the player and check in the next 3 columns/rows if the pieces are from the player changing the Y,X value (adding 1)
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // diagonal left option: find the position of the player's piece and check in the previous 3 columns/rows if the pieces are the player's changing the Y,X value (less 1)
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // call the _win function and send the coordinates of the possible player pieces, it checks if all the pieces are in those coordinates. If any of the conditions is true, the true value is returned to execute the endGame function
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
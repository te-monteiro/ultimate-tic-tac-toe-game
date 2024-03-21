// Initialize your game state, e.g., the 3x3 grid of smaller tic-tac-toe boards
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];


const superBoard = [['','', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']]

  
  // Keep track of the last move's position
  let lastMove = { superRow: -1, superCol: -1 };
  
  // Method to make the next move
  function makeNextMove(currentPlayer, subRow, subCol) {
     if (isInitialMove()) {
        // Handle the case where it's the first move
        return lastMove.superRow === -1 && lastMove.superCol === -1;
    }else if (!isInitialMove()) {
        // Check if it's not the first move
      // Update the last move's position
      lastMove = { superRow: Math.floor(subRow / 3), superCol: Math.floor(subCol / 3) };
  
      // Determine the corresponding small Tic Tac Toe board
      const superRow = lastMove.superRow;
      const superCol = lastMove.superCol;
  
      // Check if the corresponding board is not won or full
      if (!isBoardWon(superRow, superCol) && !isBoardFull(superRow, superCol)) {
        // Make the move in the corresponding small Tic Tac Toe board
        board[superRow][superCol][subRow][subCol] = currentPlayer;
  
        // Check if the player has completed three small boards in a row
        if (hasCompletedSuperBoard(currentPlayer)) {
          console.log(currentPlayer, 'wins!')
          endSuperGame()
        } else if (isDraw()) {
          console.log('The game is a draw!')
          endSuperGame()
        }
  
        // Return the position of the cell and subcell
        return { superRow, superCol, subRow, subCol };
      }
    } else {
      // Handle the case where the corresponding board is won or full
      // Find an open small board and make the move there
      const openBoard = findOpenBoard();
      if (openBoard) {
        const { openSuperRow, openSuperCol } = openBoard;
        board[openSuperRow][openSuperCol][subRow][subCol] = currentPlayer;
  
        // Check if the player has completed three small boards in a row
        if (hasCompletedSuperBoard(currentPlayer)) {
          console.log(`${currentPlayer} wins!`);
          endSuperGame()
        } else if (isDraw()) {
          console.log('The game is a draw!');
          endSuperGame()
        }
  
        return { superRow: openSuperRow, superCol: openSuperCol, subRow, subCol };
      }
    }
}
  
// Method to check if a small Tic Tac Toe board is won
function isSmallBoardWon(superRow, superCol) {
    // Define all winning combinations
    const winningCombinations = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
    ];

    // Check each winning combination
    for (const combination of winningCombinations) {
    const [cell1, cell2, cell3] = combination;
    const [row1, col1] = cell1;
    const [row2, col2] = cell2;
    const [row3, col3] = cell3;

    // Save the positions of the winning cells
    const winningCells = [
        [superRow * 3 + row1, superCol * 3 + col1],
        [superRow * 3 + row2, superCol * 3 + col2],
        [superRow * 3 + row3, superCol * 3 + col3]
    ];

    // Check if the cells have the same value (X or O)
    const value = board[superRow][superCol][row1][col1];
    if (value !== '' && value === board[superRow][superCol][row2][col2] && value === board[superRow][superCol][row3][col3]) {
        // Replace the subcells with 'X' or 'O' in a temporary logical board
        const logicalBoard = createLogicalBoard();
        for (const [row, col] of winningCells) {
        logicalBoard[row][col] = value;
        }

        // Return the position of the winning cell
        endSmallGame()
        return { winningCells, logicalBoard };
    }
    }
    // If no winning combination is found, return null
    return null;
}

// Method to check if a small Tic Tac Toe board is a draw
function isSmallBoardDraw(superRow, superCol) {
    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (board[superRow][superCol][i][j] === '') {
        return false; // If any cell is empty, the board is not a draw
        }
    }
    }
    // If all cells are filled, determine the winner based on the player with the most symbols
    let countX = 0;
    let countO = 0;
    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (board[superRow][superCol][i][j] === 'X') {
        countX++;
        } else if (board[superRow][superCol][i][j] === 'O') {
        countO++;
        }
    }
    }

    if (countX > countO) {
    return 'X'; // 'X' wins the smaller board
    } else if (countO > countX) {
    return 'O'; // 'O' wins the smaller board
    } else {
    return 'draw'; // It's a draw in terms of symbols
    }
}

// Method to find an open small board
function findOpenBoard() {
    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (!isBoardWon(i, j) && !isBoardFull(i, j)) {
        return { openSuperRow: i, openSuperCol: j };
        }
    }
    }
    return null;
}

// Method to create a logical board filled with empty strings
function createLogicalBoard() {
    const logicalBoard = [];
    for (let i = 0; i < 9; i++) {
    logicalBoard.push(Array(9).fill(''));
    }
    return logicalBoard;
}

// Method to check if a player has completed three small boards in a row
function hasCompletedSuperBoard(player) {
    // Check rows, columns, and diagonals in the main grid
    for (let i = 0; i < 3; i++) {
    // Check rows
    if (
        board[i][0][0][0] === player &&
        board[i][0][0][1] === player &&
        board[i][0][0][2] === player &&
        board[i][1][1][0] === player &&
        board[i][1][1][1] === player &&
        board[i][1][1][2] === player &&
        board[i][2][2][0] === player &&
        board[i][2][2][1] === player &&
        board[i][2][2][2] === player
    ) {
        return true;
    }

    // Check columns
    if (
        board[0][i][0][0] === player &&
        board[0][i][1][0] === player &&
        board[0][i][2][0] === player &&
        board[1][i][1][0] === player &&
        board[1][i][1][1] === player &&
        board[1][i][1][2] === player &&
        board[2][i][2][0] === player &&
        board[2][i][2][1] === player &&
        board[2][i][2][2] === player
    ) {
        return true;
    }
    }

    // Check diagonals
    if (
    board[0][0][0][0] === player &&
    board[0][0][1][1] === player &&
    board[0][0][2][2] === player &&
    board[1][1][0][0] === player &&
    board[1][1][1][1] === player &&
    board[1][1][2][2] === player &&
    board[2][2][0][0] === player &&
    board[2][2][1][1] === player &&
    board[2][2][2][2] === player
    ) {
    return true;
    }

    if (
    board[0][2][0][2] === player &&
    board[0][2][1][1] === player &&
    board[0][2][2][0] === player &&
    board[1][1][0][2] === player &&
    board[1][1][1][1] === player &&
    board[1][1][2][0] === player &&
    board[2][0][0][2] === player &&
    board[2][0][1][1] === player &&
    board[2][0][2][0] === player
    ) {
    return true;
    }

    return false;
}

// Method to check if all small boards are filled
function isAllBoardsFilled() {
    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (!isBoardFull(i, j)) {
        return false;
        }
    }
    }
    return true;
}

// Method to check if the game is a draw
function isDraw() {
    return isAllBoardsFilled() && !hasCompletedSuperBoard('X') && !hasCompletedSuperBoard('O');
}

// Method to check if a small Tic Tac Toe board is won
function isBoardWon(superRow, superCol) {
    return isSmallBoardWon(superRow, superCol) !== null;
}

// Method to check if a small Tic Tac Toe board is full
function isBoardFull(superRow, superCol) {
    return isSmallBoardDraw(superRow, superCol) === 'draw';
}

// Method to check if it's the first move
function isInitialMove() {
    return lastMove.superRow === -1 && lastMove.superCol === -1;
}

function endSmallGame(draw) {
    if (draw) {
        winningMessageSmallTextElement.innerText = 'Draw!'
    } else {
        winningMessageSmallTextElement.innerText = `${player2 ? "Player O" : "Player X"} Won the cell !`
    }
    winningMessageSmallElement.classList.add('show')
}
 

function endSuperGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
    } else {
        winningMessageTextElement.innerText = `${player2 ? "Player O" : "Player X"} Wins!`
    }
    winningMessageElement.classList.add('show')
}
  







































const cellElements = document.querySelectorAll('.game-container .cell');
const board = document.getElementById('board');
const gameModeSelection = document.getElementById('gameModeSelection');
const startGameButton = document.getElementById('startGameButton');
const userButton = document.getElementById('mode-user');
const computerButton = document.getElementById('mode-computer');
const startGameMessageText = document.getElementById('startGame');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const gameResultElement = document.getElementById('gameResult');

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened');
});

let selectedMode;
let player2;
let playerXWin = 0;
let playerCircleWin = 0;
const X_player = 'x';
const CIRCLE_player = 'circle';
let currentPlayer;

const playerWins = Array(9).fill(0);
var logicalBoard;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

// Integration of Mini-board Creation Logic
function createMiniBoard(activeMiniBoard) {
    const miniBoard = document.createElement('div');
    miniBoard.classList.add('mini-board');
    miniBoard.id = `mini-board-${activeMiniBoard}`;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        miniBoard.appendChild(cell);
    }

    return miniBoard;
}
document.getElementById('outer-grid').addEventListener('click', function (e) {
    const cell = e.target.closest('.cell');
    console.log("aaaa ", cell)
    if (cell) {
        // Handle the click based on the cell
        handleMiniBoardCellClick(e, selectedMode);
    }
});

// Create the outer grid with mini-boards
const outerGrid = document.getElementById('outer-grid');
for (let i = 0; i < 9; i++) {
    const miniBoard = createMiniBoard(i + 1);
    outerGrid.appendChild(miniBoard);
}

// Event Listeners for Mini-board Cells
document.querySelectorAll('.mini-board .cell').forEach(cell => {
    cell.addEventListener('click', handleMiniBoardCellClick.bind(null, selectedMode));

});

// Variable activeMiniBoard
let activeMiniBoard = 1;

function updateActiveMiniBoard() {
    activeMiniBoard = (activeMiniBoard % 9) + 1;
}
// Functions for Handling Mini-board Changes
function handleMiniBoardCellClick(e, mode) {
    const cell = e.target;
    console.log("mode " , mode, "cell ", cell);
    // Call the appropriate function based on the game mode
    if (mode === 'user') {
        handleClick(cell);
    } else if (mode === 'computer') {
        handleClick_computer(cell);
    }
    // Update the active mini-board based on the clicked cell
    updateActiveMiniBoard();
    updateMiniBoardDisplay(activeMiniBoard);

    showBoardHover(activeMiniBoard);
}


// Add your logic for updating the display based on the active mini-board
function updateMiniBoardDisplay(activeMiniBoard) {
    // Add your logic here to update the display based on the active mini-board
    console.log("Active mini board check ", activeMiniBoard);
}

startGameButton.addEventListener('click', showGameModes);
restartButton.addEventListener('click', showGameModes);

updateWinCounts();

// Event Listeners for Mini-board Cells
function setupMiniBoardEventListeners(mode) {
    document.querySelectorAll('.mini-board .cell').forEach(cell => {
        cell.addEventListener('click', (e) => {
            console.log('Cell clicked:', e.target); // Log the clicked cell
            handleMiniBoardCellClick(e, mode);
        });
    });
}

function showGameModes() {
    startGameButton.style.display = 'none';
    startGameMessageText.style.display = 'none';
    gameModeSelection.classList.add('show');
    winningMessageElement.classList.remove('show');
    logicalBoard = ['', '', '', '', '', '', '', '', ''];

    // Set up event listeners based on the selected mode
    userButton.addEventListener('click', () => {
        startGame('user');
        setupMiniBoardEventListeners('user');
    });

    computerButton.addEventListener('click', () => {
        startGame('computer');
        setupMiniBoardEventListeners('computer');
    });
}
// function showGameModes() {
//     startGameButton.style.display = 'none';
//     startGameMessageText.style.display = 'none';
//     gameModeSelection.classList.add('show');
//     winningMessageElement.classList.remove('show');
//     logicalBoard = ['', '', '', '', '', '', '', '', ''];
// }

// userButton.addEventListener('click', () => startGame('user'));
// computerButton.addEventListener('click', () => startGame('computer'));

function startGame(mode) {
    selectedMode = mode;
    player2 = false;
    gameModeSelection.classList.remove('show');
    currentPlayer = X_player;

    // Handle the selected mode and start the game accordingly
    if (selectedMode === 'user') {
        // Start the game in user vs. user mode
        startUserVsUserGame();
    } else if (selectedMode === 'computer') {
        // Start the game in user vs. computer mode
        startUserVsComputerGame();
    }
}
function handleMiniBoardCellClickWrapper(e) {
    handleMiniBoardCellClick(e, selectedMode);
}

function startUserVsUserGame() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_player);
        cell.classList.remove(CIRCLE_player);
        cell.removeEventListener('click', handleMiniBoardCellClickWrapper);
        cell.addEventListener('click', handleMiniBoardCellClickWrapper, { once: true });
    });
    showBoardHover(activeMiniBoard);
}
/* function startUserVsUserGame() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_player);
        cell.classList.remove(CIRCLE_player);
        cell.removeEventListener('click', handleMiniBoardCellClick(e, selectedMode));
        cell.addEventListener('click', (e) => handleMiniBoardCellClick(e, selectedMode), { once: true });
    });
    showBoardHover(activeMiniBoard);
} */
function startUserVsComputerGame() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_player);
        cell.classList.remove(CIRCLE_player);
        cell.removeEventListener('click', handleMiniBoardCellClickWrapper);
        cell.addEventListener('click', handleMiniBoardCellClickWrapper, { once: true });
    });
    showBoardHover(activeMiniBoard);
}

/* function startUserVsComputerGame() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_player);
        cell.classList.remove(CIRCLE_player);
        cell.removeEventListener('click', handleMiniBoardCellClick(e, selectedMode));
        cell.addEventListener('click', (e) => handleMiniBoardCellClick(e, selectedMode), { once: true });
    });
    showBoardHover(activeMiniBoard);
}
 */
function handleClick(e) {
    const cell = e.target;

    currentPlayer = player2 ? CIRCLE_player : X_player;
    placeMark(cell, currentPlayer);

    // Check for win
    if (checkWin(currentPlayer)) {
        if (currentPlayer === 'x') {
            playerXWin++;
            sendGameResults(playerXWin);
        } else {
            playerCircleWin++;
            sendGameResults(playerCircleWin);
        }
        playerWins[getCellIndex(cell)]++;
        updateWinCounts();
        endGame(false);
    } else if (isDraw()) {
        // check for draw
        endGame(true);
    } else {
        changePlayer();
        showBoardHover(activeMiniBoard)();
    }
}

function handleClick_computer(e) {
    const cell = e.target;

    currentPlayer = player2 ? CIRCLE_player : X_player;
    placeMark(cell, currentPlayer);

    // Update the logical board based on the HTML board
    updateLogicalBoard();

    // Check for win
    if (checkWin(currentPlayer)) {
        if (currentPlayer === 'x') {
            playerXWin++;
        } else {
            playerCircleWin++;
        }
        sendGameResults(result);
        updateWinCounts();
        endGame(false);
    } else if (isDraw()) {
        // check for draw
        endGame(true);
    } else {
        changePlayer();
        // Switch turn to the AI
        currentPlayer = player2 ? CIRCLE_player : X_player;

        // Call aiMakeMove with the updated logical board
        const aiMove = aiMakeMove(currentPlayer);
        let move = cellElements[aiMove];
        placeMark(move, currentPlayer);

        // Update the HTML board
        updateLogicalBoard();

        // Check for win or draw after the AI move
        if (checkWin(CIRCLE_player)) {
            playerCircleWin++;
            updateWinCounts();
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            // Switch turn back to the user
            changePlayer();
            showBoardHover(activeMiniBoard)();
        }
    }
}
function updateWinCounts(){
    document.getElementById('playerXWins').textContent = playerXWin;
    document.getElementById('playerOWins').textContent = playerCircleWin;
}
function showBoardHover(activeMiniBoard){
    const boardElement = document.getElementById(`tic-tac-toe-board-${activeMiniBoard}`);
    if (boardElement){
        boardElement.classList.remove(X_player)
        boardElement.classList.remove(CIRCLE_player)
        if(player2){
            boardElement.classList.add(CIRCLE_player)
        } else {
            boardElement.classList.add(X_player)
        }
    }
    
}
function placeMark(cell, currentPlayer){
    console.log('cell:', cell); // Add this line

    cell.classList.add(currentPlayer)
}


// //  file contains the logic for the AI player. It has functions like makeRandomMove, minimax, and makeBestMove to help the AI make moves.
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <link rel="stylesheet" href="tic_tac_toe.css">
//     <script src="tic_tac_toe.js" defer></script>
//     <title>Tic Tac Toe</title>
// </head>
// <body>
//     <div class="start-game" id="startGame">
//         <div start-game-message-text>Click to Start the Game</div>
//         <button id="startGameButton">Start Game</button>
//     </div>
//     <div class="mode-game" id="gameModeSelection">
//         <div>Choose Game Mode:</div>
//         <button id="mode-user">User vs. User</button>
//         <button id="mode-computer">User vs. Computer</button>
//     </div>
//     <p>Player X Wins: <span id="playerXWins">0</span></p>
//     <p>Player O Wins: <span id="playerOWins">0</span></p>
//     <p>Games Results: <span id="gameResult">0</span></p>
//     <p id="currentPlayer"> Current Player: </p>
//     <!-- <script>
//         const socket = new WebSocket('ws://localhost:3000');
//         docket.onmessage = function(event){
//             const data =   JSON.parse(event.data);
//             if (data.type === 'results') {

//             }
//         }
//     </script> 
//     <div class="tabs">
//         <div class="tab" onclick="changeTab(1)">Game 1</div>
//         <div class="tab" onclick="changeTab(2)">Game 2</div>
//         <div class="tab" onclick="changeTab(3)">Game 3</div>
//         <div class="tab" onclick="changeTab(4)">Game 4</div>
//         <div class="tab" onclick="changeTab(5)">Game 5</div>
//         <div class="tab" onclick="changeTab(6)">Game 6</div>
//         <div class="tab" onclick="changeTab(7)">Game 7</div>
//         <div class="tab" onclick="changeTab(8)">Game 8</div>
//         <div class="tab" onclick="changeTab(9)">Game 9</div>
    
//     </div>-->
//     <div class="tic-tac-toe-board" id="outer-grid"></div>
//    <!-- <script src="tic_tac_toe.js"></script>-->
    
//   <!--  <div class="gameContainer" class="game-container">
//          Tic Tac Toe Board for Tab 1 
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-0" data-tab="0">
//             Add 9 cells for the Tic Tac Toe Board             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer1" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-1" data-tab="1">
            
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer2" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-2" data-tab="2">
            
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer3" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-3" data-tab="3">
//                         <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer4" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-4" data-tab="4">
            
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer5" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-5" data-tab="5">
            
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer6" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-6" data-tab="6">
            
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer7" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-7" data-tab="7">
           
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div>
//     <div class="gameContainer8" class="game-container"></div>
//         <div class="tic-tac-toe-board" id="tic-tac-toe-board-8" data-tab="8">
            
//             <div class="cell" data-cell data-cell-index="0"></div>
//             <div class="cell" data-cell data-cell-index="1"></div>
//             <div class="cell" data-cell data-cell-index="2"></div>
//             <div class="cell" data-cell data-cell-index="3"></div>
//             <div class="cell" data-cell data-cell-index="4"></div>
//             <div class="cell" data-cell data-cell-index="5"></div>
//             <div class="cell" data-cell data-cell-index="6"></div>
//             <div class="cell" data-cell data-cell-index="7"></div>
//             <div class="cell" data-cell data-cell-index="8"></div>
//         </div>
//     </div> -->
//     <!-- <div class="tic-tac-toe-board" id="tic-tac-toe-board">
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div>
//         <div class="cell" data-cell></div> -->
//         <!-- <div class="cell" data-cell id="cell_0_0"></div>
//         <div class="cell" data-cell id="cell_0_1"></div>
//         <div class="cell" data-cell id="cell_0_2"></div>
//         <div class="cell" data-cell id="cell_1_0"></div>
//         <div class="cell" data-cell id="cell_1_1"></div>
//         <div class="cell" data-cell id="cell_1"></div>
//         <div class="cell" data-cell id="cell_2_0"></div>
//         <div class="cell" data-cell id="cell_2_1"></div>
//         <div class="cell" data-cell id="cell_2_2"></div>
//     </div> -->
//     <div class="winning-message" id="winningMessage">
//     <div data-winning-message-text>Player 1 wins</div>
//     <button id="restartButton">Restart</button>
//     </div>
// </body>
// </html>



// const cellElements = document.querySelectorAll('.game-container .cell');
// const board = document.getElementById('board');
// const gameModeSelection = document.getElementById('gameModeSelection');
// const startGameButton = document.getElementById('startGameButton');
// const userButton = document.getElementById('mode-user');
// const computerButton = document.getElementById('mode-computer');
// const startGameMessageText = document.getElementById('startGame');
// const winningMessageElement = document.getElementById('winningMessage');
// const restartButton = document.getElementById('restartButton');
// const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
// const gameResultElement = document.getElementById('gameResult');

// const socket = new WebSocket('ws://localhost:3000');

// socket.addEventListener('open', (event) => {
//     console.log('WebSocket connection opened');
// });

// let player2;
// let playerXWin = 0;
// let playerCircleWin = 0;
// const X_player = 'x';
// const CIRCLE_player = 'circle';
// let currentPlayer;
// let row;
// let col;
// let cellId;

// const playerWins = Array(9).fill(0);
// let tabID;
// var logicalBoard;
// var currentTab = 0;

// // Create an array to represent the game state for each cell in each tab
// const gameBoards = Array.from({ length: 9 }, () => Array(9).fill(''));

// const WINNING_COMBINATIONS = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [6, 4, 2]
// ];

// startGameButton.addEventListener('click', showGameModes);
// restartButton.addEventListener('click', showGameModes);

// document.querySelectorAll('.tic-tac-toe-board').forEach(board => {
//     board.addEventListener('click', () => {
//         const tabNumber = board.getAttribute('data-tab');
//         changeTab(tabNumber);
//     });
// });

// function changeTab(tabNumber) {
//     const gameContainers = document.querySelectorAll('.game-container');
//     gameContainers.forEach(container => {
//         container.style.display = 'none';
//     });

//     const selectedGame = document.getElementById('game' + tabNumber);
//     if (selectedGame) {
//         selectedGame.style.display = 'block';
//     }
// }

// updateWinCounts();
// function showGameModes() {
//     startGameButton.style.display = 'none';
//     startGameMessageText.style.display = 'none';
//     gameModeSelection.classList.add('show');
//     winningMessageElement.classList.remove('show');
//     logicalBoard = ['', '', '', '', '', '', '', '', ''];
// }

// userButton.addEventListener('click', () => startGame('user'));
// computerButton.addEventListener('click', () => startGame('computer'));

// function startGame(selectedMode) {
//     player2 = false;
//     gameModeSelection.classList.remove('show');
//     currentPlayer = X_player;

//     // Handle the selected mode and start the game accordingly
//     if (selectedMode === 'user') {
//         // Start the game in user vs. user mode
//         startUserVsUserGame();
//     } else if (selectedMode === 'computer') {
//         // Start the game in user vs. computer mode
//         startUserVsComputerGame();
//     }
// }

// function startUserVsUserGame() {
//     cellElements.forEach(cell => {
//         cell.classList.remove(X_player);
//         cell.classList.remove(CIRCLE_player);
//         cell.removeEventListener('click', handleClick);
//         cell.addEventListener('click', handleClick, { once: true });
//     });
//     showBoardHover();
// }

// function startUserVsComputerGame() {
//     cellElements.forEach(cell => {
//         cell.classList.remove(X_player);
//         cell.classList.remove(CIRCLE_player);
//         cell.removeEventListener('click', handleClick_computer);
//         cell.addEventListener('click', handleClick_computer, { once: true });
//     });
//     showBoardHover();
// }

// function generateTabID(row, col) {
//     return 'cell' + row + col;
// }

// function handleClick(e) {
//     const cell = e.target;

//     currentPlayer = player2 ? CIRCLE_player : X_player;
//     placeMark(cell, currentPlayer);

//     // Check for win
//     if (checkWin(currentPlayer)) {
//         if (currentPlayer === 'x') {
//             playerXWin++;
//             sendGameResults(playerXWin, tabNumber);
//         } else {
//             playerCircleWin++;
//             sendGameResults(playerCircleWin, tabNumber);
//         }
//         playerWins[getCellIndex(cell)]++;
//         updateCurrentPlayerDisplay();
//         updateWinCounts();
//         endGame(false);
//     } else if (isDraw()) {
//         // check for draw
//         endGame(true);
//     } else {
//         changePlayer();
//         showBoardHover();
//     }
// }

// function handleClick_computer(e) {
//     const cell = e.target;

//     currentPlayer = player2 ? CIRCLE_player : X_player;
//     placeMark(cell, currentPlayer);

//     // Update the logical board based on the HTML board
//     updateLogicalBoard();

//     // Check for win
//     if (checkWin(currentPlayer)) {
//         if (currentPlayer === 'x') {
//             playerXWin++;
//         } else {
//             playerCircleWin++;
//         }
//         sendGameResults(result, tabNumber);
//         updateWinCounts();
//         endGame(false);
//     } else if (isDraw()) {
//         // check for draw
//         endGame(true);
//     } else {
//         changePlayer();
//         // Switch turn to the AI
//         currentPlayer = player2 ? CIRCLE_player : X_player;

//         // Call aiMakeMove with the updated logical board
//         const aiMove = aiMakeMove(currentPlayer);
//         let move = cellElements[aiMove];
//         placeMark(move, currentPlayer);

//         // Update the HTML board
//         updateLogicalBoard();

//         // Check for win or draw after the AI move
//         if (checkWin(CIRCLE_player)) {
//             playerCircleWin++;
//             updateWinCounts();
//             endGame(false);
//         } else if (isDraw()) {
//             endGame(true);
//         } else {
//             // Switch turn back to the user
//             changePlayer();
//             showBoardHover();
//         }
//     }
// }
// // Integration of Mini-board Creation Logic
// function createMiniBoard(miniBoardId) {
//     const miniBoard = document.createElement('div');
//     miniBoard.classList.add('mini-board');
//     miniBoard.id = `mini-board-${miniBoardId}`;

//     for (let i = 0; i < 9; i++) {
//         const cell = document.createElement('div');
//         cell.classList.add('cell');
//         cell.setAttribute('data-mini-board', miniBoardId);
//         miniBoard.appendChild(cell);
//     }

//     return miniBoard;
// }


// // Create the outer grid with mini-boards
// const outerGrid = document.getElementById('outer-grid');
// for (let i = 0; i < 9; i++) {
//     const miniBoard = createMiniBoard(i + 1);
//     outerGrid.appendChild(miniBoard);
// }

// for (let i = 0; i < 9; i++) {
//     const miniBoard = createMiniBoard(i + 1);
//     board.appendChild(miniBoard);
// }

// // Event Listeners for Mini-board Cells
// document.querySelectorAll('.mini-board .cell').forEach(cell => {
//     cell.addEventListener('click', handleMiniBoardCellClick);
// });

// // Variable activeMiniBoard
// let activeMiniBoard = 1; // Set an initial active mini-board

// // Functions for Handling Mini-board Changes
// function handleMiniBoardCellClick(e) {
//     const cell = e.target;
//     const clickedMiniBoardId = parseInt(cell.getAttribute('data-mini-board'));
//     // Call the appropriate function based on the game mode
//     if (selectedMode === 'user') {
//         handleClick(cell);
//     } else if (selectedMode === 'computer') {
//         handleClick_computer(cell);
//     }

//     // Update the active mini-board based on the clicked cell
//     updateActiveMiniBoard(clickedMiniBoardId);

//     // After handling the mini-board cell click, update the display
//     updateMiniBoardDisplay(activeMiniBoard);
// }

// function updateActiveMiniBoard(clickedMiniBoardId) {
//         activeMiniBoard = clickedMiniBoardId;
// }

// function updateMiniBoardDisplay(activeMiniBoardId) {
//     // Add your logic here to update the display based on the active mini-board
//     console.log("Active mini board check ", activeMiniBoard)
// }






// const cellElements = document.querySelectorAll('.game-container .cell');
// const board = document.getElementById('board');
// const gameModeSelection = document.getElementById('gameModeSelection');
// const startGameButton = document.getElementById('startGameButton');
// const userButton = document.getElementById('mode-user');
// const computerButton = document.getElementById('mode-computer');
// const startGameMessageText = document.getElementById('startGame');
// const winningMessageElement = document.getElementById('winningMessage');
// const restartButton = document.getElementById('restartButton');
// const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
// const gameResultElement = document.getElementById('gameResult');

// const socket = new WebSocket('ws://localhost:3000');

// socket.addEventListener('open', (event) =>{
//     console.log('WebSocket connection opened');
// })


// let player2 ;
// let playerXWin = 0;
// let playerCircleWin = 0;
// const X_player = 'x';
// const CIRCLE_player = 'circle';
// let currentPlayer;
// let row;
// let col;
// let cellId;

// const playerWins = Array(9).fill(0);
// let tabID;
// var logicalBoard;
// var currentTab = 0;
// // Create an array to represent the game state for each cell in each tab
// const gameBoards = Array.from({ length: 9 }, () => Array(9).fill(''));

// const WINNING_COMBINATIONS = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [6, 4, 2]
//   ]


// startGameButton.addEventListener('click', showGameModes);


// restartButton.addEventListener('click', showGameModes);

// document.querySelectorAll('.tic-tac-toe-board').forEach(board =>{
//     board.addEventListener('click', () => {
//         const tabNumber = board.getAttribute('data-tab');
//         changeTab(tabNumber);
//     });
// });


// function changeTab(tabNumber){
//     const gameContainers = document.querySelectorAll('.game-container');
//     gameContainers.forEach(container => {
//         container.style.display = 'none';
//     });

//     const selectedGame = document.getElementById('game' + tabNumber);
//     if (selectedGame){
//         selectedGame.style.display = 'block';
//     }
// }


// updateWinCounts();
// function showGameModes() {
//     startGameButton.style.display = 'none';
//     startGameMessageText.style.display = 'none';
//     gameModeSelection.classList.add('show');
//     winningMessageElement.classList.remove('show');
//     logicalBoard = ['', '', '', '', '', '', '', '', ''];
// }

// userButton.addEventListener('click', () => startGame('user'));
// computerButton.addEventListener('click', () => startGame('computer'));

// function startGame(selectedMode) {
//     player2 = false
        
//     gameModeSelection.classList.remove('show');
//     currentPlayer = X_player
//     // Handle the selected mode and start the game accordingly
//     if (selectedMode === 'user') {
//         // Start the game in user vs. user mode
//         startUserVsUserGame();
//     } else if (selectedMode === 'computer') {
//         // Start the game in user vs. computer mode
//         startUserVsComputerGame();
//     }
// }
// function startUserVsUserGame() {
//     cellElements.forEach(cell => {
//     // cellElements.forEach((cell, index) => {
//     //     row = Math.floor(index / 3);
//     //     col = index % 3;
//     //     cellId = generateTabID(row, col);
//         cell.classList.remove(X_player);
//         cell.classList.remove(CIRCLE_player);
//         cell.removeEventListener('click', handleClick);
//         cell.addEventListener('click', handleClick, { once: true });
//     });
//     showBoardHover();
// }

// function updateMainGame(tabNumber, result){
//     const cellId = 'cell_' + tabNumber + '_0';
//     const cell = document.getElementById(cellId);
//     if (cell){
//         cell.textContent  = result;
//     }
// }
 
// function sendGameResults(result, tabNumber){
//     socket.send(JSON.stringify({type: 'result', data: {result, tabNumber} }));
// }

// socket.onmessage = (event) =>{
//     const data = JSON.parse(event.data);
//     if(data.type === 'results'){
//         console.log('Crosses won:', data.data.crosses);
//         console.log('Circles won:', data.data.circles);
//         gameResultElement.textContent = 'Game Result - Crosses: ' + data.data.crosses + ' Circle: ' + data.data.circle
//     }
// }
// //  index) => {
// //         row = Math.floor(index / 3);
// //         col = index % 3;
// //         cellId = generateTabID(row, col);
// function startUserVsComputerGame() {
//     cellElements.forEach(cell => {
//         cell.classList.remove(X_player);
//         cell.classList.remove(CIRCLE_player);
//         cell.removeEventListener('click', handleClick_computer);
//         cell.addEventListener('click', handleClick_computer, { once: true });
//     });
//     showBoardHover();
// }

// function generateTabID(row, col) {
//     return 'cell' + row + col;
// }

// function handleClick(e){
//     const cell = e.target
    
//     currentPlayer = player2 ? CIRCLE_player: X_player
//     //placeMark
//     placeMark(cell, currentPlayer)
    
//     // Check for win
//     if (checkWin(currentPlayer)) {
//         if (currentPlayer  === 'x') {
//             playerXWin++;
//             sendGameResults(playerXWin, tabNumber)
//         } else {
//             playerCircleWin++;
//             sendGameResults(playerCircleWin, tabNumber)
//         }
//         playerWins[getCellIndex(cell)]++;
//         updateCurrentPlayerDisplay();
//         updateWinCounts();
//         endGame(false)
//     } else if (isDraw()) {
//         //check for draw
//         endGame(true)
//     } else {
//         changePlayer();
//         showBoardHover();
        
//     }
// }

// function handleClick_computer(e){
    
//     const cell = e.target;
    
//     currentPlayer = player2 ? CIRCLE_player : X_player;
//     // placeMark
//     placeMark(cell, currentPlayer);
    
//     // Update the logical board based on the HTML board
//     updateLogicalBoard();
    
//     // Check for win
//     if (checkWin(currentPlayer)) {
//         if (currentPlayer === 'x') {
//             playerXWin++;
//         } else {
//             playerCircleWin++;
//         }
//         sendGameResults(result, tabNumber);
//         updateWinCounts();
//         endGame(false);
//     } else if (isDraw()) {
//         // check for draw
//         endGame(true);
//     } else {
//         changePlayer();
//         // Switch turn to the AI
//         currentPlayer = player2 ? CIRCLE_player : X_player;
        
//         // Call aiMakeMove with the updated logical board
//         const aiMove = aiMakeMove(currentPlayer);
//         let move = cellElements[aiMove];
//         placeMark(move, currentPlayer);

//         // Update the HTML board
//         updateLogicalBoard();
        

//         // Check for win or draw after the AI move
//         if (checkWin(CIRCLE_player)) {
//             playerCircleWin++;
//             updateWinCounts();
//             endGame(false);
//         } else if (isDraw()) {
//             endGame(true);
//         } else {
//             // Switch turn back to the user
//             changePlayer();
//             showBoardHover();
//         }
//     }
// }

// function updateCurrentPlayerDisplay() {
//     const currentPlayerElement = document.getElementById('currentPlayer');
//     if (currentPlayerElement) {
//         currentPlayerElement.textContent = 'Current Player:' + currentPlayer;
//     } else {
//         console.error("Element with ID 'currentPlayer' not found");
//     }
// }


// function getCellIndex(cell){
//     const cellId = cell.getAttribute('data-cell-index');
//     return parseInt(cellId);
// }

// function endGame(draw) {
//     if (draw) {
//         winningMessageTextElement.innerText = 'Draw!'
//     } else {
//         winningMessageTextElement.innerText = `${player2 ? "Player O" : "Player X"} Wins!`
//     }
//     winningMessageElement.classList.add('show')
    
// }
  

// function placeMark(cell, currentPlayer){
//     cell.classList.add(currentPlayer)
// }

// function changePlayer(){
//     player2 = !player2
    
// }

// function showBoardHover(){
//     const boardElement = document.getElementById('tic-tac-toe-board-${tabNumber}');
//     if (boardElement){
//         boardElement.classList.remove(X_player)
//         boardElement.classList.remove(CIRCLE_player)
//         if(player2){
//             boardElement.classList.add(CIRCLE_player)
//         } else {
//             boardElement.classList.add(X_player)
//         }
//     }
    
// }

// function isDraw() {
//     return [...cellElements].every(cell => {
//       return cell.classList.contains(X_player) || cell.classList.contains(CIRCLE_player)
//     })
//   }

// function checkWin(currentPlayer) {
//   return WINNING_COMBINATIONS.some(combination => {
//     return combination.every(index => {
//       return cellElements[index].classList.contains(currentPlayer)
//     })
//   })
// }
// function checkWin_imaginaryWin(new_board, currentPlayer) {
//     return WINNING_COMBINATIONS.some(combination => {
//         return combination.every(index => {
//             return new_board[index] === currentPlayer;
//         });
//     });
//   }

// function isImaginaryDraw(new_board){
//     return new_board.every(cell => {
//         return cell === X_player || cell === CIRCLE_player;
//     });
// }

// function aiMakeMove(currentPlayer) {
//     return minimax(logicalBoard, 0, currentPlayer === CIRCLE_player).move;
// }

// function minimax(new_board, depth, isMaximizing) {
//     var bestMove;
//     var bestScore;

//     if (checkWin_imaginaryWin(new_board, CIRCLE_player)) {
//         return { score: 1 }; // CIRCLE_player wins
//     } else if (checkWin_imaginaryWin(new_board, X_player)) {
//         return { score: -1 }; // X_player wins
//     } else if (isImaginaryDraw(new_board)) {
//         return { score: 0 }; // It's a draw
//     }

//     if (isMaximizing) {
//         bestScore = -Infinity;
//         for (let i = 0; i < new_board.length; i++) {
//             if (new_board[i] === '') {
//                 new_board[i] = CIRCLE_player;
//                 let score = minimax(new_board, depth + 1, false).score;
//                 new_board[i] = '';

//                 if (score > bestScore) {
//                     bestScore = score;
//                     bestMove = i;
//                 }
//             }
//         }
//     } else {
//         bestScore = Infinity;
//         for (let i = 0; i < new_board.length; i++) {
//             if (new_board[i] === '') {
//                 new_board[i] = X_player;
//                 let score = minimax(new_board, depth + 1, true).score;
//                 new_board[i] = '';

//                 if (score < bestScore) {
//                     bestScore = score;
//                     bestMove = i;
//                 }
//             }
//         }
//     }

//     return { score: bestScore, move: bestMove };
// }


// function updateLogicalBoard() {
//     // Clear the logical board
//     for (let i = 0; i < logicalBoard.length; i++) {
//         logicalBoard[i] = '';
//     }

//     // Update the logical board based on the HTML board
//     for (let i = 0; i < cellElements.length; i++) {
//         if (cellElements[i].classList.contains(X_player)) {
//             logicalBoard[i] = X_player;
//         } else if (cellElements[i].classList.contains(CIRCLE_player)) {
//             logicalBoard[i] = CIRCLE_player;
//         }
//     }
    
// }



// function updateWinCounts(){
//     document.getElementById('playerXWins').textContent = playerXWin;
//     document.getElementById('playerOWins').textContent = playerCircleWin;
// }


const ticTacToe = require('./tic_tac_toe');

function makeMove(row, col) {
    // Update the game board with the player's move
    board[row][col] = 'O';

    // Check for a winner or a draw
    if (ticTacToe.checkWinner(board, 'O')) {
        console.log('Player O wins!');
        // Handle end of the game
    } else if (ticTacToe.isBoardFull(board)) {
        console.log("It's a draw!");
        // Handle end of the game
    } else {
        // Make AI move
        const aiMove = makeBestMove(board);
        // Update the game board with the AI's move
        board[aiMove.row][aiMove.col] = 'X';

        // Check for a winner or a draw again
        if (ticTacToe.checkWinner(board, 'X')) {
            console.log('Player X wins!');
            // Handle end of the game
        } else if (ticTacToe.isBoardFull(board)) {
            console.log("It's a draw!");
            // Handle end of the game
        }
    }
}


function makeRandomMove(board) {
    // Find all empty cells on the board
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    // Choose a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: 1,
        O: -1,
        draw: 0,
    };

    const winner = ticTacToe.checkWinner(board);

    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    const score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    const score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function makeBestMove(board) {
    let bestMove = { row: -1, col: -1 };
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'X';
                const score = minimax(board, 0, false);
                board[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

module.exports = {
    makeMove,
    makeRandomMove,
    minimax,
    makeBestMove,
};
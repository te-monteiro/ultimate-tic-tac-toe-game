
// Store references to relevant elements
const cellElements = document.querySelectorAll('.mini-board .cell');
const cellElementsNormal = document.querySelectorAll('[data-cell]');
const boardNormal = document.getElementById('normalBoard');
const boardUltimate = document.getElementById('outer-grid');

const playerXWinsElement = document.getElementById('playerXWins');
const playerOWinsElement = document.getElementById('playerOWins');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

const restartButton = document.getElementById('restartButton');
const normalMode = document.getElementById('normalMode');
const gameModeSelection = document.getElementById('gameModeSelection');
const ultimateMode = document.getElementById('ultimateMode');

const normalModeButton = document.getElementById('normal-mode');
const ultimateModeButton = document.getElementById('ultimate-mode');
const userButton = document.getElementById('mode-user');
const computerButton = document.getElementById('mode-computer');

const socket = new WebSocket('ws://localhost:3000');


// Initialize game variables
let player2 ;
let currentPlayer;  
let playerXWin = 0;
let playerCircleWin = 0;
let activeMiniBoard = 0;
let subgridWinners;
let logicalBoard;
let subgridWin = false
// Define constants for player symbols
const X_PLAYER = 'x';
const CIRCLE_PLAYER = 'circle';

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened');
});
restartButton.addEventListener('click', menu);

normalModeButton.addEventListener('click', showGameModes);
ultimateModeButton.addEventListener('click', () => ultimateGame());

function menu(){
    normalMode.classList.remove('show');
    ultimateMode.classList.remove('show');
    winningMessageElement.classList.remove('show');
    playerXWin = 0;
    playerCircleWin = 0;
    activeMiniBoard = 0;
}

function showGameModes() {
    normalMode.classList.add('show');
    ultimateMode.classList.remove('show');

    winningMessageElement.classList.remove('show');
    logicalBoard = ['', '', '', '', '', '', '', '', ''];

}

// Ultimate Game
function ultimateGame(){
    ultimateMode.classList.add('show');
    normalMode.classList.remove('show');
    player2 = false;
    gameModeSelection.classList.remove('show');
    winningMessageElement.classList.remove('show');
    subgridWinners =  ['', '', '', '', '', '', '', '', '']; //{0: '', 1: '', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:''}
    currentPlayer = X_PLAYER;
    //updateCurrentPlayerDisplay();
    
    cellElements.forEach(cell => {
        cell.classList.remove(X_PLAYER);
        cell.classList.remove(CIRCLE_PLAYER);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}


function handleClick(e) {
    const cell = e.target;
    const miniBoardId = cell.closest('.mini-board').id;
    const miniBoardNumber = parseInt(miniBoardId.replace('mini-board-', ''), 10);
    if (activeMiniBoard === 0 || activeMiniBoard === miniBoardNumber || !checkSubgridWinner(miniBoardNumber)) {
        currentPlayer = player2 ? CIRCLE_PLAYER : X_PLAYER;
        placeMark(cell, currentPlayer);
        const opponentPlayer = player2 ? X_PLAYER : CIRCLE_PLAYER;
        
        //updateCurrentPlayerDisplay();
        // Check for win
        if (checkWinInMiniBoard(currentPlayer, miniBoardNumber)) {
            activeMiniBoard = miniBoardNumber;
            subgridWinners[activeMiniBoard -1] = currentPlayer;
            endSubgridGame(false)
            if (subgridWin) {
                if (currentPlayer  === X_PLAYER) {
                    playerXWin++;
                } else {
                    playerCircleWin++;
                }
                updateWinCounts();
                endGame(false)
            } else if (isDraw()) {
                //check for draw
                endGame(true)
            }

        } else if(checkWinInMiniBoard(opponentPlayer, miniBoardNumber)){
            // Allow the current player to choose any open subgrid
            activeMiniBoard = 0;
            for (let i = 0; i < subgridWinners.length; i++) {
                // Check if the subgrid has a winner
                // Create a selector for the active mini-board
                if (subgridWinners[i] != ''){
                    const j = i + 1
                    const miniBoardSelector = "#mini-board-" + j;
                    // Select all cells in the mini-board and add the 'blocked-cell' class
                    document.querySelectorAll(miniBoardSelector + ' .cell').forEach(cell => {
                        cell.classList.add('blocked-cell');
                    });
                }
            }

        } else {
            switchPlayer();
            //updateCurrentPlayerDisplay();
            showBoardHover();
            updateActiveMiniBoard(cell);
        }
    }
}

updateWinCounts();

function updateActiveMiniBoard(cell) {
    const miniBoardId = cell.closest('.mini-board').id;
    activeMiniBoard = parseInt(miniBoardId.replace('mini-board-', ''), 10);
    const cellIndex = getCellIndex(cell);
    activeMiniBoard = cellIndex + 1;
    // Convert the updated value back to the mini-board ID format
    const nextMiniBoardId = `mini-board-${activeMiniBoard}`;
    const nextMiniBoardElement = document.getElementById(nextMiniBoardId);
    
    // Ensure the nextMiniBoardElement exists before updating activeMiniBoard
    if (nextMiniBoardElement) {
        activeMiniBoard = nextMiniBoardId;
    }
}
function checkWin(currentPlayer) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return subgridWinners[index] === currentPlayer;
        });
    });
}

function checkWinInMiniBoard(player, miniBoardElements) {
    const miniBoardCells = document.querySelectorAll(`#mini-board-${miniBoardElements} .cell`);
    const itIsDraw = [...miniBoardCells].every(cell => {
        return cell.classList.contains(X_PLAYER) || cell.classList.contains(CIRCLE_PLAYER);
    });

    if (itIsDraw) {
        return true;
    }

    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return miniBoardCells[index].classList.contains(player);
        });
    });
} 


function endGame(draw) {
    const winnerResult = document.getElementById('gameResult');
    const winnerSymbol = player2 ? CIRCLE_PLAYER : X_PLAYER;
    if (draw) {
        winnerResult.textContent = 'It\'s a draw!';
    } else {
        const symbol = winnerSymbol === X_PLAYER ? 'X' : 'O';
        winnerResult.textContent = `Player ${symbol} Wins!`;
    }
    winningMessageElement.textContent = winnerResult.textContent
}

function endSubgridGame(draw) {
    const subgridWinnerElement = document.getElementById('subgridWinner');
    const winnerSymbol = player2 ? CIRCLE_PLAYER : X_PLAYER;

    subgridWin = false
    if (draw) {
        subgridWinnerElement.textContent = 'It\'s a draw!';
    } else {
        const symbol = winnerSymbol === X_PLAYER ? 'X' : 'O';
        subgridWinnerElement.textContent = `Winner: ${symbol} Mini Game: ${activeMiniBoard}`;
        showBoardHover(activeMiniBoard)
        
        const activeMiniBoardSelector = "[id='" + activeMiniBoard + "']";
        document.querySelectorAll('.mini-board:not(' + activeMiniBoardSelector + ') .cell').forEach(cell => {
            cell.classList.remove('blocked-cell');
        });
        
        for (let i = 0; i < subgridWinners.length; i++) {
            // Check if the subgrid has a winner
            // Create a selector for the active mini-board
            if (subgridWinners[i] != ''){
                const j = i + 1
                const miniBoardSelector = "#mini-board-" + j;
                // Select all cells in the mini-board and add the 'blocked-cell' class
                document.querySelectorAll(miniBoardSelector + ' .cell').forEach(cell => {
                    cell.classList.add('blocked-cell');
                });
            }
        }
        subgridWin = checkWin(winnerSymbol)
        }
}

/* function updateCurrentPlayerDisplay() {
    const currentPlayerElement = document.getElementById('currentPlayer');
    currentPlayerElement.textContent = 'Current Player: ' + currentPlayer;
} */

function sendGameResults(){
    const gameResult = document.getElementById('gameResult');
    gameResult.textContent = `Player X: ${playerXWin}; Player O: ${playerCircleWin}`;
}


function isDraw(miniBoardNumber) {
    const miniBoardCells = document.querySelectorAll(`#mini-board-${miniBoardNumber} .cell`);

    [...miniBoardCells].every(cell => {
        return cell.classList.contains(X_PLAYER) || cell.classList.contains(CIRCLE_PLAYER);
    });

}
function isGameDraw() {
    // Iterate over each mini-board
    for (let miniBoardNumber = 1; miniBoardNumber <= 9; miniBoardNumber++) {
        if (!isDraw(miniBoardNumber)) {
            // If any mini-board is not a draw, return false
            return false;
        }
    }
    // If all mini-boards are draws, return true
    return true;
}


function checkSubgridWinner(miniBoardNumber) {
    const subgridCells = document.querySelectorAll(`#mini-board-${miniBoardNumber} .cell`);

    // Extract the classes of the cells in the subgrid
    const cellClasses = Array.from(subgridCells).map(cell => cell.classList.contains(X_PLAYER) ? X_PLAYER : (cell.classList.contains(CIRCLE_PLAYER) ? CIRCLE_PLAYER : ''));

    // Check for a win in the subgrid (horizontally, vertically, or diagonally)
    return (
        // Check horizontal win
        checkLineWin(cellClasses, 0, 1, 2) ||
        checkLineWin(cellClasses, 3, 4, 5) ||
        checkLineWin(cellClasses, 6, 7, 8) ||
        // Check vertical win
        checkLineWin(cellClasses, 0, 3, 6) ||
        checkLineWin(cellClasses, 1, 4, 7) ||
        checkLineWin(cellClasses, 2, 5, 8) ||
        // Check diagonal win
        checkLineWin(cellClasses, 0, 4, 8) ||
        checkLineWin(cellClasses, 2, 4, 6)
    );
}

function checkLineWin(cellClasses, a, b, c) {
    return cellClasses[a] && cellClasses[a] === cellClasses[b] && cellClasses[b] === cellClasses[c];
}

function isBoardFull() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_PLAYER) || cell.classList.contains(CIRCLE_PLAYER);
    });
}

function getCellIndex(cell) {
    return Array.from(cell.parentNode.children).indexOf(cell);
}
// Function to place a mark in the cell
function placeMark(cell, currentPlayer) {
    cell.classList.add(currentPlayer);
    updateActiveMiniBoard(cell);
}

function showBoardHover() {
    boardUltimate.classList.remove(X_PLAYER)
    boardUltimate.classList.remove(CIRCLE_PLAYER)
    if(player2){
        boardUltimate.classList.add(CIRCLE_PLAYER)
    } else {
        boardUltimate.classList.add(X_PLAYER)
    }
    // Clear the blocked-cell class from all cells
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('blocked-cell');
    }); 
    
    // Add the blocked-cell class to cells in other mini boards
    const activeMiniBoardSelector = "[id='" + activeMiniBoard + "']";
    document.querySelectorAll('.mini-board:not(' + activeMiniBoardSelector + ') .cell').forEach(cell => {
        cell.classList.add('blocked-cell');
    });

   
}


//Normal Game
userButton.addEventListener('click', () => startGame('user'));
computerButton.addEventListener('click', () => startGame('computer'));

function startGame(selectedMode) {
    player2 = false;
    gameModeSelection.classList.remove('show');
    winningMessageElement.classList.remove('show');
    currentPlayer = X_PLAYER;
    // Handle the selected mode and start the game accordingly
    if (selectedMode === 'user') {
        // Start the game in user vs. user mode
        startUserVsUserGame();
    } else if (selectedMode === 'computer') {
        // Start the game in user vs. computer mode
        startUserVsComputerGame();
    }
}

function startUserVsUserGame() {
    cellElementsNormal.forEach(cell => {
        cell.classList.remove(X_PLAYER);
        cell.classList.remove(CIRCLE_PLAYER);
        cell.removeEventListener('click', handleNormalClick);
        cell.addEventListener('click', handleNormalClick, { once: true });
    });
    showNormalBoardHover();
}

function startUserVsComputerGame() {
    cellElementsNormal.forEach(cell => {
        cell.classList.remove(X_PLAYER);
        cell.classList.remove(CIRCLE_PLAYER);
        cell.removeEventListener('click', handleNormalClick_computer);
        cell.addEventListener('click', handleNormalClick_computer, { once: true });
    });
    showNormalBoardHover();
}

function handleNormalClick(e){
    const cell = e.target
    
    currentPlayer = player2 ? CIRCLE_PLAYER: X_PLAYER
    //placeMark
    placeNormalMark(cell, currentPlayer)
    
    // Check for win
    if (checkNormalWin(currentPlayer)) {
        if (currentPlayer  === X_PLAYER) {
            playerXWin++;
        } else {
            playerCircleWin++;
        }
        updateWinCounts();
        endNormalGame(false)
    } else if (isDraw()) {
        //check for draw
        endNormalGame(true)
    } else {
        switchPlayer();
        showNormalBoardHover();
        
    }
}
function handleNormalClick_computer(e){
    const cell = e.target;
    
    currentPlayer = player2 ? CIRCLE_PLAYER: X_PLAYER
    // placeMark
    placeNormalMark(cell, currentPlayer);
    
    // Update the logical board based on the HTML board
    updateNormalLogicalBoard();
    // Check for win
    if (checkNormalWin(currentPlayer)) {
        if (currentPlayer === X_PLAYER) {
            playerXWin++;
        } else {
            playerCircleWin++;
        }
        updateWinCounts();
        endNormalGame(false);
    } else if (isDraw()) {
        // check for draw
        endNormalGame(true);
    } else {
        switchPlayer();
        // Switch turn to the AI
        currentPlayer = player2 ? CIRCLE_PLAYER: X_PLAYER
        
        // Call aiMakeMove with the updated logical board
        const aiMove = aiMakeMove(currentPlayer);
        let move = cellElementsNormal[aiMove];
        placeNormalMark(move, currentPlayer);

        // Update the HTML board
        updateNormalLogicalBoard();

        // Check for win or draw after the AI move
        if (checkNormalWin(CIRCLE_PLAYER)) {
            playerCircleWin++;
            updateWinCounts();
            endNormalGame(false);
        } else if (isDraw()) {
            endNormalGame(true);
        } else {
            // Switch turn back to the user
            switchPlayer();
            showNormalBoardHover();
        }
    }
}

updateWinCounts();

function checkNormalWin(currentPlayer) {
    // Check for overall game win
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElementsNormal[index].classList.contains(currentPlayer);
        });
    });
}

function endNormalGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
    } else {
        winningMessageTextElement.innerText = `${player2 ? "Player O" : "Player X"} Wins!`

    }
    winningMessageElement.classList.add('show')
}
function isNormalDraw() {
    return [...cellElementsNormal].every(cell => {
        return cell.classList.contains(X_PLAYER) || cell.classList.contains(CIRCLE_PLAYER)
    })

}

function isBoardFull() {
    return [...cellElementsNormal].every(cell => {
        return cell.classList.contains(X_PLAYER) || cell.classList.contains(CIRCLE_PLAYER);
    });
}


function aiMakeMove(currentPlayer) {
    return minimax(logicalBoard, 0, currentPlayer === CIRCLE_PLAYER).move;
} 

function checkWin_imaginaryWin(new_board, currentPlayer) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return new_board[index] === currentPlayer;
        });
    });
    }

function isImaginaryDraw(new_board){
    return new_board.every(cell => {
        return cell === X_PLAYER || cell === CIRCLE_PLAYER;
    });
}
function minimax(new_board, depth, isMaximizing) {
    var bestMove;
    var bestScore;

    if (checkWin_imaginaryWin(new_board, CIRCLE_PLAYER)) {
        return { score: 1 }; // CIRCLE_player wins
    } else if (checkWin_imaginaryWin(new_board, X_PLAYER)) {
        return { score: -1 }; // X_player wins
    } else if (isImaginaryDraw(new_board)) {
        return { score: 0 }; // It's a draw
    }

    if (isMaximizing) {
        bestScore = -Infinity;
        for (let i = 0; i < new_board.length; i++) {
            if (new_board[i] === '') {
                new_board[i] = CIRCLE_PLAYER;
                let score = minimax(new_board, depth + 1, false).score;
                new_board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    } else {
        bestScore = Infinity;
        for (let i = 0; i < new_board.length; i++) {
            if (new_board[i] === '') {
                new_board[i] = X_PLAYER;
                let score = minimax(new_board, depth + 1, true).score;
                new_board[i] = '';

                if (score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    }

    return { score: bestScore, move: bestMove };
}

function updateNormalLogicalBoard() {
    logicalBoard = [...cellElementsNormal].map((cell) => {
        if (cell.classList.contains(X_PLAYER)) {
            return X_PLAYER;
        } else if (cell.classList.contains(CIRCLE_PLAYER)) {
            return CIRCLE_PLAYER;
        }
    });
}


// Function to place a mark in the cell
function placeNormalMark(cell, currentPlayer) {
    cell.classList.add(currentPlayer);
}

function showNormalBoardHover(){
    boardNormal.classList.remove(X_PLAYER)
    boardNormal.classList.remove(CIRCLE_PLAYER)
    if(player2){
        boardNormal.classList.add(CIRCLE_PLAYER)
    } else {
        boardNormal.classList.add(X_PLAYER)
    }
}


// Function to update win counts on the display
function updateWinCounts() {
    playerXWinsElement.textContent = playerXWin;
    playerOWinsElement.textContent = playerCircleWin;
}

// Function to switch to the other player
function switchPlayer() {
    player2 = !player2;
}

// Function to display the winning message
function showWinningMessage(message) {
    winningMessageTextElement.textContent = message;
}





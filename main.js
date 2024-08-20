const documentMock = (() => ({
    querySelector: (selector) => ({
        innerHTML: null,
    }),
})) ();

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const addMark = (row, column, player) => {
        board[row][column].getValue() === '' ? board[row][column].playerMark(player) : null;
    }

    const printBoard = () => {
        const consolePlay = board.map(row => row.map(cell => cell.getValue()));

        console.log(consolePlay);
    }

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = cell();
            }
            
        }
    }

    return {
        getBoard,
        addMark,
        printBoard, 
        resetBoard
    }
})();

function cell() {
    let value = '';

    const playerMark = (player) => value = player;

    const getValue = () => value;

    return {
        playerMark,
        getValue
    };
}

const Gamecontroller = (function(playerX, playerY) {

    const players = [
        {
            name: playerX,
            mark: 'X'
        },
        {
            name: playerY,
            mark: 'ø'
        }
    ];

    const board = Gameboard;
    const getBoard = board.getBoard();

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];

    }

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {

        let isBoardFull = true;
        
        for (let r = 0; r < 3; r++) {

            if (getBoard[r][0].getValue() !== '' &&
                getBoard[r][0].getValue() === getBoard[r][1].getValue() &&
                getBoard[r][1].getValue() === getBoard[r][2].getValue()) {
                return 'win';
            }
            
        }

        for (let col = 0; col < 3; col++) {
            
            if (getBoard[0][col].getValue() !== '' &&
                getBoard[0][col].getValue() === getBoard[1][col].getValue() &&
                getBoard[1][col].getValue() === getBoard[2][col].getValue()) {
                return 'win';
            }
            
        }

        if (getBoard[0][0].getValue() !== '' &&
            getBoard[0][0].getValue() === getBoard[1][1].getValue() &&
            getBoard[1][1].getValue() === getBoard[2][2].getValue()) {
            return 'win';
        }

        if (getBoard[0][2].getValue() !== '' &&
            getBoard[0][2].getValue() === getBoard[1][1].getValue() &&
            getBoard[1][1].getValue() === getBoard[2][0].getValue()) {
            return 'win';
        }

        for (let row = 0; row < 3; row++) {
            for (let  col = 0;  col < 3; col++) {
                if (getBoard[row][col].getValue() === '') {
                    isBoardFull = false;
                }
            }            
        }
        
        return isBoardFull === true ? 'tie' : 'continue';
    }


    let playRound = (row, column, playerTurn) => {
        board.addMark(row, column, getActivePlayer().mark);
       const result = checkWinner();

        if (result === 'win') {

            playerTurn.textContent = `${getActivePlayer().name} Win!`;
        } else if (result === 'tie') {

            playerTurn.textContent = 'Its a tie.';
        } else {

            switchPlayer();
            playerTurn.textContent = `${getActivePlayer().name}'s turn...`;
        }
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard
    };
}) ('Xman', 'Oman');

const stick = Gamecontroller;

const screenController = (function(doc) {

    const game = Gamecontroller;
    const playerTurn = doc.getElementById('active-player');
    const boardDiv = doc.getElementById('container');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();

        board.forEach((row, rowIndex) => {
            const rowDiv = doc.createElement('div');
            rowDiv.classList.add('row');
            boardDiv.appendChild(rowDiv);
            row.forEach((cell, columnIndex) => {
                const cellDiv = doc.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.dataset.column = columnIndex;
                cellDiv.dataset.row = rowIndex;
                cellDiv.textContent = cell.getValue();
                rowDiv.appendChild(cellDiv);
            });
        });
    }

    function clickHandler(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn) return;
        game.playRound(selectedRow, selectedColumn, playerTurn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandler);

    const btnDiv = doc.createElement('div');
    btnDiv.classList.add('btn-div');
    const restartBtn = doc.createElement('button');
    restartBtn.classList.add('restart-btn');
    restartBtn.textContent = 'CLıcK ↻';
    doc.body.appendChild(btnDiv);
    btnDiv.appendChild(restartBtn);

    function rematchHandler() {

        const activePlayer = game.getActivePlayer();
        playerTurn.textContent = `${activePlayer.name}'s turn...`;
        game.resetBoard();
        updateScreen();
    }
    restartBtn.addEventListener('click', rematchHandler);

    updateScreen();
}) (document || documentMock);

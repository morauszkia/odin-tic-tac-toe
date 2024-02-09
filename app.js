'use strict';

const gameBoard = (function () {
  const board = new Array(9);

  const markField = (index, symbol) => {
    if (board[index] || index > board.length - 1) return false;

    board[index] = symbol;

    return true;
  };

  const getFieldMark = (index) => board[index];

  const clearBoard = () => {
    board.forEach((field) => {
      field = undefined;
    });
  };

  const getRows = () => {
    return [board.slice(0, 3), board.slice(3, 6), board.slice(6)];
  };

  const getColumns = () => {
    let columns = [[], [], []];
    for (let i = 0; i < 3; i++) {
      for (let j = i; j < board.length; j += 3) {
        columns[i].push(board[j]);
      }
    }
    return columns;
  };

  const getDiagonals = () => {
    return [
      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]],
    ];
  };

  return {
    markField,
    getFieldMark,
    getRows,
    getColumns,
    getDiagonals,
    clearBoard,
  };
})();

const createPlayer = (symbol) => {
  const getSymbol = function () {
    return symbol;
  };

  return { getSymbol };
};

const gameController = (function () {
  const playerOne = createPlayer('X');
  const playerTwo = createPlayer('O');

  let round = 1;
  let activePlayer = playerOne;
  let gameOver = false;

  const checkEquality = (array) => {
    return array[0] && array[0] === array[1] && array[0] === array[2];
  };

  const checkForWinner = () => {
    const currentRows = gameBoard.getRows();
    const currentColumns = gameBoard.getColumns();
    const currentDiagonals = gameBoard.getDiagonals();

    for (const row of currentRows) {
      if (checkEquality(row)) return row[0];
    }

    for (const column of currentColumns) {
      if (checkEquality(column)) return column[0];
    }

    for (const diagonal of currentDiagonals) {
      if (checkEquality(diagonal)) return diagonal[0];
    }

    return null;
  };

  const playRound = (index) => {
    if (gameOver) return;

    if (gameBoard.markField(index, activePlayer.getSymbol())) {
      round++;
      activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const winner = checkForWinner();

    if (winner || round > 9) {
      gameOver = true;
      displayController.showResult(winner);
    }
  };

  const resetGame = () => {
    round = 1;
    activePlayer = playerOne;
    gameOver = false;
  };

  return { playRound, checkForWinner, resetGame };
})();

const displayController = (function () {
  const boardEl = document.querySelector('.board');

  const clickHandler = (event) => {
    const field = event.target;
    const { index } = field.dataset;

    if (field.classList.contains('disabled')) return;

    gameController.playRound(index);
    field.classList.add('disabled');
    field.textContent = gameBoard.getFieldMark(index);
  };

  const createFields = () => {
    boardEl.innerHTML = '';
    gameBoard.clearBoard();

    for (let i = 0; i < 9; i++) {
      const field = document.createElement('li');
      field.classList.add('field');
      field.dataset.index = i;
      field.addEventListener('click', clickHandler);

      boardEl.appendChild(field);
    }
  };

  const clearFields = () => {
    fieldEls.forEach((field) => {
      field.classList.remove('disabled');
      field.textContent = '';
    });
  };

  const disableFields = () => {
    console.log('Called!');
    fieldEls.forEach((field) => {
      field.classList.add('disabled');
    });
  };

  const showResult = (winner) => {
    disableFields();

    if (winner) console.log(`Winner is Player ${winner}`);
    else console.log("It's a Draw!");
  };

  createFields();
  const fieldEls = document.querySelectorAll('.field');

  return { clearFields, showResult };
})();

'use strict';

/*
- state of fields
- restart functionality
- functionality to set field
- functionality to check winner
- declare winner
*/

const gameBoard = (function () {
  const board = new Array(9);

  const markField = (index, symbol) => {
    if (board[index] || index > board.length - 1) return false;

    board[index] = symbol;

    return true;
  };

  const getFieldMark = (index) => board[index];

  const clearBoard = () => {
    board.forEach((square) => {
      square = undefined;
    });
  };

  return { markField, getFieldMark, clearBoard };
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

  const playRound = (index) => {
    if (gameOver) return;

    if (gameBoard.markField(index, activePlayer.getSymbol())) {
      round++;
      activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }
  };

  const resetGame = () => {
    round = 1;
    activePlayer = playerOne;
    gameOver = false;
  };

  return { playRound, resetGame };
})();

const displayController = (function () {
  const boardEl = document.querySelector('.board');

  const clickHandler = (event) => {
    const field = event.target;
    const { index } = field.dataset;

    if (gameBoard.getFieldMark(index)) return;

    gameController.playRound(index);
    field.classList.add('chosen');
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
    const fields = document.querySelectorAll('.field');

    fields.forEach((field) => {
      field.classList.remove('chosen');
      field.textContent = '';
    });
  };

  createFields();

  return { clearFields };
})();

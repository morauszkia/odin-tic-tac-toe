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
    if (board[index]) return;
    if (index > board.length - 1) return;

    board[index] = symbol;

    console.log(board);
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
    console.log(`Round ${round}`);
    console.log(`Field ${index} clicked by Player ${activePlayer.getSymbol()}`);

    gameBoard.markField(index, activePlayer.getSymbol());

    round++;
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  return { playRound };
})();

const displayController = (function () {
  const boardEl = document.querySelector('.board');

  const clickHandler = (event) => {
    gameController.playRound(event.target.dataset.index);
  };

  const resetBoardEl = () => {
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

  resetBoardEl();
})();

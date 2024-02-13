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
    for (let i = 0; i < board.length; i++) {
      board[i] = undefined;
    }
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

const createPlayer = (symbol, name) => {
  this.name = name;

  const getSymbol = function () {
    return symbol;
  };

  const getName = function () {
    return this.name;
  };

  const changeName = function (newName) {
    if (newName) this.name = newName;
  };

  return { getSymbol, getName, changeName };
};

const gameController = (function () {
  const playerOne = createPlayer('X', 'Player X');
  const playerTwo = createPlayer('O', 'Player Y');

  const players = [playerOne, playerTwo];

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

  return { players, playRound, checkForWinner, resetGame };
})();

const displayController = (function () {
  const boardEl = document.querySelector('.board');

  // Name input related elements
  const saveBtnEls = document.querySelectorAll('.btn-save');
  const editBtnEls = document.querySelectorAll('.btn-edit');

  // Elements related to the results container
  const resultText = document.querySelector('.result-text');
  const startBtnEl = document.getElementById('start');
  const overlayEl = document.querySelector('.board-overlay');

  // Utility functions to show/hide elements
  const hideEl = (element) => {
    element.classList.add('hidden');
  };

  const showEl = (element) => {
    element.classList.remove('hidden');
  };

  const saveName = (event) => {
    const inputEl = event.target
      .closest('.input-container')
      .querySelector('.name-input');
    const enteredName = inputEl.value.trim();
    const symbol = inputEl.id.split('-')[1];
    const nameDisplayEl = document.getElementById(`name-${symbol}-display`);

    if (enteredName) {
      nameDisplayEl.textContent = enteredName;
      showEl(nameDisplayEl.closest('.name'));
      hideEl(inputEl.closest('.input-container'));

      const editedPlayerObject = gameController.players.find(
        (player) => player.getSymbol().toLowerCase() === symbol
      );
      editedPlayerObject.changeName(enteredName);
      console.log(editedPlayerObject.getName());
    } else {
      console.log('Nothing there!');
      // TODO: Add error message and state
    }
  };

  const editName = (event) => {
    const nameContainerEl = event.target.closest('.name');
    const player = nameContainerEl.querySelector('.name-text').id.split('-')[1];
    const inputEl = document.getElementById(`name-${player}`);
    hideEl(nameContainerEl);
    showEl(inputEl.closest('.input-container'));

    inputEl.value =
      inputEl.value || nameContainerEl.querySelector('.name-text').textContent;
  };

  saveBtnEls.forEach((btn) => btn.addEventListener('click', saveName));

  editBtnEls.forEach((btn) => btn.addEventListener('click', editName));

  const startGame = () => {
    const playerXDisplayEl = document.getElementById('name-x-display');
    const playerODisplayEl = document.getElementById('name-o-display');
    const playerXName = playerXDisplayEl.textContent;
    const playerOName = playerODisplayEl.textContent;

    if (!playerXName) playerXDisplayEl.textContent = 'Player X';
    if (!playerOName) playerODisplayEl.textContent = 'Player O';

    document
      .querySelectorAll('.input-container')
      .forEach((inputEl) => hideEl(inputEl));

    document
      .querySelectorAll('.name')
      .forEach((nameContainer) => showEl(nameContainer));

    hideEl(startBtnEl);
    hideEl(overlayEl);
  };

  startBtnEl.addEventListener('click', startGame);

  const fieldClickHandler = (event) => {
    const field = event.target;
    const { index } = field.dataset;

    if (field.classList.contains('disabled')) return;

    gameController.playRound(index);
    field.classList.add('disabled');
    field.textContent = gameBoard.getFieldMark(index);

    // TODO: Animate marks
  };

  const createFields = () => {
    for (let i = 0; i < 9; i++) {
      const field = document.createElement('li');
      field.classList.add('field');
      field.dataset.index = i;
      field.addEventListener('click', fieldClickHandler);

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

    resultText.textContent = winner
      ? `Winner is Player ${winner}`
      : "It's a Draw!";
    // TODO: Show result container with message and restart button
  };

  createFields();
  const fieldEls = document.querySelectorAll('.field');
  fieldEls.forEach((field) =>
    field.addEventListener('click', fieldClickHandler)
  );

  return { clearFields, showResult };
})();

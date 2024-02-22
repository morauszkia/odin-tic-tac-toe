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
  let playerName = name;

  const getSymbol = function () {
    return symbol;
  };

  const getName = function () {
    return playerName;
  };

  const changeName = function (newName) {
    if (newName) playerName = newName;
  };

  return { getSymbol, getName, changeName };
};

const gameController = (function () {
  const playerOne = createPlayer('X', 'Player X');
  const playerTwo = createPlayer('O', 'Player O');

  const players = {
    X: playerOne,
    O: playerTwo,
  };

  let round, activePlayer, gameOver;

  const getPlayer = (symbol) => {
    return players[symbol.toUpperCase()];
  };

  const checkEquality = (array) => {
    return array[0] && array[0] === array[1] && array[0] === array[2];
  };

  const checkForWinner = () => {
    const currentRows = gameBoard.getRows();
    const currentColumns = gameBoard.getColumns();
    const currentDiagonals = gameBoard.getDiagonals();

    for (const row of currentRows) {
      if (checkEquality(row)) return players[row[0]];
    }

    for (const column of currentColumns) {
      if (checkEquality(column)) return players[column[0]];
    }

    for (const diagonal of currentDiagonals) {
      if (checkEquality(diagonal)) return players[diagonal[0]];
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
      displayController.endGame(winner);
    }
  };

  const resetGame = () => {
    round = 1;
    activePlayer = playerOne;
    gameOver = false;
    gameBoard.clearBoard();
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const isGameOver = () => gameOver;

  resetGame();

  return {
    getPlayer,
    playRound,
    checkForWinner,
    resetGame,
    getActivePlayer,
    isGameOver,
  };
})();

const displayController = (function () {
  const boardEl = document.querySelector('.board');

  // Name input related elements
  const saveBtnEls = document.querySelectorAll('.btn-save');
  const editBtnEls = document.querySelectorAll('.btn-edit');

  // Elements related to the results container
  const resultContainer = document.querySelector('.result-container');
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

  const assignDefaultName = (symbol) => {
    const defaultName = `Player ${symbol.toUpperCase()}`;

    const inputEl = document.getElementById(`name-${symbol}`);
    const nameDisplay = document.getElementById(`name-${symbol}-display`);

    inputEl.value = defaultName;
    nameDisplay.textContent = defaultName;
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
      const editedPlayerObject = gameController.getPlayer(symbol);
      editedPlayerObject.changeName(enteredName);
    } else {
      assignDefaultName(symbol);
    }

    showEl(nameDisplayEl.closest('.name'));
    hideEl(inputEl.closest('.input-container'));
  };

  const editName = (event) => {
    const nameContainerEl = event.target.closest('.name');
    const player = nameContainerEl.querySelector('.name-text').id.split('-')[1];
    const inputEl = document.getElementById(`name-${player}`);
    hideEl(nameContainerEl);
    showEl(inputEl.closest('.input-container'));
  };

  saveBtnEls.forEach((btn) => btn.addEventListener('click', saveName));

  editBtnEls.forEach((btn) => btn.addEventListener('click', editName));

  const hideInactivePlayer = () => {
    const nameContainers = document.querySelectorAll('.name-container');
    const activePlayer = gameController.getActivePlayer();
    nameContainers.forEach((container) => {
      if (container.dataset.player == activePlayer.getSymbol()) {
        container.classList.remove('inactive');
      } else {
        container.classList.add('inactive');
      }
    });
  };

  const startGame = () => {
    const playerXName = document.getElementById('name-x-display').textContent;
    const playerOName = document.getElementById('name-o-display').textContent;

    if (!playerXName) assignDefaultName('x');
    if (!playerOName) assignDefaultName('o');

    document
      .querySelectorAll('.input-container')
      .forEach((inputEl) => hideEl(inputEl));

    document
      .querySelectorAll('.name')
      .forEach((nameContainer) => showEl(nameContainer));

    clearFields();
    gameController.resetGame();

    hideEl(resultContainer);
    hideEl(overlayEl);

    hideInactivePlayer();
  };

  startBtnEl.addEventListener('click', startGame);

  const fieldClickHandler = (event) => {
    const field = event.target;
    const { index } = field.dataset;

    if (field.classList.contains('disabled')) return;

    gameController.playRound(index);
    field.textContent = gameBoard.getFieldMark(index);
    field.classList.add('disabled');
    if (!gameController.isGameOver()) hideInactivePlayer();
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
    fieldEls.forEach((field) => {
      field.classList.add('disabled');
    });
  };

  const endGame = (winner) => {
    disableFields();
    const nameContainers = document.querySelectorAll('.name-container');

    nameContainers.forEach((container) => {
      container.classList.remove('inactive');
    });

    showResult(winner);
  };

  const showResult = (winner) => {
    resultText.textContent = winner
      ? `${winner.getName()} wins!`
      : "It's a Draw!";

    startBtnEl.innerHTML = `
      <i class="fa-solid fa-rotate"></i>
      Restart Game
    `;

    showEl(resultContainer);
    showEl(overlayEl);
  };

  createFields();
  const fieldEls = document.querySelectorAll('.field');
  fieldEls.forEach((field) =>
    field.addEventListener('click', fieldClickHandler)
  );

  return { clearFields, showResult, endGame };
})();

function getAISuggestion() {
  // TODO: compile the args for nextBestGuess() from inputs
  // TODO: update the values for the ai suggestion input
  // TODO: enable the copy button
}

function resetAISuggestion() {
  // TODO: blank out the values for the ai inputs
  // TODO: disable the copy button
}

function checkBoard() {
  // TODO: run this whenever an input value changes
  // TODO: run this when a row is removed
  // TODO: run this whenever the copy button is clicked
  // TODO: check if board (the inputs) is complete (doesn't have any "?" left)
  // TODO: if it is not complete: resetAISuggestion()
  // TODO: if complete: getAISuggestion()
}

function handleKeydown(event) {
  event.preventDefault();
  // TODO: detect which key was pressed and handle accordingly
}

function handleClickColor(event) {
  // TODO: update class of associated input
}

function getLastRow() {
  const rows = document.querySelectorAll(".row:not(.ai)");
  return rows[rows.length - 1];
}

function addRowListeners() {
  const row = getLastRow();
  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", handleKeydown);
  });
  row.querySelectorAll(".column").forEach((column) => {
    column.querySelectorAll("div").forEach((color) => {
      color.addEventListener("click", handleClickColor);
    });
  });
}

function removeRowListeners() {
  const row = getLastRow();
  row.querySelectorAll("input").forEach((input) => {
    input.removeEventListener("keydown", handleKeydown);
  });
  row.querySelectorAll(".column").forEach((column) => {
    column.querySelectorAll("div").forEach((color) => {
      color.removeEventListener("click", handleClickColor);
    });
  });
}

function handleClickMinus() {
  // TODO: if there is only one row, exit early
  removeRowListeners();
  // TODO: remove the last row
  checkBoard();
  // TODO: if there is only one row now, disable the minus button
}

function handleClickPlus() {
  // TODO: add a new row to the bottom
  addRowListeners();
  resetAISuggestion();
  // TODO: if there are at least 2 rows now, enable the minus button
}

function handleClickCopy() {
  // TODO: if there is not an ai suggestion, exit early
  // TODO: create a new row, prefilled with the ai suggestion
  checkBoard();
}

const buttonMinus = document.getElementById("btn-minus");
const buttonPlus = document.getElementById("btn-plus");
const buttonCopy = document.getElementById("btn-copy");

buttonMinus.addEventListener("click", handleClickMinus);
buttonPlus.addEventListener("click", handleClickPlus);
buttonCopy.addEventListener("click", handleClickCopy);

addRowListeners();

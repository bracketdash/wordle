const buttonMinus = document.getElementById("btn-minus");
const buttonPlus = document.getElementById("btn-plus");
const buttonCopy = document.getElementById("btn-copy");

const messageIncomplete = document.getElementById("msg-incomplete");
const messageUnavailable = document.getElementById("msg-unavailable");

function getAISuggestion() {
  // TODO: compile the args for nextBestGuess() from inputs
  // TODO: determine if ai suggestion and last row differ
  let aiAndLastRowDiffer = false;
  if (aiAndLastRowDiffer) {
    // TODO: update the ai suggestion input values
    buttonCopy.classList.remove("disabled");
    messageIncomplete.classList.add("hidden");
    messageUnavailable.classList.add("hidden");
  } else {
    resetAISuggestion();
    messageIncomplete.classList.add("hidden");
    messageUnavailable.classList.remove("hidden");
  }
}

function resetAISuggestion() {
  document.querySelectorAll(".row.ai > .word > input").forEach((input) => {
    input.value = "";
  });
  buttonCopy.classList.add("disabled");
  messageIncomplete.classList.remove("hidden");
  messageUnavailable.classList.add("hidden");
}

function checkBoard() {
  const hasBlanks = Array.from(
    document.querySelectorAll(".row:not(.ai) input")
  ).some((input) => !input.value);
  if (hasBlanks) {
    resetAISuggestion();
  } else {
    getAISuggestion();
  }
}

function handleClickColor(event) {
  const row = this.closest(".row");
  const column = this.parentElement;
  const columns = Array.from(row.querySelectorAll(".controls .column"));
  const columnIndex = columns.indexOf(column);
  const wordInputs = row.querySelectorAll(".word input");
  if (wordInputs[columnIndex]) {
    wordInputs[columnIndex].classList.remove("green", "yellow");
    if (this.classList[0] === "green" || this.classList[0] === "yellow") {
      wordInputs[columnIndex].classList.add(this.classList[0]);
    }
  }
}

function getNumRows() {
  return document.querySelectorAll(".row:not(.ai)").length;
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
  if (getNumRows() === 1) {
    return;
  }
  removeRowListeners();
  getLastRow().remove();
  if (getNumRows() === 1) {
    buttonMinus.classList.remove("minus");
    buttonMinus.classList.add("disabled");
  }
  checkBoard();
  getLastRow().querySelector("input:last-child").focus();
}

function handleClickPlus() {
  const original = getLastRow();
  const clone = original.cloneNode(true);
  original.parentNode.insertBefore(clone, original.nextSibling);
  clone.querySelectorAll("input").forEach((input) => {
    input.classList.remove("green", "yellow");
    input.value = "";
  });
  addRowListeners();
  resetAISuggestion();
  if (getNumRows() > 1) {
    buttonMinus.classList.remove("disabled");
    buttonMinus.classList.add("minus");
  }
  getLastRow().querySelector("input").focus();
}

function handleClickCopy() {
  const aiSuggestion = Array.from(
    document.querySelectorAll(".row.ai > .word > input")
  )
    .map((input) => input.value)
    .join("");
  if (aiSuggestion.length !== 5) {
    return;
  }
  const lastRowWord = Array.from(getLastRow().querySelectorAll("input"))
    .map((input) => input.value)
    .join("");
  if (lastRowWord.length) {
    handleClickPlus();
  } else {
    resetAISuggestion();
  }
  getLastRow()
    .querySelectorAll("input")
    .forEach((input, index) => {
      input.classList.remove("green", "yellow");
      input.value = aiSuggestion[index];
    });
  checkBoard();
}

buttonMinus.addEventListener("click", handleClickMinus);
buttonPlus.addEventListener("click", handleClickPlus);
buttonCopy.addEventListener("click", handleClickCopy);

addRowListeners();
getLastRow().querySelector("input").focus();

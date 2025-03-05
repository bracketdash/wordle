const buttonMinus = document.getElementById("btn-minus");
const buttonPlus = document.getElementById("btn-plus");
const buttonCopy = document.getElementById("btn-copy");

const messageIncomplete = document.getElementById("msg-incomplete");
const messageUnavailable = document.getElementById("msg-unavailable");
const messageSuccess = document.getElementById("msg-success");

function getHistory() {
  const history = [];
  document.querySelectorAll(".row:not(.ai)").forEach((row) => {
    let word = "";
    const colors = [];
    row.querySelectorAll("input").forEach((input) => {
      word += input.value;
      colors.push(input.className || "gray");
    });
    history.push([word.toLowerCase(), colors]);
  });
  return history;
}

function getInputsFromHistory(history) {
  const notheresObj = {};
  const somewheres = [];
  let gray = [];
  let green = ".....".split("");
  history.forEach((slice) => {
    slice[1].forEach((color, index) => {
      const letter = slice[0][index];
      if (color === "green") {
        green[index] = letter;
        const letterInSomewheres = somewheres.indexOf(letter);
        if (letterInSomewheres > -1) {
          somewheres.splice(letterInSomewheres, 1);
        }
      } else if (color === "gray") {
        if (!gray.includes(letter)) {
          gray.push(letter);
        }
      } else {
        if (notheresObj[letter]) {
          if (!notheresObj[letter].includes(index)) {
            notheresObj[letter].push(index);
          }
        } else {
          notheresObj[letter] = [index];
        }
        if (!somewheres.includes(letter)) {
          somewheres.push(letter);
        }
      }
    });
  });
  gray = gray.filter((g) => !somewheres.includes(g));
  const notheres = Object.keys(notheresObj).map((l) => [l, notheresObj[l]]);
  return { gray: gray.join(""), green: green.join(""), notheres, somewheres };
}

function getAISuggestion() {
  const history = getHistory();
  const inputs = getInputsFromHistory(history);
  let aiSuggestion = false;
  try {
    aiSuggestion = nextBestGuess(inputs);
  } catch (e) {
    console.log("Error from solver:");
    console.log(e);
  }
  return aiSuggestion;
}

function switchToMessage(whichOne) {
  messageIncomplete.classList.add("hidden");
  messageUnavailable.classList.add("hidden");
  messageSuccess.classList.add("hidden");
  if (whichOne) {
    switch (whichOne) {
      case "incomplete":
        messageIncomplete.classList.remove("hidden");
        break;
      case "unavailable":
        messageUnavailable.classList.remove("hidden");
        break;
      case "success":
        messageSuccess.classList.remove("hidden");
        break;
    }
  }
}

function resetAISuggestion() {
  document.querySelectorAll(".row.ai > .word > input").forEach((input) => {
    input.value = "";
  });
  buttonCopy.classList.add("disabled");
  switchToMessage("incomplete");
}

function showAISuggestion(suggestion) {
  document.querySelectorAll(".row.ai input").forEach((input, index) => {
    input.value = suggestion[index];
  });
  buttonCopy.classList.remove("disabled");
  switchToMessage(false);
}

function checkBoard() {
  const board = Array.from(document.querySelectorAll(".row:not(.ai) input"))
    .map((input) => input.value || "?")
    .join("");
  if (board.includes("?")) {
    if (board === "?????") {
      showAISuggestion("crate");
    } else {
      resetAISuggestion();
    }
    return;
  }
  // TODO: if all the inputs of the last row are green, show the success message and skip getting a new suggestion
  if (
    Array.from(getLastRow().querySelectorAll("input")).every(
      (input) => input.className === "green"
    )
  ) {
    resetAISuggestion();
    switchToMessage("unavailable");
  }
  const suggestion = getAISuggestion();
  if (suggestion) {
    showAISuggestion(suggestion);
  } else {
    resetAISuggestion();
    switchToMessage("unavailable");
  }
}

function handleClickColor() {
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
    checkBoard();
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
    input.classList.remove("yellow");
    if (input.className !== "green") {
      input.value = "";
    }
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
      input.value = aiSuggestion[index];
    });
  checkBoard();
}

buttonMinus.addEventListener("click", handleClickMinus);
buttonPlus.addEventListener("click", handleClickPlus);
buttonCopy.addEventListener("click", handleClickCopy);

addRowListeners();
getLastRow().querySelector("input").focus();

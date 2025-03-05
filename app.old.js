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

function nextClickHandler() {
  history.push([guess, [...posColors]]);
  let historyMarkup = "";
  history.forEach((slice) => {
    historyMarkup += '<div class="row">';
    slice[1].forEach((color, index) => {
      historyMarkup += `<input type="text" class="col letter ${color}-border" placeholer="?" value="${slice[0][index]}" />`;
    });
    historyMarkup += "</div>";
  });
  document.querySelectorAll(".history")[0].innerHTML = historyMarkup;
  const inputs = getInputsFromHistory(history);
  const guessClone = guess;
  guess = nextBestGuess(inputs);
  posColors.forEach((_, index) => {
    const guessLetter = document.querySelectorAll(".guess > .letter")[index];
    guessLetter.innerHTML = guess[index];
    if (!(guess[index] === guessClone[index] && posColors[index] === "green")) {
      guessLetter.setAttribute("class", "col letter gray-border");
      posColors[index] = "gray";
    }
  });
}

function replaceHandler() {
  const userGuess = prompt("Your guess:");
  if (!userGuess) {
    return;
  }
  if (userGuess.length === 5) {
    guess = userGuess;
    guess.split("").forEach((letter, index) => {
      document.querySelectorAll(".guess > .letter")[index].innerHTML = letter;
    });
  } else {
    alert("Guesses must be 5 characters long.");
  }
}

function setupLetterKeydown(el, index, els) {
  // TODO - use this to update `guess`: const id = el.getAttribute("id");
  el.addEventListener("keydown", (event) => {
    if (
      (event.key.length > 1 &&
        event.key !== "Backspace" &&
        event.key !== "Delete") ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }
    let val = el.value.replace(/[^A-Za-z]/g, "");
    const valLength = val.length;
    if (valLength) {
      val = val[val.length - 1];
      els[index + 1]?.focus();
    }
    el.value = val;
    if (!valLength) {
      if (event.key === "Backspace") {
        els[index - 1]?.focus();
      }
      if (event.key === "Delete") {
        els[index + 1]?.focus();
      }
    }
  });
}

function setupControlClick(el) {
  const id = el.getAttribute("id");
  el.addEventListener("click", () => {
    const index = Number(id[1]);
    const color = id.substring(2);
    posColors[index] = color;
    document
      .querySelectorAll(`.guess > .letter:nth-child(${index + 1})`)[0]
      .setAttribute("class", `col letter ${color}-border`);
  });
}

const history = [];
const posColors = Array(5).fill("gray");
let guess = "?????";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".letter").forEach(setupLetterKeydown);
  document.querySelectorAll(".control").forEach(setupControlClick);
  document
    .querySelectorAll(".button")[0]
    .addEventListener("click", nextClickHandler);
  document
    .querySelectorAll(".replace")[0]
    .addEventListener("click", replaceHandler);
});

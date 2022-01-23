function getInputsFromHistory(history) {
  const gray = [];
  const notheresObj = {};
  const somewheres = [];
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
  const notheres = Object.keys(notheresObj).map((l) => [l, notheresObj[l]]);
  return { gray: gray.join(""), green: green.join(""), notheres, somewheres };
}

function nextClickHandler() {
  history.push([guess, [...posColors]]);
  let historyMarkup = "";
  history.forEach((slice) => {
    historyMarkup += '<div class="row">';
    slice[1].forEach((color, index) => {
      historyMarkup += `<div class="col letter ${color}">${slice[0][index]}</div>`;
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
      guessLetter.setAttribute("class", "col letter gray");
      posColors[index] = "gray";
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
      .setAttribute("class", `col letter ${color}`);
  });
}

const history = [];
const posColors = Array(5).fill("gray");
let guess = "trace";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".control").forEach(setupControlClick);
  document
    .querySelectorAll(".button")[0]
    .addEventListener("click", nextClickHandler);
});

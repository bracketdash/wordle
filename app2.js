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
  const guessClone = guess;
  guess = nextBestGuess(history);
  posColors.forEach((_, index) => {
    const guessLetter = document.querySelectorAll(".guess > .letter")[index];
    guessLetter.innerHTML = guess[index];
    if (!(guess[index] === guessClone[index] && posColors[index] === "green")) {
      guessLetter.setAttribute("class", "col letter gray");
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
  document
    .querySelectorAll(".replace")[0]
    .addEventListener("click", replaceHandler);
});

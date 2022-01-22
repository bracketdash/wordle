// this file produces the contents of results.json

const wordsClone = [...words]; // from words.js

function getFeedback(word, guess) {
  const feedback = Array(5).fill("gray");
  const numGreens = {};
  guess.split("").forEach((letter, index) => {
    if (word[index] === letter) {
      feedback[index] = "green";
      if (numGreens[letter]) {
        numGreens[letter]++;
      } else {
        numGreens[letter] = 1;
      }
    } else if ((word.match(new RegExp(letter, "g")) || []).length > (numGreens[letter] || 0)) {
      feedback[index] = "yellow";
    }
  });
  return feedback;
}

function getInputsFromHistory(history) {
  const gray = [];
  const notheresObj = {};
  const somewheres = [];
  let green = ".....".split("");
  history.forEach((slice) => {
    slice.feedback.forEach((color, index) => {
      const letter = slice.guess[index];
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

function processGuess({ guess, history, word, results }) {
  const feedback = getFeedback(word, guess);
  history.push({ feedback, guess });
  if (feedback.every((c) => c === "green")) {
    results.push(history);
    startNewWord(results);
  } else {
    const { gray, green, notheres, somewheres } = getInputsFromHistory(history);
    const nextGuess = nextBestGuess({
      gray,
      green,
      notheres,
      somewheres,
      wordset: words, // from words.js
    }).toLowerCase();
    setTimeout(() => {
      processGuess({ guess: nextGuess, history, word, results });
    });
  }
}

function startNewWord(results) {
  const guess = "soare";
  const history = [];
  if (!wordsClone.length) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }
  const word = wordsClone.pop();
  console.log(word);
  setTimeout(() => {
    processGuess({ guess, history, word, results });
  });
}

startNewWord([]);

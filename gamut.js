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
    } else if (
      (word.match(new RegExp(letter, "g")) || []).length >
      (numGreens[letter] || 0)
    ) {
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

function processGuess({ guess, history, word }) {
  const feedback = getFeedback(word, guess);
  history.push({ feedback, guess });
  if (feedback.every((c) => c === "green")) {
    if (numGuessDist[`${history.length}_guesses`]) {
      numGuessDist[`${history.length}_guesses`]++;
    } else {
      numGuessDist[`${history.length}_guesses`] = 1;
    }
    startNewWord();
  } else {
    const { gray, green, notheres, somewheres } = getInputsFromHistory(history);
    const nextGuess = nextBestGuess({
      gray,
      green,
      notheres,
      somewheres,
      wordset: words, // from words.js
    }).toLowerCase();
    processGuess({ guess: nextGuess, history, word });
  }
}

let numGuessDist = {};
let wordsClone = [...words]; // from words.js
let starter = 0;

function startNewWord() {
  const guess = words[starter];
  const history = [];
  if (!wordsClone.length) {
    const numGuessDistPretty = Object.keys(numGuessDist)
      .map((g) => [Number(g.substring(0, 1)), numGuessDist[g]])
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    let totalGuesses = 0;
    numGuessDistPretty.forEach((ng) => {
      totalGuesses += ng[0] * ng[1];
    });
    if (totalGuesses / 2315 < 4) {
      console.log(`${guess} (${starter}): ${(totalGuesses / 2315).toFixed(3)}`);
    }
    numGuessDist = {};
    wordsClone = [...words];
    starter++;
    startNewWord();
    return;
  }
  const word = wordsClone.pop();
  setTimeout(() => {
    processGuess({ guess, history, word });
  });
}

startNewWord();

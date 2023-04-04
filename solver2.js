function filteredByCommonLetter(wordset, posFreqs, pos) {
  if (wordset.length === 1) {
    return wordset;
  }
  const letter = posFreqs.shift()[0];
  const attempt = wordset.filter((w) => w[pos] === letter);
  return attempt.length
    ? attempt
    : filteredByCommonLetter(wordset, posFreqs, pos);
}

function getEmptySlots(greens) {
  let emptySlots = [];
  let index;
  let start = 0;
  while ((index = greens.indexOf(".", start)) > -1) {
    emptySlots.push(index);
    start = index + 1;
  }
  return emptySlots;
}

function getFilteredWords(history, greens) {
  const greenPattern = new RegExp(greens.join(""));
  let filtered = words.filter((word) => greenPattern.test(word));
  history.forEach((slice) => {
    const thresholds = {};
    const grays = [];
    slice[1].forEach((color, index) => {
      const letter = slice[0][index];
      if (color === "yellow") {
        if (thresholds[letter]) {
          thresholds[letter]++;
        } else {
          thresholds[letter] = 1;
        }
        filtered = filtered.filter(
          (word) => word.includes(letter) && word[index] !== letter
        );
      } else if (color === "gray") {
        if (!grays.includes(letter)) {
          grays.push(letter);
        }
      }
    });
    greens.forEach((green) => {
      if (green !== ".") {
        if (thresholds[green]) {
          thresholds[green]++;
        } else {
          thresholds[green] = 1;
        }
      }
    });
    grays.forEach((gray) => {
      if (thresholds[gray]) {
        const grayPattern = new RegExp(gray, "g");
        filtered = filtered.filter((word) => {
          const matches = word.match(grayPattern);
          if (matches && matches.length > thresholds[gray]) {
            return false;
          }
          return true;
        });
      } else {
        filtered = filtered.filter((word) => !word.includes(gray));
      }
    });
  });
  return filtered;
}

function getFrequencyDist(wordset) {
  const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
  const freqs = {};
  Array.from(Array(5).keys()).forEach((osition) => {
    freqs[`p${osition}`] = alpha.reduce((o, l) => {
      o[l] = 0;
      return o;
    }, {});
  });
  wordset.forEach((word) => {
    Array.from(Array(5).keys()).forEach((osition) => {
      freqs[`p${osition}`][word[osition]]++;
    });
  });
  Array.from(Array(5).keys()).forEach((osition) => {
    freqs[`p${osition}`] = Object.keys(freqs[`p${osition}`]).map((letter) => [
      letter,
      freqs[`p${osition}`][letter],
    ]);
    freqs[`p${osition}`].sort((a, b) =>
      a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0
    );
  });
  return freqs;
}

function getGreens(history) {
  const greens = ".....".split("");
  history.forEach((slice) => {
    slice[1].forEach((color, index) => {
      if (color === "green") {
        greens[index] = slice[0][index];
      }
    });
  });
  return greens;
}

function nextBestGuess(history) {
  const greens = getGreens(history);
  let results = getFilteredWords(history, greens);
  const freqs = getFrequencyDist(results);
  const emptySlots = getEmptySlots(greens);
  emptySlots.sort((a, b) => {
    const aa = freqs[`p${a}`][0][1];
    const bb = freqs[`p${b}`][0][1];
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  });
  const numFiltered = results.length;
  emptySlots.forEach((osition) => {
    results = filteredByCommonLetter(results, freqs[`p${osition}`], osition);
  });
  return [results[0], numFiltered];
}

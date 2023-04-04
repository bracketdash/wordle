function getEmptySlots(green) {
  let emptySlots = [];
  let index;
  let start = 0;
  while ((index = green.indexOf(".", start)) > -1) {
    emptySlots.push(index);
    start = index + 1;
  }
  return emptySlots;
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

function filteredByHistory(history) {
  // TODO
}

function nextBestGuess(history) {
  let results = filteredByHistory(history);
  const freqs = getFrequencyDist(results);
  let greens = ".....".split("");
  history.forEach((slice) => {
    slice[1].forEach((color, index) => {
      if (color === "green") {
        greens[index] = slice[0][index];
      }
    });
  });
  const emptySlots = getEmptySlots(greens);
  emptySlots.sort((a, b) => {
    const aa = freqs[`p${a}`][0][1];
    const bb = freqs[`p${b}`][0][1];
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  });
  emptySlots.forEach((osition) => {
    results = filteredByCommonLetter(results, freqs[`p${osition}`], osition);
  });
  return results[0];
}

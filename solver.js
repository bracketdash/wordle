function filteredByInputs({ gray, green, notheres, somewheres }) {
  const disallows = {};
  Array.from(Array(5).keys()).forEach((osition) => {
    disallows[`p${osition}`] = gray;
  });
  if (notheres.length) {
    notheres.forEach((entry) => {
      const letter = entry[0];
      entry[1].forEach((osition) => {
        disallows[`p${osition}`] += letter;
      });
    });
  }
  const pattern = new RegExp(
    green
      .split("")
      .map((char, osition) => {
        if (char === ".") {
          return `[^${disallows[`p${osition}`]
            .split("")
            .filter((value, index, self) => self.indexOf(value) === index)
            .join("")}]`;
        } else {
          return char;
        }
      })
      .join("")
  );
  const filtered = words.filter((word) => pattern.test(word));
  if (!somewheres.length) {
    return filtered;
  } else {
    return filtered.filter((word) =>
      somewheres.every((letter) => {
        if (!word.includes(letter)) {
          return false;
        }
        const lp = new RegExp(letter, "g");
        const go = (green.match(lp) || []).length;
        if (word.match(lp).length - go === 0) {
          return false;
        }
        return true;
      })
    );
  }
}

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

function getInputFromHistory(history) {
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

function nextBestGuess(history) {
  const input = getInputFromHistory(history);
  let results = filteredByInputs(input);
  const freqs = getFrequencyDist(results);
  const emptySlots = getEmptySlots(input.green);
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

function filteredByInputs({ gray, green, notheres, somewheres, wordset }) {
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
  const filtered = wordset.filter((word) => pattern.test(word));
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
      a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0
    );
  });
  return freqs;
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

function filteredByCommonLetter(wordset, posFreqs, pos) {
  if (wordset.length === 1) {
    return wordset;
  }
  const letter = posFreqs.pop()[0];
  const attempt = wordset.filter((w) => w[pos] === letter);
  return attempt.length
    ? attempt
    : filteredByCommonLetter(wordset, posFreqs, pos);
}

function nextBestGuess(input) {
  // TODO: improve the algo until it naturally gets to soare as a first guess, then remove this if block
  if (input.green === "....." && !input.notheres.length && !input.gray) {
    return "SOARE";
  }
  let results = filteredByInputs(input);
  if (!results || !results.length) {
    return "CHECK INPUT";
  }
  const freqs = getFrequencyDist(results);
  const emptySlots = getEmptySlots(input.green);

  // TODO: Our current average number of guesses is 3.83
  // If there are improvements to be made, it's below and in `filteredByCommonLetter`

  emptySlots.forEach((osition) => {
    results = filteredByCommonLetter(results, freqs[`p${osition}`], osition);
  });

  return results[0].toUpperCase();
}

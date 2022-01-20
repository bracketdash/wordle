function displayNextBestGuess() {
  const green = document.getElementById("green").value.toLowerCase();
  const yellow = [];
  const gray = document.getElementById("gray").value.toLowerCase();

  const yellowStr = document.getElementById("yellow").value.toLowerCase();
  if (yellowStr.length) {
    yellowStr.split(";").forEach((seg) => {
      const ss = seg.split(":");
      yellow.push([ss[0], ss[1].split(",")]);
    });
  }

  const pattern = new RegExp(
    gray.length ? green.replace(/\./g, `[^${gray}]`) : green
  );
  const filtered = words.filter((word) => {
    if (!pattern.test(word)) {
      return false;
    }
    if (yellow.length) {
      return yellow.every((entry) => {
        const entryPattern = new RegExp(entry[0], "g");
        if (!word.includes(entry[0])) {
          return false;
        }

        ///// -- BUG: this doesn't work 100% of the time; need to fix
        
        // TODO: also return false if the word only contains the yellow letter (entry[0]) in already-known wrong places (entry[1])
        // should we just ignore the letters that are already in `green`?
        // same problem is happening with these latest changes
        
        const occurrences = word.match(entryPattern).length - (green.match(entryPattern) || []).length;
        let wrongCount = 0;
        entry[1].forEach((wrongPosition) => {
          if (word[wrongPosition] === entry[0]) {
            wrongCount++;
          }
        });
        if (wrongCount === occurrences) {
          return false;
        }
        
        /////

        return true;
      });
    }
    return true;
  });

  const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
  const freqs = {};
  Array.from(Array(5).keys()).forEach((osition) => {
    freqs[`p${osition}`] = alpha.reduce((o, l) => {
      o[l] = 0;
      return o;
    }, {});
  });
  filtered.forEach((word) => {
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

  const dot = ".";
  let emptySlots = [];
  let index;
  let results = filtered;
  let start = 0;
  while ((index = green.indexOf(dot, start)) > -1) {
    emptySlots.push(index);
    start = index + 1;
  }
  emptySlots.reverse();
  
  const chosenLetters = [];
  const getReducedSet = (wordset, osition) => {
    if (wordset.length === 1) {
      return wordset;
    }
    let letter = freqs[`p${osition}`].pop()[0];
    while (freqs[`p${osition}`].length > 1 && chosenLetters.includes(letter)) {
      letter = freqs[`p${osition}`].pop()[0];
    }
    const attempt = wordset.filter((w) => w[osition] === letter);
    if (attempt.length) {
      chosenLetters.push(letter);
      return attempt;
    } else {
      return getReducedSet(wordset, osition);
    }
  };
  emptySlots.forEach((osition) => {
    results = getReducedSet(results, osition);
  });

  document.getElementById("guess").innerHTML = results[0].toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("button")
    .addEventListener("click", displayNextBestGuess);
});

function getReducedSet(wordset, posFreqs, osition) {
  if (wordset.length === 1) {
    return wordset;
  }
  const letter = posFreqs.length > 1 ? posFreqs.pop()[0] : posFreqs[0][0];
  const attempt = wordset.filter((w) => w[osition] === letter);
  return attempt.length ? attempt : getReducedSet(wordset, posFreqs, osition);
}

function getFilteredSet(green, yellow, gray) {
  const pattern = new RegExp(
    gray.length ? green.replace(/\./g, `[^${gray}]`) : green
  );
  let filtered = words.filter((word) => pattern.test(word));
  if (yellow) {
    const yellowArr = [];
    yellow.split(";").forEach((seg) => {
      const ss = seg.split(":");
      yellowArr.push([ss[0], ss[1].split(",")]);
    });
    filtered = filtered.filter((word) => {
      if (yellowArr.length) {
        return yellowArr.every((entry) => {
          const entryPattern = new RegExp(entry[0], "g");
          if (!word.includes(entry[0])) {
            return false;
          }
          const occurrences =
            word.match(entryPattern).length -
            (green.match(entryPattern) || []).length;
          if (!occurrences) {
            return false;
          }
          // still not sure this is the right logic...
          let wrongCount = 0;
          entry[1].forEach((wrongPosition) => {
            if (word[wrongPosition] === entry[0]) {
              wrongCount++;
            }
          });
          if (wrongCount === occurrences) {
            return false;
          }
          return true;
        });
      }
      return true;
    });
  }
  return filtered;
}

function nextBestGuess() {
  const green = document.getElementById("green").value.toLowerCase();
  const yellow = document.getElementById("yellow").value.toLowerCase();
  const gray = document.getElementById("gray").value.toLowerCase();
  if (green === "....." && !yellow && !gray) {
    return "SOARE";
  }
  const filtered = getFilteredSet(green, yellow, gray);
  if (!filtered || !filtered.length) {
    return "CHECK INPUT";
  }

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

  let emptySlots = [];
  let index;
  let start = 0;
  while ((index = green.indexOf(".", start)) > -1) {
    emptySlots.push(index);
    start = index + 1;
  }
  let results = filtered;
  emptySlots.forEach((osition) => {
    results = getReducedSet(results, freqs[`p${osition}`], osition);
  });

  return results[0].toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", () => {
    document.getElementById("guess").innerHTML = nextBestGuess();
  });
});

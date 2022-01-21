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

function filteredByInputs(green, yellow, gray) {
  const yellows = [];
  const disallows = {};
  Array.from(Array(5).keys()).forEach((osition) => {
    disallows[`p${osition}`] = gray;
  });
  if (yellow) {
    yellow.split(";").forEach((seg) => {
      const ss = seg.split(":");
      const letter = ss[0];
      yellows.push(letter);
      ss[1].split(",").forEach((osition) => {
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
  if (!yellows.length) {
    return filtered;
  } else {
    return filtered.filter((word) =>
      yellows.every((entry) => {
        if (!word.includes(entry[0])) {
          return false;
        }
        const lp = new RegExp(entry[0], "g");
        const go = (green.match(lp) || []).length;
        if (word.match(lp).length - go === 0) {
          return false;
        }
        return true;
      })
    );
  }
}

function nextBestGuess() {
  const green = document.getElementById("green").value.toLowerCase();
  const yellow = document.getElementById("yellow").value.toLowerCase();
  const gray = document.getElementById("gray").value.toLowerCase();
  if (green === "....." && !yellow && !gray) {
    return "SOARE";
  }
  const filtered = filteredByInputs(green, yellow, gray);
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
    results = filteredByCommonLetter(results, freqs[`p${osition}`], osition);
  });

  return results[0].toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", () => {
    document.getElementById("guess").innerHTML = nextBestGuess();
  });
});

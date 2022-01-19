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
  
  const pattern = new RegExp(gray.length ? green.replace(/\./g, `[^${gray}]`) : green);
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
        const occurrences = word.match(entryPattern).length;
        if (occurrences <= entry[1].length) {
          let wrongCount = 0;
          entry[1].forEach((wrongPosition) => {
            if (word[wrongPosition] === entry[0]) {
              wrongCount++;
            }
          });
          if (wrongCount === occurrences) {
            return false;
          }
        }
        return true;
      });
    }
    return true;
  });
  // TODO: get statistical best next guess (for now just give the first word that qualifies)
  document.getElementById('guess').innerHTML = filtered[0].toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", displayNextBestGuess);
});

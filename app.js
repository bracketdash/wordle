function gatherInputData() {
  const gray = document.getElementById("gray").value.toLowerCase();
  const green = document.getElementById("green").value.toLowerCase();
  const yellow = document.getElementById("yellow").value.toLowerCase();

  const notheres = [];
  const somewheres = [];
  if (yellow) {
    yellow.split(";").forEach((seg) => {
      const ss = seg.split(":");
      const letter = ss[0];
      const nothere = [letter, []];
      ss[1].split(",").forEach((pos) => {
        nothere[1].push(pos);
      });
      notheres.push(nothere);
      somewheres.push(letter);
    });
  }

  const wordset = words; // from words.js
  return { gray, green, notheres, somewheres, wordset };
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", () => {
    document.getElementById("guess").innerHTML = nextBestGuess(gatherInputData());
  });
});

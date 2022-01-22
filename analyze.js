// run in node

const fs = require("fs");
fs.readFile("results.json", (_, data) => {
  const results = JSON.parse(data);
  console.log(`${results.length} sessions total.`);
  console.log("Distribution of number of guesses:");
  const numGuessDist = {};
  let worstWord = "";
  results.forEach((sesh) => {
    if (numGuessDist[`${sesh.length}_guesses`]) {
      numGuessDist[`${sesh.length}_guesses`]++;
    } else {
      numGuessDist[`${sesh.length}_guesses`] = 1;
    }
    if (sesh.length > 7) {
      console.log(
        `Difficult word found: ${sesh[sesh.length - 1].guess} (${
          sesh.length
        } guesses)`
      );
    }
    if (sesh.length === 10) {
      worstWord = sesh[sesh.length - 1].guess;
    }
  });
  const numGuessDistPretty = Object.keys(numGuessDist)
    .map((g) => [Number(g.substring(0, 1)), numGuessDist[g]])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  console.log(numGuessDistPretty.join("\n"));
  let totalGuesses = 0;
  numGuessDistPretty.forEach((ng) => {
    totalGuesses += ng[0] * ng[1];
  });
  console.log(`Average number of guesses: ${totalGuesses / results.length}`);
  console.log(`Worst Word (10 guesses): ${worstWord}`);
});

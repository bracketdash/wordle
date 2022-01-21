// For each word in the word list:
// 1. Guess "SOARE"
// 2. Get feedback
// 3. Save guess with feedback to history array
// 4. If feedback is not all green, make the next best guess* and go back to step 2.
// 5. If feedback is all green, save the history to the results array.

// *next best guess: Look at the history array for the current word:
//  GREENS - "....." with known letters (anywhere in history) filled in
//  GRAYS - unique letters from full history
//  NOTHERES - yellow letters and the positions we know they're not in
//  SOMEWHERES - yellow letters that have not subsequently been marked green

function getFeedback(word, guess) {
  const feedback = Array(5).fill("gray");
  guess.split("").forEach((letter, index) => {
    if (word[index] === letter) {
      feedback[index] = "green";
    } else if (word.includes(letter)) {
      feedback[index] = "yellow";
    }
  });
}

function getInputsFromHistory(history) {
  // TODO
}

function checkBoard() {
  // run this whenever an input value changes
  // run this when a row is removed
  // run this whenever the copy button is clicked

  // check if board (the inputs) is complete (doesn't have any "?" left)
  // if it is not complete: hide ai suggestion, disable the copy button
  // if complete: get new ai suggestion, enable the copy button
}

function handleMinusClick() {
  // TODO: if there is only one row, exit early
  // TODO: remove the last row, then checkBoard()
  // TODO: if there is only one row now, disable the minus button
}

function handlePlusClick() {
  // TODO: add a new row to the bottom
  // TODO: if there are at least 2 rows now, enable the minus button
}

function handleCopyClick() {
  // TODO: if there is not an ai suggestion, exit early
  // TODO: create a new row, prefilled with the ai suggestion, then checkBoard()
}

// TODO: stuff to make working with the inputs smooth for the user

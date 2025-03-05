function isAlphabetLetter(key) {
  return key.length === 1 && key.match(/[a-zA-Z]/);
}

function isRowEmpty(rowElement) {
  return Array.from(rowElement.querySelectorAll(".word input")).every(
    (input) => input.value === ""
  );
}

function getFocusInfo(input) {
  const row = input.closest(".row");
  const allRows = Array.from(document.querySelectorAll(".row:not(.ai)"));
  const rowIndex = allRows.indexOf(row);
  const inputs = Array.from(row.querySelectorAll(".word input"));
  const currentIndex = inputs.indexOf(input);
  return {
    row,
    allRows,
    rowIndex,
    inputs,
    currentIndex,
    isLastRow: rowIndex === allRows.length - 1,
    isFirstRow: rowIndex === 0,
    isLastInput: currentIndex === inputs.length - 1,
    isFirstInput: currentIndex === 0,
    isEmpty: input.value === "",
  };
}

function moveFocus(focusInfo, rowOffset, colIndex) {
  const newRow = focusInfo.allRows[focusInfo.rowIndex + rowOffset];
  if (newRow) {
    const newInputs = Array.from(newRow.querySelectorAll(".word input"));
    if (colIndex >= 0 && colIndex < newInputs.length) {
      newInputs[colIndex].focus();
    }
  }
}

function handleAddRowAndFocus(colIndex) {
  handleClickPlus();
  setTimeout(() => {
    const updatedRows = Array.from(document.querySelectorAll(".row:not(.ai)"));
    const newRow = updatedRows[updatedRows.length - 1];
    if (newRow) {
      const newInputs = Array.from(newRow.querySelectorAll(".word input"));
      if (colIndex >= 0 && colIndex < newInputs.length) {
        newInputs[colIndex].focus();
      }
    }
  }, 10);
}

function handleAddRowAndSetValue(letter) {
  handleClickPlus();
  setTimeout(() => {
    const updatedRows = Array.from(document.querySelectorAll(".row:not(.ai)"));
    const newRow = updatedRows[updatedRows.length - 1];
    if (newRow) {
      const newInputs = Array.from(newRow.querySelectorAll(".word input"));
      if (newInputs.length > 0) {
        newInputs[0].value = letter.toUpperCase();
        newInputs[0].focus();
      }
    }
  }, 10);
}

function deleteEmptyRow(focusInfo) {
  const previousRowIndex = focusInfo.rowIndex - 1;
  handleClickMinus();
  if (previousRowIndex >= 0) {
    setTimeout(() => {
      const updatedRows = Array.from(
        document.querySelectorAll(".row:not(.ai)")
      );
      if (updatedRows.length > 0) {
        const newLastRow = updatedRows[updatedRows.length - 1];
        const lastRowInputs = Array.from(
          newLastRow.querySelectorAll(".word input")
        );
        if (lastRowInputs.length > 0) {
          lastRowInputs[lastRowInputs.length - 1].focus();
        }
      }
    }, 10);
  }
}

function handleAlphabetKey(event, focusInfo) {
  const input = event.target;
  const letter = event.key;
  if (!focusInfo.isEmpty && focusInfo.isLastInput && focusInfo.isLastRow) {
    handleAddRowAndSetValue(letter);
  } else if (!focusInfo.isEmpty && !focusInfo.isLastInput) {
    moveFocus(focusInfo, 0, focusInfo.currentIndex + 1);
    setTimeout(() => {
      const nextInput = focusInfo.inputs[focusInfo.currentIndex + 1];
      if (nextInput) {
        nextInput.value = letter.toUpperCase();
      }
    }, 0);
  } else {
    input.value = letter.toUpperCase();
    if (!focusInfo.isLastInput) {
      moveFocus(focusInfo, 0, focusInfo.currentIndex + 1);
    } else if (!focusInfo.isLastRow) {
      moveFocus(focusInfo, 1, 0);
    }
  }
  checkBoard();
}

function handleArrowRight(focusInfo) {
  if (focusInfo.isLastInput) {
    if (focusInfo.isLastRow) {
      handleAddRowAndFocus(0);
    } else {
      moveFocus(focusInfo, 1, 0);
    }
  } else {
    moveFocus(focusInfo, 0, focusInfo.currentIndex + 1);
  }
}

function handleArrowLeft(focusInfo) {
  if (focusInfo.isFirstInput) {
    if (!focusInfo.isFirstRow) {
      const prevRow = focusInfo.allRows[focusInfo.rowIndex - 1];
      const prevRowInputs = Array.from(prevRow.querySelectorAll(".word input"));
      moveFocus(focusInfo, -1, prevRowInputs.length - 1);
    }
  } else {
    moveFocus(focusInfo, 0, focusInfo.currentIndex - 1);
  }
}

function handleArrowDown(focusInfo) {
  if (focusInfo.isLastRow) {
    handleAddRowAndFocus(focusInfo.currentIndex);
  } else {
    moveFocus(focusInfo, 1, focusInfo.currentIndex);
  }
}

function handleArrowUp(focusInfo) {
  if (!focusInfo.isFirstRow) {
    moveFocus(focusInfo, -1, focusInfo.currentIndex);
  }
}

function handleTab(event, focusInfo) {
  if (event.shiftKey) {
    if (focusInfo.isFirstInput && !focusInfo.isFirstRow) {
      moveFocus(focusInfo, -1, focusInfo.inputs.length - 1);
    } else {
      moveFocus(focusInfo, 0, focusInfo.currentIndex - 1);
    }
  } else {
    if (focusInfo.isLastInput && focusInfo.isLastRow) {
      handleAddRowAndFocus(0);
    } else if (focusInfo.isLastInput && !focusInfo.isLastRow) {
      moveFocus(focusInfo, 1, 0);
    } else {
      moveFocus(focusInfo, 0, focusInfo.currentIndex + 1);
    }
  }
}

function handleBackspace(focusInfo) {
  const input =
    focusInfo.row.querySelectorAll(".word input")[focusInfo.currentIndex];
  if (focusInfo.isEmpty) {
    if (focusInfo.isFirstInput && focusInfo.isLastRow) {
      const allEmpty = focusInfo.inputs.every((input) => input.value === "");
      if (allEmpty && focusInfo.allRows.length > 1) {
        deleteEmptyRow(focusInfo);
        return;
      }
    }
    if (!focusInfo.isFirstInput) {
      const prevInput = focusInfo.inputs[focusInfo.currentIndex - 1];
      prevInput.value = "";
      moveFocus(focusInfo, 0, focusInfo.currentIndex - 1);
    } else if (!focusInfo.isFirstRow) {
      moveFocus(
        focusInfo,
        -1,
        focusInfo.allRows[focusInfo.rowIndex - 1].querySelectorAll(
          ".word input"
        ).length - 1
      );
    }
  } else {
    input.value = "";
  }
  checkBoard();
}

function handleDelete(focusInfo) {
  const input =
    focusInfo.row.querySelectorAll(".word input")[focusInfo.currentIndex];
  if (focusInfo.isLastInput) {
    if (focusInfo.isLastRow && focusInfo.allRows.length > 1) {
      if (isRowEmpty(focusInfo.row)) {
        handleClickMinus();
        setTimeout(() => {
          const updatedRows = Array.from(
            document.querySelectorAll(".row:not(.ai)")
          );
          if (updatedRows.length > 0) {
            const newLastRow = updatedRows[updatedRows.length - 1];
            const lastRowInputs = Array.from(
              newLastRow.querySelectorAll(".word input")
            );
            if (lastRowInputs.length > 0) {
              lastRowInputs[lastRowInputs.length - 1].focus();
            }
          }
        }, 10);
        return;
      }
    } else if (focusInfo.rowIndex === focusInfo.allRows.length - 2) {
      const lastRow = focusInfo.allRows[focusInfo.allRows.length - 1];
      if (isRowEmpty(lastRow) && !input.value) {
        handleClickMinus();
        return;
      }
    }
  }
  input.value = "";
  if (focusInfo.isLastInput) {
    if (!focusInfo.isLastRow) {
      moveFocus(focusInfo, 1, 0);
    }
  } else {
    moveFocus(focusInfo, 0, focusInfo.currentIndex + 1);
  }
  checkBoard();
}

function handleEnter(focusInfo) {
  if (focusInfo.isLastInput && focusInfo.isLastRow) {
    handleAddRowAndFocus(0);
  } else if (focusInfo.isLastInput) {
    moveFocus(focusInfo, 1, 0);
  } else {
    moveFocus(focusInfo, 0, focusInfo.currentIndex + 1);
  }
}

function handleKeydown(event) {
  const input = event.target;
  const focusInfo = getFocusInfo(input);
  const printableChar = isAlphabetLetter(event.key);
  const controlKeys = [
    "Tab",
    "ArrowRight",
    "ArrowLeft",
    "ArrowDown",
    "ArrowUp",
    "Backspace",
    "Delete",
    "Enter",
  ];
  if (
    printableChar ||
    controlKeys.includes(event.key) ||
    event.key.length === 1
  ) {
    event.preventDefault();
  }
  if (printableChar) {
    handleAlphabetKey(event, focusInfo);
  } else if (controlKeys.includes(event.key)) {
    switch (event.key) {
      case "ArrowRight":
        handleArrowRight(focusInfo);
        break;
      case "ArrowLeft":
        handleArrowLeft(focusInfo);
        break;
      case "ArrowDown":
        handleArrowDown(focusInfo);
        break;
      case "ArrowUp":
        handleArrowUp(focusInfo);
        break;
      case "Tab":
        handleTab(event, focusInfo);
        break;
      case "Backspace":
        handleBackspace(focusInfo);
        break;
      case "Delete":
        handleDelete(focusInfo);
        break;
      case "Enter":
        handleEnter(focusInfo);
        break;
    }
  }
}

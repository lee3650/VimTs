import Point from './Point'

export function HandleMove(
  text: string[],
  cursorPos: Point,
  command: string
): Point {
  switch (command) {
    case 'ArrowDown':
    case 'j': // move cursor down
      if (cursorPos.row < text.length - 1) {
        // check if bottom of screen
        if (cursorPos.col > text[cursorPos.row + 1].length) {
          // check if current cursor column position is past the length of the row under current
          cursorPos = new Point(
            cursorPos.row + 1,
            text[cursorPos.row + 1].length
          )
          return cursorPos // Fencepost error???
        } else {
          //console.log('Please?')
          cursorPos = new Point(cursorPos.row + 1, cursorPos.col)
          return cursorPos
        }
      } else {
        return cursorPos
      }
    case 'ArrowUp':
    case 'k':
      if (cursorPos.row != 0) {
        // check if top of screen
        if (cursorPos.col > text[cursorPos.row - 1].length) {
          // check if cursor col is past length of row above
          cursorPos = new Point(
            cursorPos.row - 1,
            text[cursorPos.row - 1].length
          )
          return cursorPos // Fencepost error???
        } else {
          cursorPos = new Point(cursorPos.row - 1, cursorPos.col)
          return cursorPos
        }
      } else {
        return cursorPos
      }
    case 'ArrowRight':
    case 'l':
      if (cursorPos.col < text[cursorPos.row].length) {
        // Make sure it isnt larger than the string itself
        cursorPos = new Point(cursorPos.row, cursorPos.col + 1)
        return cursorPos // Fencepost
      } else {
        return cursorPos
      }
    case 'ArrowLeft':
    case 'h':
      if (cursorPos.col > 0) {
        // Stay on the screen
        cursorPos = new Point(cursorPos.row, cursorPos.col - 1)
        return cursorPos // Fencepost
      } else {
        return cursorPos
      }
    case '0':
      return (cursorPos = new Point(cursorPos.row, 0))
    case '$':
      return (cursorPos = new Point(cursorPos.row, text[cursorPos.row].length))
  }
  if (command == 'w') {
    return handlew(text, cursorPos)
  }
  if (command == 'b') {
    return handleb(text, cursorPos)
  }

  return cursorPos
}

const isAlphaNumeric = (v: string) => {
  const code = v.charCodeAt(0)
  if (
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  ) {
    // lower alpha (a-z)
    return false
  }
  return true
}

const handlew = (text: string[], curPos: Point): Point => {
  let foundBreak = false
  for (let i = curPos.col; i < text[curPos.row].length; i++) {
    if (!isAlphaNumeric(text[curPos.row][i])) {
      foundBreak = true
    } else {
      if (foundBreak) return new Point(curPos.row, i)
    }
  }

  if (curPos.row + 1 < text.length) {
    for (let i = 0; i < text[curPos.row + 1].length; i++) {
      if (isAlphaNumeric(text[curPos.row + 1][i])) {
        return new Point(curPos.row + 1, i)
      }
    }

    return new Point(curPos.row + 1, 0)
  } else {
    return new Point(curPos.row, text[curPos.row].length - 1)
  }
}

const handleb = (text: string[], curPos: Point): Point => {
  let breaks = 1
  let anybreak = false
  if (
    curPos.col - 1 >= 0 &&
    (!isAlphaNumeric(text[curPos.row][curPos.col - 1]) ||
      !isAlphaNumeric(text[curPos.row][curPos.col]))
  )
    breaks = 2

  for (let i = curPos.col; i >= 0; i--) {
    if (!isAlphaNumeric(text[curPos.row][i])) {
      anybreak = true
      breaks--
      if (breaks == 0) {
        return new Point(curPos.row, i + 1)
      }
    }
  }

  if (anybreak) {
    return new Point(curPos.row, 0)
  }

  if (curPos.row - 1 >= 0) {
    for (let i = text[curPos.row - 1].length - 1; i >= 0; i--) {
      if (isAlphaNumeric(text[curPos.row - 1][i])) {
        return new Point(curPos.row - 1, i)
      }
    }
    return new Point(curPos.row - 1, text[curPos.row - 1].length - 1)
  } else {
    return new Point(curPos.row, 0)
  }
}

import VimOutput from './VimOutput'
import { NORMAL_MODE } from './Vim'
import Point from './Point'

const HandleInsert = (curstate: VimOutput, command: string): VimOutput => {
  return ExecuteInsertMode(curstate, command)
}

function ExecuteControlInsertMode(
  curstate: VimOutput,
  commands: string
): VimOutput {
  switch (commands) {
    case 't':
      curstate.text[curstate.cursorPos.row] =
        '\t' + curstate.text[curstate.cursorPos.row]
      curstate.cursorPos = new Point(
        curstate.cursorPos.row,
        curstate.cursorPos.col + 1
      )
      return curstate
    case 'd':
      if (curstate.text[curstate.cursorPos.row][0] == '\t') {
        curstate.text[curstate.cursorPos.row] =
          curstate.text[curstate.cursorPos.row].substring(1)
        curstate.cursorPos = new Point(
          curstate.cursorPos.row,
          curstate.cursorPos.col - 1
        )
        return curstate
      }
      return curstate
    default:
      return curstate
  }
}

function ExecuteInsertMode(curstate: VimOutput, commands: string): VimOutput {
  if (curstate.isCntrlKeyDown) {
    return ExecuteControlInsertMode(curstate, commands)
  }
  switch (commands) {
    case 'Escape':
      curstate.mode = NORMAL_MODE
      return curstate
    case 'Backspace':
      if (curstate.cursorPos.col > 0) {
        // Stay on the screen
        const newText = curstate.text
        newText[curstate.cursorPos.row] =
          curstate.text[curstate.cursorPos.row].slice(
            0,
            curstate.cursorPos.col - 1
          ) +
          curstate.text[curstate.cursorPos.row].slice(curstate.cursorPos.col)
        curstate.cursorPos = new Point(
          curstate.cursorPos.row,
          curstate.cursorPos.col - 1
        )
        return curstate
      } else if (curstate.cursorPos.row > 0) {
        const newText = curstate.text
        let rowLen = 0
        rowLen = newText[curstate.cursorPos.row].length
        newText[curstate.cursorPos.row - 1] = newText[
          curstate.cursorPos.row - 1
        ].concat(newText[curstate.cursorPos.row])
        let temp = ''
        for (let i = curstate.cursorPos.row; i < newText.length - 1; i++) {
          temp = newText[i + 1]
          newText[i] = temp
        }
        //+ curstate.text[curstate.cursorPos.row].slice(curstate.cursorPos.col)
        curstate.cursorPos = new Point(
          curstate.cursorPos.row - 1,
          newText[curstate.cursorPos.row - 1].length - rowLen
        )
        newText.splice(-1)
        return curstate
      } else {
        return curstate
      }
    case 'Delete':
      if (
        curstate.cursorPos.col < curstate.text[curstate.cursorPos.row].length
      ) {
        // Stay on the screen
        const newText = curstate.text
        newText[curstate.cursorPos.row] =
          curstate.text[curstate.cursorPos.row].slice(
            0,
            curstate.cursorPos.col
          ) +
          curstate.text[curstate.cursorPos.row].slice(
            curstate.cursorPos.col + 1
          )
        return curstate
      } else if (
        curstate.cursorPos.row <
        curstate.text[curstate.cursorPos.row].length - 1
      ) {
        const newText = curstate.text
        // let rowLen = 0
        // rowLen = newText[curstate.cursorPos.row].length
        newText[curstate.cursorPos.row] = newText[
          curstate.cursorPos.row
        ].concat(newText[curstate.cursorPos.row + 1])
        let temp = ''
        for (let i = curstate.cursorPos.row + 1; i < newText.length - 1; i++) {
          temp = newText[i + 1]
          newText[i] = temp
        }
        //+ curstate.text[curstate.cursorPos.row].slice(curstate.cursorPos.col)
        newText.splice(-1)
        return curstate
      } else {
        return curstate
      }
    case 'Enter': {
      const newText = curstate.text
      let temp = curstate.text[curstate.cursorPos.row].slice(
        curstate.cursorPos.col
      )
      newText[curstate.cursorPos.row] = curstate.text[
        curstate.cursorPos.row
      ].slice(0, curstate.cursorPos.col)
      let replace = ''
      newText.push('')
      for (let i = curstate.cursorPos.row + 1; i < newText.length; i++) {
        replace = newText[i]
        newText[i] = temp
        temp = replace
      }
      //+ curstate.text[curstate.cursorPos.row].slice(curstate.cursorPos.col)
      curstate.cursorPos = new Point(curstate.cursorPos.row + 1, 0)
      curstate.text = newText
      return curstate
    }
    case 'Shift': // fallthrough
    case 'F12':
    case 'F11':
    case 'F10':
    case 'F9':
    case 'F8':
    case 'F7':
    case 'F6':
    case 'F5':
    case 'F4':
    case 'F3':
    case 'F2':
    case 'F1':
    case 'Control':
      return curstate
  }
  const newText = curstate.text
  newText[curstate.cursorPos.row] =
    curstate.text[curstate.cursorPos.row].slice(0, curstate.cursorPos.col) +
    commands +
    curstate.text[curstate.cursorPos.row].slice(curstate.cursorPos.col)
  curstate.cursorPos = new Point(
    curstate.cursorPos.row,
    curstate.cursorPos.col + 1
  )
  return curstate
}

export default HandleInsert

import VimOutput from './VimOutput'
import { NORMAL_MODE } from './Vim'
import Point from './Point'

function ExecuteCommand(curstate: VimOutput) {
  return curstate
}

const HandleCommand = (curstate: VimOutput, command: string): VimOutput => {
  switch (command) {
    case 'Escape':
      curstate.mode = NORMAL_MODE
      curstate.commandText = ''
      curstate.commandCursorPos = new Point(0, 0)
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
      }
      return curstate
    case 'Enter':
      ExecuteCommand(curstate)
      curstate.mode = NORMAL_MODE
      curstate.commandText = ''
      curstate.commandCursorPos = new Point(0, 0)
      return curstate
    default:
      curstate.commandCursorPos.col = curstate.commandCursorPos.col + 1
      curstate.commandText = curstate.commandText.concat(command)
      return curstate
  }
}

export default HandleCommand

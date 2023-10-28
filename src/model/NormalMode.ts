import VimOutput from './VimOutput'
import { VISUAL_MODE, INSERT_MODE, COMMAND_MODE } from './Vim'
import Point from './Point'
import { HandleMove } from './Utility'

const HandleNormal = (curstate: VimOutput, command: string): VimOutput => {
  switch (command) {
    case 'i': // Switch to insert mode
      curstate.mode = INSERT_MODE
      return curstate
    case ':':
      curstate.mode = COMMAND_MODE
      return new VimOutput(
        curstate.text,
        curstate.cursorPos,
        COMMAND_MODE,
        curstate.isCntrlKeyDown,
        new Point(0, 0),
        new Point(0, 0),
        ''
      )
    case 'j': // move cursor down
    case 'k':
    case 'l':
    case 'h':
    case '0':
    case '$':
    case 'w':
    case 'b':
      curstate.cursorPos = HandleMove(
        curstate.text,
        curstate.cursorPos,
        command
      )
      return curstate
    case 'v':
      curstate.mode = VISUAL_MODE
      curstate.visualStart = curstate.cursorPos
      return curstate
  }
  return curstate
}

export default HandleNormal

import VimOutput from './VimOutput'
import { NORMAL_MODE, VISUAL_MODE } from './Vim'
import { HandleMove } from './Utility'

const HandleVisual = (curstate: VimOutput, command: string): VimOutput => {
  switch (command) {
    case 'h':
    case 'l':
    case 'k':
    case 'j': {
      const newpos = HandleMove(curstate.text, curstate.cursorPos, command)
      return new VimOutput(
        curstate.text,
        newpos,
        VISUAL_MODE,
        curstate.isCntrlKeyDown,
        curstate.clipboard,
        curstate.visualStart
      )
    }
    case 'Escape':
      return new VimOutput(
        curstate.text,
        curstate.cursorPos,
        NORMAL_MODE,
        curstate.isCntrlKeyDown,
        curstate.clipboard
      )
  }

  return curstate
}

export default HandleVisual

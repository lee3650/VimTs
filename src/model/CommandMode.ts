import VimOutput from './VimOutput'
import { NORMAL_MODE } from './Vim'
import Point from './Point'

const HandleCommand = (
  curstate: VimOutput,
  command: string,
  commandCursorPos: Point,
  commandText: string
): [VimOutput, Point, string] => {
  switch (command) {
    case 'Escape':
      curstate.mode = NORMAL_MODE
      return [curstate, commandCursorPos, commandText]
    default:
      commandCursorPos.col = commandCursorPos.col + 1
      commandText = commandText.concat(command)
      return [curstate, commandCursorPos, commandText]
  }
}

export default HandleCommand

import VimOutput from './VimOutput'
import Point from './Point'
import HandleVisual from './VisualMode'
import HandleCommand from './CommandMode'
import { HandleMove } from './Utility'
import HandleInsert from './InsertMode'
import HandleNormal from './NormalMode'
import NormalExecBuffer from './NormalExecBuffer'
import PreviousStates from './PreviousStates'

export const NORMAL_MODE = 'normal'
export const INSERT_MODE = 'insert'
export const VISUAL_MODE = 'visual'
export const COMMAND_MODE = 'command'

var maxClipboardSize = 30;

export default class Vim {
  text: string[]
  commandText: string
  cursorPos: Point
  commandCursorPos: Point
  mode: string
  isCntrlKeyDown: boolean
  visualStart: Point
  normalExecBuf: NormalExecBuffer
  clipboard: string[] // For copy/paste, is this needed in VimOutput?
  previousVimStates : PreviousStates

  constructor(startText: string) {
    this.text = startText.split('\n')
    this.commandText = ''
    this.cursorPos = new Point(0, 0)
    this.commandCursorPos = new Point(0, 0)
    this.mode = NORMAL_MODE
    this.isCntrlKeyDown = false
    this.visualStart = new Point(0, 0)
    this.normalExecBuf = new NormalExecBuffer()
    this.clipboard = ['']
    this.previousVimStates = new PreviousStates(this.text.slice(0), new Point(0, 0), 30)
  }

  handle_control(commands: string): string {
    if (commands.includes("$CONTROL-UP$"))
    {
      this.isCntrlKeyDown = false
      return commands.slice(0, -1 * '$CONTROL-UP$'.length)
    }

    this.isCntrlKeyDown = true 
    return commands.slice(0, -1 * '$CONTROL$'.length)
  }

  execute(commands: string): VimOutput {
    const vimOut = new VimOutput(
      this.text,
      this.cursorPos,
      this.mode,
      this.isCntrlKeyDown,
      this.clipboard,
      this.visualStart
    ) // Going to try to modify the VimOuput objects in place as much as possible from now on
    if (commands.includes('$CONTROL$') || commands.includes("$CONTROL-UP$")) {
      commands = this.handle_control(commands)
    }
    if (commands.includes('Arrow')) {
      this.cursorPos = HandleMove(this.text, this.cursorPos, commands)
      return new VimOutput(
        this.text,
        this.cursorPos,
        this.mode,
        this.isCntrlKeyDown,
        this.clipboard,
        this.visualStart
      )
    }
    if (this.mode == INSERT_MODE) {
      const outpt = HandleInsert(vimOut, commands)
      this.cursorPos = outpt.cursorPos
      this.text = outpt.text
      this.mode = outpt.mode
      if (this.mode == NORMAL_MODE) {
        this.previousVimStates.addState(this.text, this.cursorPos)
      }
      return outpt
    } else if (this.mode == NORMAL_MODE) {
      const outpt = HandleNormal(vimOut, commands, this.normalExecBuf, this.previousVimStates)
      this.cursorPos = outpt.cursorPos
      this.text = outpt.text
      this.mode = outpt.mode
      this.clipboard = outpt.clipboard
      return outpt
    } else if (this.mode == COMMAND_MODE) {
      let outpt = null
      outpt = HandleCommand(vimOut, commands)
      this.mode = outpt.mode
      return new VimOutput(
        this.text,
        this.cursorPos,
        this.mode,
        this.isCntrlKeyDown,
        this.clipboard,
        new Point(0, 0),
        this.commandCursorPos,
        this.commandText
      )
    } else if (this.mode == VISUAL_MODE) {
      const outpt = HandleVisual(vimOut, commands)

      this.cursorPos = outpt.cursorPos
      this.visualStart = outpt.visualStart
      this.mode = outpt.mode
      return new VimOutput(
        this.text,
        this.cursorPos,
        this.mode,
        this.isCntrlKeyDown,
        this.clipboard,
        this.visualStart
      )
    }
    return vimOut
  }
}

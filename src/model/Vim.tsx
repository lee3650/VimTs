import VimOutput from './VimOutput'
import Point from './Point'
import HandleVisual from './VisualMode'
import HandleCommand from './CommandMode'
import { HandleMove } from './Utility'
import HandleInsert from './InsertMode'
import HandleNormal from './NormalMode'
import NormalExecBuffer from './NormalExecBuffer'

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
  stringPos: number
  isCntrlKeyDown: boolean
  visualStart: Point
  previousText: string[][] // Undo/Redo
  normalExecBuf: NormalExecBuffer
  clipboard: string[] // For copy/paste, is this needed in VimOutput?

  constructor(startText: string) {
    this.text = startText.split('\n')
    this.commandText = ''
    this.cursorPos = new Point(0, 0)
    this.commandCursorPos = new Point(0, 0)
    this.mode = NORMAL_MODE
    this.stringPos = 0
    this.isCntrlKeyDown = false
    this.visualStart = new Point(0, 0)
    this.previousText = [this.text]
    this.normalExecBuf = new NormalExecBuffer()
    this.clipboard = ['']
  }

  handle_control(commands: string): string {
    this.isCntrlKeyDown = !this.isCntrlKeyDown
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
    if (commands.includes('$CONTROL$')) {
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
      return outpt
    } else if (this.mode == NORMAL_MODE) {
      const outpt = HandleNormal(vimOut, commands, this.normalExecBuf)
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

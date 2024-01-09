import VimOutput from './VimOutput'
import { VISUAL_MODE, INSERT_MODE, COMMAND_MODE } from './Vim'
import { HandleMove, insertText } from './Utility'
import NormalExecBuffer from './NormalExecBuffer'
import PreviousStates from './PreviousStates'
import Point from './Point'

/**
 * Returns true if a command was sucessfully executed, true will indicate that the current execution buffer
 * may be reset. If it returns false that means we may need more characters to complete a command. "Useless"
 * keys/commands return true.
 * @param {VimOutput} curstate
 * @param {string} command
 * @param {number} iter
 * @param {PreviousStates} prevVimStates
 * @returns {boolean}
 */
const execNormal = (
  curstate: VimOutput,
  command: string,
  iter: number,
  prevVimStates: PreviousStates
): boolean => {
  // curstat
  //
  // TODO: Move each command to a separate file maybe??

  if (curstate.isCntrlKeyDown) {
    switch (command) {
      case 'r':
        console.log("Hello");
        let res = prevVimStates.redo()
        if (res[0] == -1) {
          console.log("Fatal Error")
        }
        if (res[0] == 0) {
          // Display text "Already at oldest change"
        }
        let newText = res[1];
        let newPos = res[2];
        curstate.text = newText;
        curstate.cursorPos = newPos;
        return true
    }
  }
  else {
    switch (command) {
      case 'i': // Switch to insert mode
        curstate.mode = INSERT_MODE
        return true
      case ':':
        curstate.mode = COMMAND_MODE
        return true
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
        return true
      case 'v':
        curstate.mode = VISUAL_MODE
        curstate.visualStart = curstate.cursorPos
        return true
      case 'yy':
        if (iter == 0) {
          curstate.clipboard = ['\n'] // This lets the paste function know to insert new text into a new line. (Won't make an empty line)
        }
        if (curstate.cursorPos.row + iter < curstate.text.length) {
          curstate.clipboard.push(curstate.text[curstate.cursorPos.row + iter])
        }
        return true
      case 'p':
        if (curstate.clipboard[0].localeCompare('\n') == 0) {
          const tempClip = [...curstate.clipboard]
          tempClip.shift()
          insertText(curstate.text, curstate.cursorPos, tempClip, true)
          prevVimStates.addState(curstate.text, curstate.cursorPos)
        }
        return true
      case 'u':
        console.log("Hello?");
        let res = prevVimStates.undo()
        if (res[0] == -1) {
          console.log("Fatal Error");
        }
        if (res[0] == 0) {
          // Display text "Already at oldest change"
        }
        let newText = res[1];
        let newPos = res[2];
        console.log(res[0], curstate.text, newText);
        curstate.text = newText;
        curstate.cursorPos = newPos;
        return true
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
        return true
    }
  }
  return false
}

const HandleNormal = (
  curstate: VimOutput,
  command: string,
  neb: NormalExecBuffer,
  prevVimState: PreviousStates
): VimOutput => {
  neb.append(command)
  const repititions = neb.getIterations()
  let i = 0
  while (i < repititions && execNormal(curstate, neb.getCommand(), i, prevVimState)) {
    i++
  }
  if (i == repititions) {
    neb.erase()
  } // execNormal completed succesfully
  return curstate
}

export default HandleNormal

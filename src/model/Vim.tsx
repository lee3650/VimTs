import VimOutput from "./VimOutput"; 
import Point from "./Point";

export const NORMAL_MODE = 'normal'; 
export const INSERT_MODE = 'insert'; 

export default class Vim {
    text : string[]; 
    cursorPos : Point; 
    mode : string; 
    stringPos : number;
    isCntrlKeyDown : boolean;

    constructor(startText : string)
    {
        this.text = startText.split('\n');
        this.cursorPos = new Point(0, 0);
        this.mode = NORMAL_MODE;
        this.stringPos = 0;
        this.isCntrlKeyDown = false;
    }

    calculateStringCursorPos() {
        let count = 0;
        for (let i = 0; i < this.cursorPos.row; i++) {
            count += this.text[i].length;
        }
        return count + this.cursorPos.col
    }

    exec_arrow_movement(commands : string) {
        switch (commands) {
            case 'ArrowDown': // move cursor down
                if (this.cursorPos.row < this.text.length - 1) { // check if bottom of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row + 1].length) {// check if current cursor column position is past the length of the row under current
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.text[this.cursorPos.row + 1].length);
                    }
                    else {
                        //console.log('Please?')
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.cursorPos.col);
                    }
                }
                break;
            case 'ArrowUp':
                if (this.cursorPos.row != 0) {// check if top of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row - 1].length) {// check if cursor col is past length of row above
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.text[this.cursorPos.row - 1].length);
                    }
                    else {
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.cursorPos.col);
                    }
                }
                break;
            case 'ArrowRight':
                //console.log('Pressed l');
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Make sure it isnt larger than the string itself
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
                }
                break
            case 'ArrowLeft':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                }
                break;
        }
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
    }

    exec_insert_mode(commands : string) : VimOutput {
        console.log(commands);
        switch (commands) {
            case 'Escape':
                this.mode = NORMAL_MODE
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown)
            case 'Backspace':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    let newText = this.text
                    newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col - 1) + this.text[this.cursorPos.row].slice(this.cursorPos.col);
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else if (this.cursorPos.row > 0) {
                    let newText = this.text
                    let rowLen = 0;
                    rowLen = newText[this.cursorPos.row].length
                    newText[this.cursorPos.row-1] = newText[this.cursorPos.row-1].concat(newText[this.cursorPos.row])
                    let temp = '';
                    for (let i = this.cursorPos.row; i < newText.length - 1; i++) {
                        temp = newText[i+1];
                        newText[i] = temp;
                    }
                    //+ this.text[this.cursorPos.row].slice(this.cursorPos.col)
                    this.cursorPos = new Point(this.cursorPos.row - 1, newText[this.cursorPos.row - 1].length - rowLen); 
                    newText.splice(-1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'Delete':
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Stay on the screen
                    let newText = this.text
                    newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + this.text[this.cursorPos.row].slice(this.cursorPos.col + 1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'Enter':
                let newText = this.text
                let temp = this.text[this.cursorPos.row].slice(this.cursorPos.col)
                newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col);
                let replace = '';
                newText.push('')
                for (let i = this.cursorPos.row + 1; i < newText.length; i++) {
                    replace = newText[i];
                    newText[i] = temp;
                    temp = replace;
                }
                //+ this.text[this.cursorPos.row].slice(this.cursorPos.col)
                this.cursorPos = new Point(this.cursorPos.row + 1, 0);
                this.text = newText;
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
            case 'Shift':
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);

        }
        let newText = this.text
        newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + commands + this.text[this.cursorPos.row].slice(this.cursorPos.col)
        this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
        return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown) 
    }

    exec_normal_mode(commands : string) : VimOutput {
        switch (commands) {
            case 'i': // Switch to insert mode
                this.mode = INSERT_MODE;
                return new VimOutput(this.text, this.cursorPos, INSERT_MODE, this.isCntrlKeyDown);
            case 'j': // move cursor down
                if (this.cursorPos.row < this.text.length - 1) { // check if bottom of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row + 1].length) {// check if current cursor column position is past the length of the row under current
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.text[this.cursorPos.row + 1].length);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost error???
                    }
                    else {
                        //console.log('Please?')
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.cursorPos.col);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                    }
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'k':
                if (this.cursorPos.row != 0) {// check if top of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row - 1].length) {// check if cursor col is past length of row above
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.text[this.cursorPos.row - 1].length);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost error???
                    }
                    else {
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.cursorPos.col);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                    }
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'l':
                //console.log('Pressed l');
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Make sure it isnt larger than the string itself
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost 
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'h':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost 
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case '0':
                this.cursorPos = new Point(this.cursorPos.row, 0);
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
            case '$':
                this.cursorPos = new Point(this.cursorPos.row, this.text[this.cursorPos.row].length);
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
        }
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
    }

    parse_command(commands : string) : string {
        return commands
    }

    execute(commands : string) : VimOutput {
        if (commands.includes('Arrow')) {
            return this.exec_arrow_movement(commands)

        }
        if (this.mode == INSERT_MODE) {
            return this.exec_insert_mode(commands);
        }
        else if (this.mode == NORMAL_MODE) {
            return this.exec_normal_mode(commands);
        }
        // Do I need to make a new point each time?
        
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown); 
    }
}




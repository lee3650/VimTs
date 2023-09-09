import VimOutput from "./VimOutput"; 
import Point from "./Point";

const NORMAL_MODE = 'normal'; 
const INSERT_MODE = 'insert'; 

export default class Vim {
    text : string[]; 
    cursorPos : Point; 
    mode : string; 
    stringPos : number;

    constructor(startText : string)
    {
        this.text = startText.split('\n');
        this.cursorPos = new Point(0, 0);
        this.mode = NORMAL_MODE;
        this.stringPos = 0;
    }

    calculateStringCursorPos() {
        let count = 0;
        for (let i = 0; i < this.cursorPos.row; i++) {
            count += this.text[i].length;
        }
        return count + this.cursorPos.col
    }

    execute(commands : string) : VimOutput {
        if (this.mode == INSERT_MODE)        
        {
            let newText = this.text
            newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + commands + this.text[this.cursorPos.row].slice(this.cursorPos.col)
            return new VimOutput(newText, new Point(this.cursorPos.row, this.cursorPos.col), this.mode) 
        }

        // Do I need to make a new point each time?
        switch (commands) {
            case 'i': // Switch to insert mode
                return new VimOutput(this.text, this.cursorPos, INSERT_MODE)
            case 'j': // move cursor down
                if (this.cursorPos.row < this.text.length - 1) { // check if bottom of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row + 1].length) {// check if current cursor column position is past the length of the row under current
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.text[this.cursorPos.row - 1].length)
                        return new VimOutput(this.text, this.cursorPos, INSERT_MODE) // Fencepost error???
                    }
                    else {
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.cursorPos.col)
                        return new VimOutput(this.text, this.cursorPos, INSERT_MODE)
                    }
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE)
                }
            case 'k':
                if (this.cursorPos.row != 0) {// check if top of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row - 1].length) {// check if cursor col is past length of row above
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.text[this.cursorPos.row + 1].length)
                        return new VimOutput(this.text, this.cursorPos, INSERT_MODE) // Fencepost error???
                    }
                    else {
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.cursorPos.col)
                        return new VimOutput(this.text, this.cursorPos, INSERT_MODE)
                    }
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE)
                }
            case 'l':
                console.log('Pressed l');
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Make sure it isnt larger than the string itself
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1)
                    console.log('Be here');
                    return new VimOutput(this.text, this.cursorPos, INSERT_MODE) // Fencepost 
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, INSERT_MODE)
                }
            case 'h':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1)
                    return new VimOutput(this.text, this.cursorPos, INSERT_MODE) // Fencepost 
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, INSERT_MODE)
                }
        }
        return new VimOutput(this.text, this.cursorPos, this.mode); 
    }
}



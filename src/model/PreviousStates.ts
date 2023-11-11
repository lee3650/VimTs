import Point from "./Point"

export default class PreviousStates {
    previousText: string[][] // Undo/Redo
    previousCursorPos : Point[]
    maxBufferLen : number
    redoText : string[][];
    redoCursorPos : Point[];



    constructor(text : string[], cursor : Point, maxBufferLen : number) {
        this.previousText = [text.slice(0)]; 
        this.previousCursorPos = [new Point(cursor.row, cursor.col)];
        this.maxBufferLen = maxBufferLen
        this.redoText = [];
        this.redoCursorPos = [];
    }

    /**
    * Appends the current command and cursor position to the "previous" stacks. Resets the redo stacks. Can do pass by reference or value,
    * Function creates shallow copy regardless.
    * @param {string[]} text
    * @param {Point} curPos
    * @returns {void}
    */
    public addState(text : string[], curPos : Point) : void {
        if (this.previousText.length > this.maxBufferLen) {
            this.previousText.shift() // Removes the first element of the array
            this.previousCursorPos.shift()
        }
        this.previousText.push(text.slice(0))
        this.previousCursorPos.push(new Point(curPos.row, curPos.col))
        this.redoText = [];
        this.redoCursorPos = [];
    }

    /**
    * Returns the top of the stack of the previous arrays. Appends it to the redo stack.
    * Returns tuple, (success code, text, cursor pos).
    * If succ code is 0 then already at oldest change. 
    * If 1 then normal behavior. 
    * -1 is a critical error
    * @returns {[number, string[], Point]}
    */
    public undo() : [number, string[], Point] {
        let len = this.previousText.length;
        console.assert(len > 0) // Invariant: previousText has to be at least one (current text thats on the screen) Proof : Left as an exercise to the reader
        if (len == 1) { 
            return [0, this.previousText[0], this.previousCursorPos[0]]
        }
        let tempText = this.previousText.pop()
        let tempPos = this.previousCursorPos.pop()
        if (tempText == undefined || tempPos == undefined) {
            return [-1, [""], new Point(0,0)]
        }
        this.redoText.push(tempText)
        this.redoCursorPos.push(tempPos)
        return [1, this.previousText[len - 2].slice(0), new Point(this.previousCursorPos[len - 2].row, this.previousCursorPos[len - 2].col)];
    }

    /**
    * Returns the top of the stack of the redo array. Appends it to the undo stack. 
    * Returns tuple, (success code, text, cursor pos).
    * If succ code is 0 then already at most recent change. 
    * If 1 then normal redo behavior. 
    * -1 is a critical error
    * @returns {[number, string[], Point]}
    */
    public redo() : [number, string[], Point] {
        let len = this.previousText.length;
        if (this.redoText.length == 0) {
            return [0, this.previousText[len - 1].slice(0), new Point(this.previousCursorPos[len-1].row, this.previousCursorPos[len-1].col)]
        }
        let tempText = this.redoText.pop()
        let tempPos = this.redoCursorPos.pop()
        if (tempText == undefined || tempPos == undefined) {
            return [-1, [""], new Point(0,0)]
        }
        this.previousText.push(tempText)
        this.previousCursorPos.push(tempPos)
        return [1, tempText.slice(0), new Point(tempPos.row, tempPos.col)];
    }
}
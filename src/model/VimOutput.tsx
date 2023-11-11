import Point from "./Point";

export default class VimOutput {
    text : string[];
    commandText : string;
    cursorPos : Point; 
    commandCursorPos : Point;
    mode : string; 
    isCntrlKeyDown : boolean;
    visualStart : Point;
    clipboard : string[];
    numUndos : number;
    
    constructor(text : string[], cursorPos : Point, mode : string,  isCntrlKeyDown : boolean, clipboard : string[], visualStart : Point = new Point(0,0), 
        commandCursorPos : Point = new Point(0, 0), commandText : string = "", numUndos : number = 0) {
        this.text = text; 
        this.cursorPos = cursorPos; 
        this.mode = mode;
        this.isCntrlKeyDown = isCntrlKeyDown;
        this.visualStart = visualStart; 
        this.commandCursorPos = commandCursorPos;
        this.commandText = commandText;
        this.clipboard = clipboard;
        this.numUndos = numUndos;
    }
}

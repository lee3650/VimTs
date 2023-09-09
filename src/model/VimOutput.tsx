import Point from "./Point";

export default class VimOutput {
    text : string[];
    cursorPos : Point; 
    mode : string; 
    stringPos : number;

    constructor(text : string[], cursorPos : Point, mode : string, stringPos : number) {
        this.text = text; 
        this.cursorPos = cursorPos; 
        this.mode = mode;
        this.stringPos = stringPos;
    }
}

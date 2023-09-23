import Point from "./Point";

export default class VimOutput {
    text : string[];
    cursorPos : Point; 
    mode : string; 
    isCntrlKeyDown : boolean;

    constructor(text : string[], cursorPos : Point, mode : string,  isCntrlKeyDown : boolean) {
        this.text = text; 
        this.cursorPos = cursorPos; 
        this.mode = mode;
        this.isCntrlKeyDown = isCntrlKeyDown;
    }
}

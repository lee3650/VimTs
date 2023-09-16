import Point from "./Point";

export default class VimOutput {
    text : string[];
    cursorPos : Point; 
    mode : string; 
    visualStart : Point; 
    visualEnd : Point; 

    constructor(text : string[], cursorPos : Point, mode : string, visualStart : Point = new Point(0,0), visualEnd : Point = new Point(0,0)) {
        this.text = text; 
        this.cursorPos = cursorPos; 
        this.mode = mode;
        this.visualEnd = visualEnd;
        this.visualStart = visualStart; 
    }    
}

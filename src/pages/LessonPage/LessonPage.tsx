import VimApp from "../../VimApp"
import LessonBody from "./LessonBody/LessonBody"
import './LessonBody.css'

const lessonTitle = 'Lesson 1: Files'
const lessonBody = 'This is an example lesson that would teach you something about vim.'
const lessonVimContents = ['Try pressing hjkl', 'to move the cursor']

const LessonPage = () => {
    return (
    <div className="lessonContainer">
        <div className="lessonBody">
            <LessonBody lessonBody={lessonBody} lessonTitle={lessonTitle}/>
        </div>
        <div className="lessonVimApp">
            <VimApp startingStr={lessonVimContents}/>
        </div>
    </div>)
}

export default LessonPage

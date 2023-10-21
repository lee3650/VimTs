import VimApp from "../VimApp"
import LessonPage from "./LessonPage/LessonPage"

const startStr = ['Hello Vim!', 'Try moving the cursor.']

const PlayGround = () => {
    return <>
        <VimApp startingStr={startStr}/>
    </>
}

export default PlayGround

import VimApp from "../VimApp"
import LessonPage from "../LessonPage/LessonPage"

const startStr = ['Hello Vim!', 'Try moving the cursor.']

const Homepage = () => {
    return <>
        {/*<VimApp startingStr={startStr}/>*/}
        <LessonPage />
    </>
}

export default Homepage

import VimApp from "../VimApp"

const startStr = ['Hello Vim!', 'Try moving the cursor.']

const Homepage = () => {
    return <>
        <VimApp startingStr={startStr}/>
    </>
}

export default Homepage




import VimApp from '../VimApp'

const startStr = ['Hello Vim!', 'Try moving the cursor.']

const PlayGround = () => {
  return (
    <>
      <VimApp startingStr={startStr} />
    </>
  )
}

export default PlayGround

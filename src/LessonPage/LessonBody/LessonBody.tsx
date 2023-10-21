interface LessonBodyProps {
    lessonTitle : string
    lessonBody : string; 
}

const LessonBody : React.FC<LessonBodyProps> = ({lessonTitle, lessonBody}) => {
    return (<div>
        <h1>
            {lessonTitle}
        </h1>
        <p>
            {lessonBody}
        </p>
    </div>)
}

export default LessonBody

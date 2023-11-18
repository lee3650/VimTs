import './Toolbar.css'

interface ToolbarProps {
  lessonNum: number
  lessonName: string
}

export const Toolbar: React.FC<ToolbarProps> = ({ lessonNum, lessonName }) => {
  return (
    <div className="toolbarParent">
      <img src="./vim-logo.png" className="toolbarLogo" />
      <span>
        Lesson {lessonNum}: {lessonName}
      </span>
    </div>
  )
}

export default Toolbar

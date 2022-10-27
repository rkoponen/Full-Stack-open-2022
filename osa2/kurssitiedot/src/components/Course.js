const Course = ({course}) => {
    return (
      <>
        <Header name={course.name}/>
        <Content course={course}/>
        <Total parts={course.parts}/>
      </>
    )
  }

const Content = ({course}) => {
  return (
    <>
      {course.parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
    </>
  )
} 

const Part = ({name, exercises}) => {
  return <>
    <p>{name} {exercises}</p>
  </>
}

const Total = ({parts}) => {
    const initVal = 0
    const total = parts.reduce(
      (prevVal, curVal) => prevVal + curVal.exercises, initVal
    )
    return <>
      <h3>Number of exercises {total}</h3>
    </>
}

const Header = ({name}) => {
    return <>
      <h1>{name}</h1>
    </>
}

export default Course
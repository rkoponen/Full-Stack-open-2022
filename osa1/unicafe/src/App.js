import { useState } from 'react'


const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value, percent}) => {
  return (
    <tr>
      <td>{text} </td>
      <td>{value} </td>
      <td>{percent}</td>
    </tr>
  )
  
  
}
const Statistics = ({good, neutral, bad}) => {
  const sum = good + neutral + bad
  const avg = (good + neutral * 0 + bad * (-1)) / sum
  if (sum != 0) {
    return (
      <>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticLine text='good ' value={good}/>
            <StatisticLine text='neutral ' value={neutral}/>
            <StatisticLine text='bad ' value={bad}/>
            <StatisticLine text ='all ' value={sum}/>
            <StatisticLine text='average ' value={avg}/>
            <StatisticLine text='positive ' value={good / sum * 100} percent='%'/>
          </tbody>
        </table>
      </>
    )
  } else {
    return <h2>No feedback given</h2>
  }
  
  }

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)

  const handleBad = () => setBad(bad + 1)

  const handleNeutral = () => setNeutral(neutral + 1)


  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text='good'/>
      <Button handleClick={handleNeutral} text='neutral'/>
      <Button handleClick={handleBad} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
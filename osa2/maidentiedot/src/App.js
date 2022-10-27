import axios from 'axios'
import { useEffect, useState } from 'react';
import Results from './components/Results';


  const App = () => {
  const[countries, setCountries] = useState([])
  const[newSearch, setSearch] = useState('')
  const[newShow, setShow] = useState()
  const[showClicked, setClicked] = useState(false)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFind = (event) => {
    setClicked(false)
    setSearch(event.target.value)
  }

  const handleClick = country => {
    setClicked(true)
    setShow(country)
  }

  return (
    <div>
      <div>
        find countries <input value={newSearch} onChange={handleFind}/>
      </div>
      <Results countries={countries} filter={newSearch} showClicked={showClicked} newShow={newShow} handleClick={handleClick}/>
    </div>
  );
}

export default App;

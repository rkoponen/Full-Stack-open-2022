import DisplayCountries from "./DisplayCountries"
import DisplayCountry from "./DisplayCountry"

const Results = ({countries, filter, showClicked, newShow, handleClick}) => {
    const foundCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
    if (showClicked) {
      return <DisplayCountry country={newShow}/>
    }
    if (foundCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    } else if (foundCountries.length === 1) {
      return <DisplayCountry country={foundCountries[0]}/>
    } else {
      return <DisplayCountries countries={foundCountries} handleClick={handleClick}/>
    }
}

export default Results
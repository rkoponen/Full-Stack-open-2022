import {useState, useEffect} from 'react'
import axios from 'axios'

const DisplayCountry = ({country}) => {
    const [weather, setWeather] = useState([])
  
    const api_key = process.env.REACT_APP_API_KEY
  
    useEffect(() => {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`)
        .then(response => {
          setWeather(response.data)
        })
      }, [])
    
    if (weather.main) {
      return (
        <div>
          <h1>{country.name}</h1>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>
          <h3>languages: </h3>
          <ul>
              {country.languages.map(language =>
              <li key={language.nativeName}>{language.name}</li>
              )}
          </ul>
          <img src={country.flags.png}></img>
          <h2>Weather in {country.capital}</h2>
          <p>temperature {(weather.main.temp - 273.15).toFixed(2)}º C</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )
    } else {
      return null
    }
}

export default DisplayCountry
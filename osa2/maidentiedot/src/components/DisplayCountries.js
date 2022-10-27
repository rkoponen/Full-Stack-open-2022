const DisplayCountries = ({countries, handleClick}) => {
    return (
      <div>
        {countries.map(country => 
          <div key={country.name}>{country.name}
            <button onClick={() => handleClick(country)}>show</button>
          </div>)}
      </div>
    )
}

export default DisplayCountries

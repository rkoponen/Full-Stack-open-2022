const Persons = ({persons, searchFilter, handleClick}) => {
    const results = persons.filter(person => person.name.toLowerCase().includes(searchFilter.toLowerCase()))
    return (
      <div>
        {results.map(person =>
          <div key={person.name}>{person.name} {person.number}
            <button onClick={() => handleClick(person.id)}>delete</button>
          </div>
          )}
      </div>
    )
}

export default Persons
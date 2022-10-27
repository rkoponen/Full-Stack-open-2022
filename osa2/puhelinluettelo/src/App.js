import { useEffect, useState } from 'react'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNum] = useState('')
  const [newFilter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [msgID, setID] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])
  
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNum = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleClick = id => {
    const selectedPerson = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${selectedPerson.name}?`)) {
      personService
        .deletePerson(id)
        .then( 
          setPersons(persons.filter(person => person.id !== id)),
          setMessage(`Deleted ${selectedPerson.name}`),
          setID("delete"),
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        )
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name.toLowerCase()).includes(newName.toLowerCase())) {
      const selectedPerson = persons.filter(p => p.name.toLowerCase() === newName.toLowerCase())[0]
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...selectedPerson, number: newNumber }
        personService
          .update(changedPerson.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : response))
            setMessage(`Phone number of ${changedPerson.name} changed successfully`)
            setID("update")
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setID("error")
            setMessage(`Information of ${selectedPerson.name} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== selectedPerson.id))
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      } 
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewNum('')
          setNewName('')
          setMessage(`Added ${returnedPerson.name}`)
          setID("add")
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} id={msgID}/>
      <Filter filter={newFilter} handleFilter={handleFilter}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNum={handleNewNum} addPerson={addPerson}/>
      <h2>Numbers</h2>
      <Persons persons={persons} searchFilter={newFilter} handleClick={handleClick}/>
      
    </div>
  )

}

export default App
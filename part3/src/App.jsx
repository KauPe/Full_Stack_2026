import React, { useState, useEffect } from 'react'

// Tuodaan erillinen Persons-komponentti, joka vastaa yksittäisen henkilön renderöinnistä listalla.
import Persons from './components/Persons'

// Tuodaan erillinen moduuli, joka hoitaa kaiken kommunikaation taustapalvelimen (json-server) kanssa.
import personService from './services/persons'

/**
 * ============================================================================
 * ESITYSTASON KOMPONENTIT
 * ============================================================================
 */

/**
 * Notification-komponentti
 * Näyttää viestin ruudulla. Jos viesti on null, komponentti ei renderöi mitään.
 */
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  // Tyylit ilmoitukselle (nämä voi siirtää myös erilliseen CSS-tiedostoon)
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

 const AllPersons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.map(person => 
        <Persons 
          key={person.id} 
          person={person.name} 
          phone={person.phone} 
          deletePerson={() => deletePerson(person.id)} 
        />
      )}
    </div>
  )
}

const AddPerson = ({ addPerson, newName, handlePersonChange, newPhonenumber, handlePhonenumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newPhonenumber} onChange={handlePhonenumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

/**
 * ============================================================================
 * SOVELLUKSEN PÄÄKOMPONENTTI (APP)
 * ============================================================================
 */
const App = () => {
  // ---------------------------------------------------------------------------
  // TILAT (STATE) 
  // ---------------------------------------------------------------------------
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newPhonenumber, setNewPhonenumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  
  // Uusi tila ilmoituksia varten
  const [ notification, setNotification ] = useState(null)

  // ---------------------------------------------------------------------------
  // EFFECT HOOK
  // ---------------------------------------------------------------------------
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // ---------------------------------------------------------------------------
  // APUFUNKTIO ILMOITUKSIEN NÄYTTÄMISEEN
  // ---------------------------------------------------------------------------
  const notify = (message) => {
    setNotification(message)
    // Piilotetaan ilmoitus 3 sekunnin (3000 millisekunnin) kuluttua
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // ---------------------------------------------------------------------------
  // TAPAHTUMANKÄSITTELIJÄT (EVENT HANDLERS)
  // ---------------------------------------------------------------------------
   const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        
        const changedPerson = { ...existingPerson, phone: newPhonenumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewPhonenumber('')
            
            // Näytetään onnistumisviesti numeron päivityksestä
            notify(`Updated ${returnedPerson.name}'s number`)
          })
          .catch(error => {
            alert(`Information of ${existingPerson.name} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return 
    }

    const personObject = {
      name: newName,
      phone: newPhonenumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhonenumber('')
        
        // Näytetään onnistumisviesti lisäämisestä
        notify(`Added ${returnedPerson.name}`)
      })
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .del(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          
          // Näytetään onnistumisviesti poistamisesta
          notify(`Deleted ${personToDelete.name}`)
        })
        .catch(error => {
          alert(`Information of ${personToDelete.name} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhonenumberChange = (event) => {
    setNewPhonenumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === '' 
    ? persons 
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  // ---------------------------------------------------------------------------
  // KÄYTTÖLIITTYMÄN RENDERÖINTI (JSX)
  // ---------------------------------------------------------------------------
  return (
    <div>
      <h2>Phonebook</h2>
      
      {/* Renderöidään ilmoituskomponentti heti otsikon alle */}
      <Notification message={notification} />
      
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      
      <h2>add a new</h2>
      
      <AddPerson 
        addPerson={addPerson} 
        newName={newName} 
        handlePersonChange={handlePersonChange} 
        newPhonenumber={newPhonenumber} 
        handlePhonenumberChange={handlePhonenumberChange} 
      />
      
      <h2>Numbers</h2>
      
      <AllPersons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
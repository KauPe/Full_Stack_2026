import React from 'react'

// Otetaan propseina vastaan nimi, puhelinnumero ja poistofunktio
const Persons = ({ person, phone, deletePerson }) => {
  return (
    <li>
      {person} {phone}
      {/* Kutsutaan deletePerson-funktiota, kun nappia painetaan */}
      <button onClick={deletePerson}>delete</button>
    </li>
  )
}

export default Persons
import axios from 'axios'

/**
 * ============================================================================
 * PALVELUMODUULI (SERVICES)
 * Tämä tiedosto vastaa kaikesta kommunikaatiosta taustapalvelimen (backend) kanssa.
 * Eriyttämällä axios-kutsut tänne, App.jsx:n koodi pysyy paljon siistimpänä.
 * ============================================================================
 */

// Määritetään taustapalvelimen (json-server) perusosoite puhelinluettelon tiedoille.
const baseUrl = 'http://localhost:3001/api/persons'

/**
 * Hakee kaikki tallennetut yhteystiedot palvelimelta.
 * 
 * @returns {Promise} Palauttaa Promisen, joka sisältää palvelimella olevan taulukon henkilöistä.
 */
const getAll = () => {
  // Tehdään HTTP GET -pyyntö perusosoitteeseen
  const request = axios.get(baseUrl)
  
  // Axios palauttaa oletuksena ison olion (jossa on mm. statuskoodit ja headerit).
  // Meitä kiinnostaa vain varsinainen data (response.data). Palauttamalla pelkän datan,
  // App.jsx:ssä riittää kirjoittaa: personService.getAll().then(data => ...)
  return request.then(response => response.data)
}

/**
 * Tallentaa uuden henkilön tietokantaan.
 * 
 * @param {Object} newObject - Lisättävä henkilö-olio (esim. { name: 'Matti', phone: '040-123' })
 * @returns {Promise} Palauttaa Promisen, joka sisältää palvelimen tallentaman olion (jossa on nyt mukana palvelimen luoma id).
 */
const create = newObject => {
  // Tehdään HTTP POST -pyyntö. Toisena parametrina annetaan data, joka halutaan tallentaa.
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

/**
 * Päivittää olemassa olevan henkilön tiedot (esimerkiksi jos puhelinnumero muuttuu).
 * (Käytät tätä todennäköisesti kurssin seuraavassa tehtävässä!)
 * 
 * @param {String|Number} id - Päivitettävän henkilön yksilöllinen tunniste (id)
 * @param {Object} newObject - Henkilö-olio uusine tietoineen
 * @returns {Promise} Palauttaa Promisen, joka sisältää päivitetyn henkilön tiedot.
 */
const update = (id, newObject) => {
  // Tehdään HTTP PUT -pyyntö tietyn henkilön osoitteeseen (esim. http://localhost:3001/persons/2)
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

/**
 * Poistaa yhteystiedon palvelimelta.
 * Huom: Nimenä on 'del', koska 'delete' on varattu sana JavaScriptissä, eikä sitä voi käyttää muuttujan tai funktion nimenä.
 * 
 * @param {String|Number} id - Poistettavan henkilön yksilöllinen tunniste (id)
 * @returns {Promise} Palauttaa Promisen onnistuneesta poistosta.
 */
const del = (id) => {
  // Tehdään HTTP DELETE -pyyntö tietyn henkilön osoitteeseen.
  // Poisto ei tarvitse mukaansa data-oliota, pelkkä id riittää kertomaan mitä poistetaan.
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

// Viedään (export) funktiot oletuksena (default) yhtenä objektina.
// Tämän ansiosta toisessa tiedostossa voidaan kirjoittaa: import personService from './services/persons'
// ja kutsua metodeja muodossa: personService.create(...)
export default { getAll, create, update, del }
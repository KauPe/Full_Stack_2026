import express from 'express'
const app = express()
import morgan from 'morgan'
import cors from 'cors'

app.use(cors())

app.use(express.json())
// app.use(morgan('dev'))

morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "kalle", 
    "phone": "234029",
    "id": "1"
  },
  {
    "name": "saatana",
    "phone": "24802398423098",
    "id": "2"
  },
  {
    "name": "matti", 
    "phone": "9082209389",
    "id": "3"
  },
  {
    "name": "jorma",
    "phone": "09q3830982",
    "id": "4"
  }
]

const phoneBookInfo = () => {
  return persons.length
}
  
app.get('/info', (request, response) => {
  const now = new Date()
  response.send(`
    <div>
      <h1>Phonebook has info for ${phoneBookInfo()} people</h1>
      <p>${now}</p>
    </div>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const generateId = () => {
  let newId;
  do {
    newId = String(getRandomInt(1000000));
  } while (persons.some(p => p.id === newId));

  return newId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Tarkistetaan, että sekä nimi että numero löytyvät
  if (!body.name || !body.phone) {
    return response.status(400).json({ 
      error: 'name or phone missing' 
    })
  }

  // Tarkistetaan nimen uniikkius
  const nameExists = persons.find(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const newPerson = {
    name: body.name,
    phone: body.phone,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
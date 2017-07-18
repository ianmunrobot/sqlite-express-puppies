'use strict'

const express = require('express')
const app = express()
const db = require('sqlite')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const { keyValueSplitter, updateSyntaxParser } = require('./parsers')

const PORT = 3000

// logging middleware
app.use(morgan('tiny'))

// body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// get all puppies
app.get('/', (req, res, next) => {
  // returns all rows matching the query
  db.all('SELECT * FROM Puppy')
  .then(res.send.bind(res))
  .catch(next)
})

// add one puppy
app.post('/', (req, res, next) => {
  const { columns, values } = keyValueSplitter(req.body)
  // runs query, returns a Statement instance
  db.run(`INSERT INTO Puppy (${columns.join(', ')}) VALUES (${values.join(', ')})`)
  .then(puppyStmt => {
    // Use the newly inserted id to return the created Puppy
    return db.get(`SELECT * FROM Puppy WHERE id = ${puppyStmt.stmt.lastID}`)
  })
  .then(puppy => {
    res.status(201).send(puppy)
  })
  .catch(next)
})

// get one puppy
app.get('/:id', (req, res, next) => {
  db.get(`SELECT * FROM Puppy WHERE id = ${req.params.id}`)
  .then(res.send.bind(res))
  .catch(next)
})

// update one puppy
app.put('/:id', (req, res, next) => {
  const updatedValues = updateSyntaxParser(req.body)
  db.run(`UPDATE Puppy SET ${updatedValues} WHERE id = ${req.params.id}`)
  .then(puppyStmt => db.get(`SELECT * FROM Puppy WHERE id = ${req.params.id}`))
  .then(res.send.bind(res))
  .catch(next)
})

// delete one puppy
app.delete('/:id', (req, res, next) => {
  db.run(`DELETE FROM Puppy WHERE id = ${req.params.id}`)
  .then(() => {
    res.status(204).send()
  })
  .catch(next)
})

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send()
})

// open the database and start the server
db.open('./db.sqlite', { Promise })
  .then(() => app.listen(PORT))
  .then(() => console.log(`Server listening on ${PORT}`))
  .catch(console.error.bind(console))
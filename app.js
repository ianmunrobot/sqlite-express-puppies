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
  db.all('select * from Puppy')
  .then(res.send.bind(res))
  .catch(next)
})

// add one puppy
app.post('/', (req, res, next) => {
  const { columns, values } = keyValueSplitter(req.body)
  db.run(`Insert into Puppy (${columns.join(', ')}) values (${values.join(', ')})`)
  .then(puppyStmt => {
    return db.get(`Select * from Puppy where id = ${puppyStmt.stmt.lastID}`)
  })
  .then(puppy => {
    res.status(201).send(puppy)
  })
  .catch(next)
})

// get one puppy
app.get('/:id', (req, res, next) => {
  db.get(`SELECT * from Puppy where id = ${req.params.id}`)
  .then(res.send.bind(res))
  .catch(next)
})

// update one puppy
app.put('/:id', (req, res, next) => {
  const updatedValues = updateSyntaxParser(req.body)
  db.run(`update Puppy set ${updatedValues} where id = ${req.params.id}`)
  .then(puppyStmt => db.get(`Select * from Puppy where id = ${req.params.id}`))
  .then(res.send.bind(res))
  .catch(next)
})

// delete one puppy
app.delete('/:id', (req, res, next) => {
  db.run(`delete from Puppy where id = ${req.params.id}`)
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
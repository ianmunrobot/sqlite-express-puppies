'use strict'

const express = require('express')
const app = express()
const db = require('sqlite')

const PORT = 3000;

app.get('/', (req, res, next) => {
  db.all('select * from Puppy')
  .then(res.send.bind(res))
  .catch(next)
})

app.get('/:id', (req, res, next) => {
  db.all(`SELECT * from Puppy where id = ${req.params.id}`)
  .then(res.send.bind(res))
  .catch(next)
})

db.open('./db.sqlite', { Promise })
  .then(() => app.listen(PORT))
  .then(() => console.log(`Server listening on ${PORT}`))
  .catch(console.error.bind(console))
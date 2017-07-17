'use strict'

const express = require('express')
const app = express()
const db = require('sqlite')
const bodyParser = require('body-parser')

const PORT = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
  db.all('select * from Puppy')
  .then(res.send.bind(res))
  .catch(next)
})

app.post('/', (req, res, next) => {
  const { columns, values } = keyValueSplitter(req.body)
  db.run(`Insert into Puppy (${columns.join(', ')}) values (${values.join(', ')})`)
  .then(puppy => {
    res.send(puppy)
  })
  .catch(next)
})

app.get('/:id', (req, res, next) => {
  db.all(`SELECT * from Puppy where id = ${req.params.id}`)
  .then(res.send.bind(res))
  .catch(next)
})

const keyValueSplitter = obj => {
  const columns = Object.keys(obj)
  const values = Object.keys(obj).map(k => obj[k]).map(value => {
    if (typeof value === 'string') {
      return`"${value}"`
    }
    return value
  })
  return {
    columns,
    values
  }
}

app.put('/:id', (req, res, next) => {
  const updatedValues = Object.keys(req.body).map(key => {
    let value = req.body[key]
    if (typeof value === 'string') {
      value = `"${value}"`
    }
    return `${key} = ${value}`
  })
  db.run(`update Puppy set ${updatedValues.join(',')} where id = ${req.params.id}`)
  .then(res.send.bind(res))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send()
})

db.open('./db.sqlite', { Promise })
  .then(() => app.listen(PORT))
  .then(() => console.log(`Server listening on ${PORT}`))
  .catch(console.error.bind(console))
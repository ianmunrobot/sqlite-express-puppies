'use strict'

const db = require('sqlite')
const chance = require('chance')()

const longArray = num => new Array(num).fill('')

db.open('./db.sqlite', { Promise })
.then(() => {
  const tableQuery = 
  `CREATE TABLE IF NOT EXISTS Puppy (
    id INTEGER PRIMARY KEY, 
    first_name TEXT,
    last_name TEXT,
    ssn TEXT,
    callsign TEXT,
    age INTEGER
  )`
  return db.run(tableQuery)
})
.then(() => {
  const lastNames = ['Doggo', 'Pupster', 'Smith', 'Wolf']
  const puppies = longArray(100).map(() => {
    const first = chance.first()
    const last = lastNames[Math.floor(Math.random() * 4)]
    const ssn = chance.ssn()
    const callsign = chance.radio()
    const age = Math.floor(chance.age() / 7)
    return db.run(`INSERT INTO Puppy (first_name, last_name, ssn, callsign, age) values ("${first}", "${last}", "${ssn}", "${callsign}", ${age})`)
  })
  return Promise.all(puppies)
})
.then(() => {
  return db.all('SELECT * FROM Puppy')
})
.then(console.log.bind(console))
.catch(console.error.bind(console))
/**
 * @param  {Object} request body object in format { columnName: value, ... }
 * @return {Object} Object with Arrays of column names and values (matched by index)
 */
const keyValueSplitter = obj => {
  const columns = Object.keys(obj)
  const values = Object.keys(obj)
    .map(key => {
      const value = obj[key]
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
/**
 * @param  {Object} request body object in format { columnName: value, ... }
 * @return {String} String of key-value pairs for SQL UPDATE table_name SET ... syntax: 'key = value, ...'
 */
const updateSyntaxParser = obj =>
  Object.keys(obj).map(key => {
    let value = obj[key]
    if (typeof value === 'string') {
      value = `"${value}"`
    }
    return `${key} = ${value}`
  })
  .join(', ')

module.exports = {
  keyValueSplitter,
  updateSyntaxParser
}
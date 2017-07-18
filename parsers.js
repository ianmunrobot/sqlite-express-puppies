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
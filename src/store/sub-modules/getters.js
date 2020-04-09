export const getPlainValue = (state) => (dataObject) => {
  var obj = JSON.parse(JSON.stringify(dataObject));
  Object.keys(obj).reduce(function (obj, key) {
    if (obj["_" +  key] === obj[key]) {
      delete obj["_" +  key]
    }
    return obj
  }, obj)
  return obj
}

export const currencyToNumber = (state) => (value) => {
  let val = value.toString()
  return parseInt(val.replace(/\,/g,''))
}

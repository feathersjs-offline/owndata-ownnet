// Convert ISO date strings to Date objects in FeathersJS result sets
// Inspired by https://stackoverflow.com/questions/14488745/javascript-json-date-deserialization

const stringsToDates = (active) => (result) => {
  const regexDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/i;
  function jsonDate (obj) {
    const type = typeof (obj);
    if (type === 'object') {
      for (const p in obj)
        if (obj.hasOwnProperty(p))
          obj[p] = jsonDate(obj[p]);
      return obj;
    } else if (type === 'string' && regexDate.test(obj)) {
      return new Date(obj);
    }
    return obj;
  }

  if (active) {
    if (Array.isArray(result))
      return result.map(jsonDate)
    else
      if (result.data) {
        result.data = result.data.map(jsonDate)
        return result;
      }
      else
        return jsonDate(result);
  }
  else
    return result;
};

module.exports = stringsToDates;

import cloneDeep from 'lodash/cloneDeep';

// Let's hide(/abstract) how we clone an object
const clone = cloneDeep;

/**
 * Is the supplied object `value` an object proper?
 *
 * @param {*} value The "object" to be tested
 * @return {Boolean} The result of the test 
 */
function isObject (value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
/**
 * Strip properties from an result set
 *
 * @param {*} obj The result set to be gleaned
 * @param {*} blacklist A list of properties to strip or a string of a single property
 * @return {*} The result
 */
function stripProps (obj, blacklist) {
  blacklist = Array.isArray(blacklist) ? blacklist : (blacklist || []);
  const res = {};

  Object.keys(obj).forEach(prop => {
    if (blacklist.indexOf(prop) === -1) {
      const value = obj[prop];
      res[prop] = isObject(value) ? stripProps(value, blacklist) : value;
    }
  });

  return res;
}

module.exports = {
  clone,
  isObject,
  stripProps
};

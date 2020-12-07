const { assert} = require('chai');
const clone = require('./clone');
const { omit } = require('lodash');

module.exports = function assertDeepEqualExcept (ds1, ds2, ignore, sort) {
  function removeIgnore (ds) {
    let dsc = clone(ds);
    dsc = omit(dsc, ignore);
    for (const i in dsc) {
      if (typeof dsc[i] === 'object') {
        dsc[i] = removeIgnore(dsc[i]);
      }
    }
    return dsc;
  }

  assert.isArray(ds1);
  assert.isArray(ds2);
  assert.isArray(ignore);
  assert.equal(ds1.length, ds2.length);
  ds1 = ds1.sort(sort);
  ds2 = ds2.sort(sort);
  for (let i = 0; i < ds1.length; i++) {
    const dsi1 = removeIgnore(ds1[i]);
    const dsi2 = removeIgnore(ds2[i]);
    assert.deepEqual(dsi1, dsi2);
  }
};

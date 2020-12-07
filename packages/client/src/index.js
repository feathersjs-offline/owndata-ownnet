const { to, isObject, stripProps, genUuid, hash, hashOfRecord } = require('./common');
const { Owndata, owndataWrapper } = require('./owndata');
const { Ownnet, ownnetWrapper } = require('./ownnet');

module.exports = {
  to, isObject, stripProps, genUuid, hash, hashOfRecord,
  Owndata, owndataWrapper, 
  Ownnet, ownnetWrapper
};

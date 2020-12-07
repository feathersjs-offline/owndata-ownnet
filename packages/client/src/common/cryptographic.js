// Simply "stolen" from feathers-offline-xxx
const md5 = require('md5');
const uuidV4 = require('uuid/v4');
const shortid = require('shortid');
const { stripProps } = require('./misc');

// Integrity of short unique identifiers: https://github.com/dylang/shortid/issues/81#issuecomment-259812835

function genUuid (ifShortUuid) {
  return ifShortUuid ? shortid.generate() : uuidV4();
}

function hash (value) {
  value = typeof value === 'string' ? value : JSON.stringify(value);
  return md5(value);
}

function hashOfRecord (record) {
  return hash(stripProps(record, ['id', '_id']));
}

module.exports = {
  genUuid,
  hash,
  hashOfRecord
};

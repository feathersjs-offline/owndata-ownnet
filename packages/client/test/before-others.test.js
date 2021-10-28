// Set-up localStorage as a global handle
const LocalStorage = require('./own-common/helpers/local-storage');
global.localStorage = new LocalStorage();

// const { LocalStorage } = require('node-localstorage');
// global.localStorage = new LocalStorage('./.scratch');
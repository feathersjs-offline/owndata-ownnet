const LocalStorage = require('./own-common/helpers/local-storage');
const localStorage = new LocalStorage();
global.localStorage = localStorage;

const sampleLen = 5; // Size of test database (backend)
global.sampleLen = sampleLen;
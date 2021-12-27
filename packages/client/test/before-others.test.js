// Set-up localStorage as a global handle
const LocalStorage = require('./own-common/helpers/local-storage');
const delay = require('./own-common/helpers/delay');

clearLocalStorage = () => {
  global.localStorage = new LocalStorage();
}

// We want each of the suite tests to run separately each with a pristine localstorage
const Status = class {
  constructor(levels) {
    this.level = [];
    for (let i = 0; i < levels; i++) this.level.push(false); 
    clearLocalStorage();
  }
  async fulFilled(myLevel) {
    while (myLevel && !this.level[myLevel-1]) {
      await delay(1000)();
    }
    return true;
  }
  done(myLevel) {
    clearLocalStorage();
    return this.level[myLevel] = true;
  }
}

const status = new Status(5);
const getStatus = ix => status.fulFilled(ix);
const setDone = ix => status.done(ix);

global.ownCommonGetStatus = () => getStatus(0);
global.ownCommonSetStatus = () => setDone(0);
global.ownDataGetStatus = () => getStatus(1);
global.ownDataSetStatus = () => setDone(1);
global.ownNetGetStatus = () => getStatus(2);
global.ownNetSetStatus = () => setDone(2);
global.snapshotGetStatus = () => getStatus(3);
global.snapshotSetStatus = () => setDone(3);
global.utilitiesGetStatus = () => getStatus(4);
global.utilitiesSetStatus = () => setDone(4);


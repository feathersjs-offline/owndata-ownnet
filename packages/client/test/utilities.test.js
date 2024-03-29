const { expect } = require('chai');
const { to, stripProps, isObject, genUuid, hash, hashOfRecord, OptionsProxy } = require('../src/common');
const stringsToDatesTest = require('./own-common/helpers/strings-to-dates.test');

describe('Utilities tests - test of common functions', () => {
  before(async () => {
    return await global.utilitiesGetStatus()
  });

  after(() => global.utilitiesSetStatus());


  beforeEach(() => {
  });

  describe('to() utility', () => {

    it('is function', () => {
      expect(typeof to).to.equal('function', 'to() is not a function');
    });

    it('makes Promise', () => {
      expect(typeof to(Promise.reject(false)).then).to.equal('function', 'do not return Promise');
    });

    it('to() promise success', async () => {
      expect(await to(Promise.resolve(true))).to.deep.equal([null, true], 'Did not succeed');
    });

    it('to() promise fail', async () => {
      expect(await to(Promise.reject(false))).to.deep.equal([false, null], 'Did not fail');
    });
  });

  describe('OptionsProxy', () => {

    it('is function', () => {
      expect(typeof OptionsProxy).to.equal('function', 'OptionsProxy is not a function');
    });

    it('fails without option', () => {
      let flag = '';
      try {
        let optProxy = new OptionsProxy();
        flag = 'Error';
      } catch (err) {
        flag = 'OK'
      }
      expect(flag).to.equal('OK', 'Did not throw an error as expected');
    });

    it('works with option', () => {
      let tmp = null;
      let optProxy = new OptionsProxy('test');
      let options = optProxy.observe({ a: 1, b: 2, c: 3 });
      optProxy.watcher(() => { tmp = options});
      options.a = 3;
      expect(tmp).to.deep.equal(options, 'Did not work');
    });
  });

  describe('misc utilities', () => {

    describe('isObject()', () => {

      it('objects', () => {
        expect(isObject({})).to.deep.equal(true, '{} is object');
        let a = { b: 1, c: { d: 2, e: 3 }, d: [1, 2, 3] };
        expect(isObject(a)).to.equal(true, 'a is object');
        expect(isObject(new Date())).to.equal(true, 'new Date() is object');
      });

      it('array', () => {
        expect(isObject([])).to.equal(false, '[] is not object');
        let d = [1, 2, 3];
        expect(isObject(d)).to.equal(false, 'd is not object');
      });

      it('null', () => {
        expect(isObject(null)).to.equal(false, 'null is not object');
      });

      it('other', () => {
        expect(isObject(1)).to.equal(false, '1 is not object');
        expect(isObject('a')).to.equal(false, '\'a\' is not object');
      });
    })

    describe('stripProps()', () => {

      it('empty blacklist', () => {
        let obj = { a: 1, b: 'b', c: 3, d: 'd', x: 'x', y: 'y' };
        let tst = { a: 1, b: 'b', c: 3, d: 'd', x: 'x', y: 'y' };
        expect(obj).to.deep.equal(tst, 'objects are identical');
        expect(stripProps(obj, [])).to.deep.equal(tst, 'identity returned');
        expect(stripProps(obj, '')).to.deep.equal(tst, 'identity returned');
      });

      it('non-empty blacklist', () => {
        let obj = { a: 1, b: 'b', c: 3, d: 'd', x: 'x', y: 'y' };
        let tst = { a: 1, b: 'b', c: 3, d: 'd', y: 'y' };
        expect(stripProps(obj, 'x')).to.deep.equal(tst, 'x stripped (string)');
        obj = { a: 1, b: 'b', c: 3, d: 'd', x: 'x', y: 'y' };
        tst = { a: 1, b: 'b', c: 3, d: 'd', y: 'y' };
        expect(stripProps(obj, ['x'])).to.deep.equal(tst, 'x stripped (array)');
        obj = { a: 1, b: 'b', c: 3, d: 'd', x: 'x', y: 'y' };
        tst = { a: 1, b: 'b', c: 3, d: 'd' };
        expect(stripProps(obj, ['x', 'y'])).to.deep.equal(tst, 'x and y stripped');
        obj = { a: 1, b: 'b', c: { x: 'x1', y: 'y1' }, d: 'd', x: 'x', y: 'y' };
        tst = { a: 1, b: 'b', c: {}, d: 'd' };
        expect(stripProps(obj, ['x', 'y'])).to.deep.equal(tst, 'x and y stripped (multi level)');
      });
    });

    describe('Cryptographic utilities', () => {
      describe('genUuid()', () => {
        it('short uuid', () => {
          let uuid1 = genUuid(true);
          let uuid2 = genUuid(true);
          expect(uuid1.length).to.equal(10, 'short uuid length is wrong');
          expect(uuid1).to.not.equal(uuid2, 'the two uuids are identical');
        });
        it('long uuid', () => {
          let uuid1 = genUuid(false);
          let uuid2 = genUuid(false);
          expect(uuid1.length).to.equal(21, 'long uuid length is wrong');
          expect(uuid1).to.not.equal(uuid2, 'the two uuids are identical');
        });
      });

      describe('hash()', () => {
        it('hash of string', () => {
          let str1 = 'my test string1';
          let hash1 = hash(str1);
          let str2 = 'my test string2';
          expect(hash(str1)).to.not.equal(str1, 'hash equals string');
          expect(hash(str1)).to.equal(hash1, 'hash does not yield same result');
          expect(hash(str1)).to.not.equal(hash(str2), 'hash are not different');
        });
        it('hash of object', () => {
          let obj1 = { a: 1, t: 'my test string1' };
          let hash1 = hash(obj1);
          let obj2 = { a: 1, t: 'my test string2' };
          expect(hash(obj1)).to.not.equal(obj1, 'hash equals string');
          expect(hash(obj1)).to.equal(hash1, 'hash does not yield same result');
          expect(hash(obj1)).to.not.equal(hash(obj2), 'hash are not different');
        });
        it('hash of other', () => {
          let other = [1, 2, 3];
          expect(hash(other)).to.not.equal(other, 'hash equals array');
        });
      });

      describe('hasOfRecord()', () => {
        it('with id or _id', () => {
          let obj1 = { id: 1, t: 'my test string1' };
          let obj1a = { t: 'my test string1' };
          let hash1 = hashOfRecord(obj1);
          let obj2 = { _id: 1, t: 'my test string2' };
          expect(hashOfRecord(obj1)).to.not.equal(obj1, 'hashOfRecord equals record');
          expect(hashOfRecord(obj1)).to.equal(hash1, 'hashOfRecord do not yield same result');
          expect(hashOfRecord(obj1)).to.not.equal(hash(obj2), 'hashOfRecord are not different');
          expect(hashOfRecord(obj1)).to.equal(hash(obj1a), 'hashOfRecord are not equal');
        });
        it('without id and _id', () => {
          let obj1 = { a: 1, t: 'my test string1' };
          let obj1a = { a: 1, t: 'my test string1' };
          let hash1 = hashOfRecord(obj1);
          let obj2 = { a: 1, t: 'my test string2' };
          expect(hashOfRecord(obj1)).to.not.equal(obj1, 'hashOfRecord equals record');
          expect(hashOfRecord(obj1)).to.equal(hash1, 'hashOfRecord do not yield same result');
          expect(hashOfRecord(obj1)).to.not.equal(hash(obj2), 'hashOfRecord are not different');
          expect(hashOfRecord(obj1)).to.equal(hash(obj1a), 'hashOfRecord are not equal');
        });
      });

    })
  });

  stringsToDatesTest();
});

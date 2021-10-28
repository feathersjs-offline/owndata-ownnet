const assert = require('assert');
const stringsToDates = require('../src/strings-to-dates');

describe('toDate verification', () => {
  after(() => {
    console.log(`\n`);
  });

  describe('Date conversion not active', () => {
    it('Date string', () => {
      const myTest = '2001-09-11T12:12:11.000Z';
      const result = stringsToDates(false)(myTest);
      assert.strictEqual(result, myTest, 'Dates are not equal');
    });

    it('Date object', () => {
      const myTest = new Date('2001-09-11T12:12:11.000Z');
      const result = stringsToDates(false)(myTest);
      assert.strictEqual(result.toISOString(), myTest.toISOString(), 'Dates are not equal');
    });

    it('Arbitrary alphanumeric value', () => {
      const value = 5;
      const result = stringsToDates(false)(value);
      assert.strictEqual(result, value, 'Numbers do not equal');
    });

    it('Single element', () => {
      const myTest = { a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z' };
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z') };
      const result = stringsToDates(false)(myTest);
      assert.strictEqual(result.a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result.b, myResult.b, 'Strings do not equal');
      assert.strictEqual(typeof result.d, 'string', 'Dates are not strings');
    });

    it('Multilevel element', () => {
      const myTest = { a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z', e: { f: '2001-09-11T12:12:11.000Z', g: 'hello' } };
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z'), e: { f: new Date('2001-09-11T12:12:11.000Z'), g: 'hello' } };
      const result = stringsToDates(false)(myTest);
      assert.strictEqual(result.a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result.b, myResult.b, 'Strings do not equal');
      assert.strictEqual(typeof result.d, 'string', 'Dates are not strings');
      assert.strictEqual(typeof result.e, 'object', `'e' is not an 'object' but' ${typeof e}'`);
      assert.strictEqual(typeof result.e.f, 'string', `'e.f' is not a 'string' (Date)`);
      assert.strictEqual(result.e.f, myResult.e.f.toISOString(), `'e.f' does not match expected result`);
      assert.strictEqual(typeof result.e.g, 'string', `'e.g' is not an 'string'`);
    });

    it('Array element', () => {
      const myTest = [{ a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z' }];
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z') };
      const result = stringsToDates(false)(myTest);
      assert.strictEqual(result[0].a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result[0].b, myResult.b, 'Strings do not equal');
      assert.strictEqual(typeof result[0].d, 'string', 'Dates are not strings');
    });

    it('Result elements', () => {
      const myTest = { skip: 0, limit: 10, total: 1, data: [{ a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z' }] };
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z') };
      const result = stringsToDates(false)(myTest);
      assert.strictEqual(result.data[0].a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result.data[0].b, myResult.b, 'Strings do not equal');
      assert.strictEqual(typeof result.data[0].d, 'string', 'Dates are not strings');
    });
  });

  describe('Date conversion active', () => {
    it('Date string', () => {
      const myTest = '2001-09-11T12:12:11.000Z';
      const result = stringsToDates(true)(myTest);
      assert.strictEqual(result.toISOString(), new Date(myTest).toISOString(), 'Dates are not equal');
    });

    it('Date object', () => {
      const myTest = new Date('2001-09-11T12:12:11.000Z');
      const result = stringsToDates(true)(myTest);
      assert.strictEqual(result.toISOString(), myTest.toISOString(), 'Dates are not equal');
    });

    it('Arbitrary alphanumeric value', () => {
      const value = 5;
      const result = stringsToDates(true)(value);
      assert.strictEqual(result, value, 'Numbers do not equal');
    });

    it('Single element', () => {
      const myTest = { a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z' };
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z') };
      const result = stringsToDates(true)(myTest);
      assert.strictEqual(result.a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result.b, myResult.b, 'Strings do not equal');
      assert.strictEqual(result.d.toISOString(), myResult.d.toISOString(), 'Dates do not equal');
    });

    it('Multilevel element', () => {
      const myTest = { a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z', e: { f: '2001-09-11T12:12:11.000Z', g: 'hello' } };
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z'), e: { f: new Date('2001-09-11T12:12:11.000Z'), g: 'hello' } };
      const result = stringsToDates(true)(myTest);
      assert.strictEqual(result.a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result.b, myResult.b, 'Strings do not equal');
      assert.strictEqual(typeof result.d, 'object', 'Dates are not strings');
      assert.strictEqual(typeof result.e, 'object', `'e' is not an 'object' but' ${typeof e}'`);
      assert.strictEqual(result.e.f.toISOString(), myResult.e.f.toISOString(), `'f' is not an 'object' (Date)`);
      assert.strictEqual(typeof result.e.g, 'string', `'e' is not an 'object'`);
    });

    it('Array element', () => {
      const myTest = [{ a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z' }];
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z') };
      const result = stringsToDates(true)(myTest);
      assert.strictEqual(result[0].a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result[0].b, myResult.b, 'Strings do not equal');
      assert.strictEqual(result[0].d.toISOString(), myResult.d.toISOString(), 'Dates do not equal');
    });

    it('Result elements', () => {
      const myTest = { skip: 0, limit: 10, total: 1, data: [{ a: 123, b: 'asdf', d: '2001-09-11T12:12:11.000Z' }] };
      const myResult = { a: 123, b: 'asdf', d: new Date('2001-09-11T12:12:11.000Z') };
      const result = stringsToDates(true)(myTest);
      assert.strictEqual(result.data[0].a, myResult.a, 'Numbers do not equal');
      assert.strictEqual(result.data[0].b, myResult.b, 'Strings do not equal');
      assert.strictEqual(result.data[0].d.toISOString(), myResult.d.toISOString(), 'Dates do not equal');
    });
  });

  describe('For full coverage', () => {
    it('exercise hasOwnProperty branch', () => {
      const obj = function () { };
      obj.prototype.inherited = 'Wauu';
      const myObj = new obj();
      myObj.ownProperty = 'Hello';
      const result = stringsToDates(true)(myObj);
      assert.strictEqual(result.ownProperty, myObj.ownProperty, 'ownProperty do not equal');
    });
  });
});

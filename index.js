// default behavior, binds to object prototype

const unwrapPromise = require('./func')

const symbol = Symbol('async-unwrap')

Object.defineProperty(Object.prototype, symbol, { // eslint-disable-line no-extend-native
  get: function () {
    return unwrapPromise(this, true)
  },
  enumerable: false,
  configurable: false
})

module.exports = symbol

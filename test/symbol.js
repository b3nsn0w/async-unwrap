/* eslint-env mocha */

// external modules
const { expect } = require('chai')

// internal modules
const unwrap = require('..')

describe('symbol version', () => {
  it('unwraps a promise', async () => {
    const [err, result] = await Promise.resolve('so this is how try-catch dies')[unwrap]

    expect(err).to.equal(null)
    expect(result).to.equal('so this is how try-catch dies')
  })

  it('unwraps an error', async () => {
    const [err, result] = await Promise.reject(new Error('with thunderous applause'))[unwrap]

    expect(err).to.be.instanceOf(Error)
    expect(err.message).to.equal('with thunderous applause')
    expect(result).to.equal(null)
  })
})

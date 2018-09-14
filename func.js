// actual unwrap function, can be imported on its own

const unwrapped = new WeakMap()

function unwrapPromise (promise, fallbackToUndefined = false) {
  if (!promise || typeof promise.then !== 'function') { // "promise" is not actually a thenable
    if (fallbackToUndefined) return undefined
    else throw TypeError('Only thenables can be unwrapped with async-unwrap')
  }

  if (unwrapped.has(promise)) return unwrapped.get(promise)

  const unwrappedPromise = new Promise(async (resolve, reject) => {
    try {
      resolve([null, await promise])
    } catch (err) {
      resolve([err, null])
    }
  })

  unwrapped.set(promise, unwrappedPromise)
  return unwrappedPromise
}

module.exports = unwrapPromise

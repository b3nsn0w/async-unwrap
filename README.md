Async-await can help you write some amazing-looking and very readable code, but [if you're anything like me](https://xkcd.com/1567/), you probably hate burying it into try-catch blocks. With `async-unwrap`, you can go from this:

```javascript
async () => {
  try {
    await someAsyncOperation()
  } catch (err) {
    doSomething(err)
  }
}
```

to this:

```javascript
async () => {
  const [err, result] = await someAsyncOperation()[unwrap]
  if (err) return doSomething(err)
}
```

# But how?

First, you need to say the magic word:

```javascript
const unwrap = require('async-unwrap')
// or if the above is way too old for you:
import unwrap from 'async-unwrap'
```

This gives you a symbol that's attached to the prototype of every promise (or other thenable), which turns that promise into another one. The "unwrapped" promise will resolve to a ~~tuple~~ two-element array of `[null, result]` if the base promise is resolved and `[err, null]` if it's rejected. This allows you to handle your errors in a slightly different way, without breaking the block scope.

If you're using multiple async calls in a function, I'd recommend structuring your code in the following way:

```javascript
async () => {
  const [firstError, firstResult] = await firstOperation()[unwrap]
  if (firstError) throw firstError // we'll handle it on a higher level

  const [secondError, secondResult] = await secondOperation(firstError)[unwrap]
  if (secondError) throw sanitize(secondError) // sometimes you'll need some special treatment

  return secondResult
}
```

Exercise to the reader: try writing that without nested try-catch blocks or falling back to `let`.

# Local offensive

Before you ask, yes, that does modify global variables, specifically `Object.prototype`, which is actually the variable you should have the most caution with modifying. `async-unwrap` uses a symbol to define a non-enumerable getter, minimizing the surface for errors (it's practically invisible in normal usage), but in some exotic cases you might still run into problems with that. If you'd like to not take that chance, there is a "function" variant of the library:

```javascript
import unwrap from 'async-unwrap/func'

async () => {
  const [err, result] = await unwrap(someAsyncOperation())
  if (err) return doSomething(err)
}
```

Why is this not the default? Well, frankly because I think it's ugly, but to each their own. You can use the function variant if you'd like to, no hard feelings.

# Compatibility

Everything, theoretically. The library binds to all objects and simply checks for a `then()` method, which is the JS spec's way of deciding if something is a promise. This should enable it to work seamlessly with custom promise implementations. If you still run into any compatibility issues, please [submit a bug report](https://github.com/b3nsn0w/async-unwrap/issues/new).

# Contributing

Pull requests are welcome. As always, be respectful towards each other and maybe run or create tests, as appropriate. It's on `npm test`, as usual.

async-unwrap is available under the MIT license.

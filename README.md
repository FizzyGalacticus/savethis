# savethis

A util to help save the return value of a function with minimal effort. Very helpful when debugging, especially with lots of async operations in between.

## Installation

Using `npm`:
```sh
npm i --save-dev @fizzygalacticus/savethis
```

Using `yarn`:
```sh
yarn add --dev @fizzygalacticus/savethis
```

## Usage

`savethis` is a decorator that can be used on both asynchronous and synchronous functions:

**synchronous:**
```js
// Saves "hello, world!" to test.txt
const res = savethis(() => 'hello, world!', 'test.txt', {/* ...options */})(/* ...params */);
console.log(res); // "hello, world!"
```

**asynchronous:**
```js
// Saves "hello, world!" to test.txt
const res = await savethis(() => Promise.resolve('hello, world!'), 'test.txt', {/* ...options */})(/* ...params */);
console.log(res); // "hello, world!"
```

### Options
* `save` - a function to save the data, with the signature `(path, data) => any`. For original functions that are synchronous (don't return a `Promise`), this is `fs.writeFileSync`. Otherwise the default is a `promisify`'d `fs.writeFile`.
* `format` - a function to specify the formatting prior to write. Default is `data => JSON.stringify(data, null, 4)`.

**notes:**
* If your formatting function returns a `Promise`, everything will still function as it should, although if your original function does not return a `Promise`, you will need to take care to catch any errors or rejections from the formatter.

# sugar-fetch

A little convenience for many `fetch()` use cases. Started
[here](https://gist.github.com/JacobOscarson/a327d331171436ba70dce5a59610b059).

Basically a thin wrapper on the `fetch().then((res) => (res.json()))`
pattern with the following extras:

*    Always adds the `same-origin` credentials to the request
*    Uses the Mime-type of the result to determine how to read the response.
*    Uses the `response.ok` attribute to decide if the returned Promise
         should fail or not.

This covers a lot of the use-cases for the `fetch()` method and makes
the call appear as one operation instead of two. As the name suggests,
mostly sugar.

## Howto

Preferably, install via NPM, e.g. `npm i --save sugar-fetch` and pack
via e.g. [WebPack](https://webpack.github.io/). Otherwise, the script
contains a check that will put the API in the `window` object under
the name `__sugar_fetch__`.

Import the API as an object like this:

    > const sfApi = require('sugar-fetch');

### ES6 features

`sugar-fetch` relies quite heavily on ES6 features. If you want to
load it in environments without support for that (e.g. Safari), you
will need to put it behind a transpiling pipeline like
[Babel](https://babeljs.io/). It can be loaded in Node.js, but at the
time of writing (2016-05-09) you will need the
`--harmony_destructuring` flag (see an example how the the test suite
is invoked, [here](package.json)).

The object `sfApi` has two important methods:

### .get()

The `.get()` method takes an URL and an object describing the desired
URL parameters (as encoded by
[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)).

Example:

    > sfApi.get('/foo/bar', {foo: 'bar'})
    // Would request the URI at /foo/bar?foo=bar

### .post()

The other method, `.post()`, will call `fetch()` using a `POST`
request. You can either supply an object to be converted to `JSON`
posted to your endpoint in the *first* parameter or FORM data as the
*second* parameter (encoded using
[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)).

JSON example:

    > sfApi.post('/post/endpoint', {foo: 'bar'})
    // Would POST to `/post/endpoint` with JSON serialized object
    // `{foo: 'bar'}`

Form example:

    > sfApi.post('/post/form', null, {foo: 'bar'})
    // Would POST to the endpoint with the FORM data {foo: 'bar'}

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

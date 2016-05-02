"use strict";

const sfApi = {
  form: (src) => {
    let form = new FormData();
    for(let name in src) {
      form.append(name, src[name]);
    }
    return form;
  },
  params: (src) => {
    let params = new URLSearchParams();
    for(let name in src) {
      params.append(name, src[name]);
    }
    return params;
  },
  headers: (res) => {
    let headObj = {};
    for(let [name, val] of res.headers) {
      headObj[name] = val;
    }
    return headObj;
  },
  readersFull: {
    'application/json': 'json',
  },
  readersStart: {
    'text': 'text',
    'image': 'blob',
  },
  mimeReader: (res, mime) => {
    const starting = mime.split('/')[0];
    return (res[sfApi.readersFull[mime]] && res[sfApi.readersFull[mime]] ||
            res[sfApi.readersStart[starting]] &&
            res[sfApi.readersStart[starting]] || res.text);
  },
  process: (res) => {
    const mime = sfApi.headers(res)['content-type'];
    if(res.ok && mime) {
      return sfApi.mimeReader(res, mime).call(res);
    } else if(res.ok) {
      return res.text();
    } else {
      throw new Error(`Fetch of ${url} failed with ${res.status}`);
    }
  },
  post: (url, json, form) => {
    const body = form && sfApi.form(form) || JSON.stringify(json);
    return fetch(url, {method: 'POST', credentials: 'same-origin',
                       body: body}).then(sfApi.process);
  },
  get: (url, params) => (
    fetch(`${url}?${sfApi.params(params)}`,
          {credentials:'same-origin'}).then(sfApi.process)
  )
}

if(typeof(module) !== 'undefined' && module.exports) { // browser temp..
  module.exports = sfApi;
} else {
  window.__sugar_fetch__ = sfApi;
}

"use strict";

const chai = require('chai');
chai.should();

const {change} = require('altered.js');

let sfApi = require('../sugar-fetch');

class Appender extends Array {
  append(name, value) { this.push([name, value]); }
}

describe("Sugar-fetch API", () => {

  it("Should be importable", () => {
    sfApi.post.should.be.function;
    sfApi.get.should.be.function;
  });

  describe("Fetching", () => {
    let captUrl, captOpts, restoreFetch;
    beforeEach(() => {
      restoreFetch = change(global, {fetch:(url, opts) => {
        captUrl = url;
        captOpts = opts;
        return {then: () =>{} }; }
      });
    });
    afterEach(() => (restoreFetch()));

    const commonFetchChecks = (haveMethod) => {
      it("Should have sent the `same-origin` credentials", () => {
        captOpts.credentials.should.equal('same-origin');
      });
      if(haveMethod) {
        it("Should have specified the correct method in options", () => {
          captOpts.method.should.equal(haveMethod);
        });
      }
    }

    describe("Using the .post() method", () => {
      describe("Sending payload as JSON", () => {
        beforeEach(() => {
          sfApi.post('/fake-json-endpoint', {foo: 'bar'});
        });
        it("Should have sent the correct URL to fetch()", () => {
          captUrl.should.equal('/fake-json-endpoint');
        });

        commonFetchChecks('POST');

        it("Should have JSON encoded the request body", () => {
          JSON.parse(captOpts.body).should.eql({foo: 'bar'});
        });
      });
      describe ("Sending payload as a form data", () => {
        let fdRestore;
        beforeEach(() => {
          fdRestore = change(global, {FormData: Appender});
          sfApi.post('/fake-form-endpoint', null, {foo: 'bar'});
        });
        afterEach(() => {
          fdRestore();
        });
        it("Should have sent the correct URL to fetch()", () => {
          captUrl.should.equal('/fake-form-endpoint');
        });

        commonFetchChecks('POST');

        it("Should have sent the payload as FormData", () => {
          captOpts.body.should.eql([['foo', 'bar']])
        });
      });
    });
    describe ("Using the .get() method", () => {
      let upRestore, query;
      beforeEach(() => {
        upRestore = change(global, {URLSearchParams: Appender});
        sfApi.get('/fake-get-endpoint', {foo: 'bar'});
        query = captUrl.split('?')[1];
      });
      afterEach(() => (upRestore()));
      it("Should have sent the correct URL to fetch()", () => {
        captUrl.indexOf('/fake-get-endpoint').should.equal(0);
      });

      commonFetchChecks();

      it("Should have sent parameters", () => {
        // We'll just assume the Browsers URLSearchParams is correct..
        query.should.equal('foo,bar')
      });
    });
  });
});

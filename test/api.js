"use strict";

const chai = require('chai');
chai.should();

let sf = require('../sugar-fetch');

describe("Sugar-fetch API", () => {
  it("Should be importable", () => {
    sf.post.should.be.function;
    sf.get.should.be.function;
  });
});

"use strict";

const chai = require('chai');
chai.should();

let sfApi = require('../sugar-fetch');

describe("API", () => {
  it("Should be importable", () => {
    sfApi.post.should.be.function;
    sfApi.get.should.be.function;
  });
});

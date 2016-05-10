"use strict";

const chai = require('chai');
chai.should();

const sinon = require('sinon');

const sfApi = require('../sugar-fetch');

const fakeRes = (status, mime) => (
  {
    url: '/fake',
    status: status,
    ok: status > 199 && status < 299,
    headers: [['content-type', mime]],
    text: sinon.spy(),
    blob: sinon.spy(),
    json: sinon.spy(),
  }
);

describe ("Processing", () => {
  it("Should process JSON result for successful application/json", () => {
    let fR = fakeRes(200, 'application/json');
    sfApi.process(fR);
    fR.json.called.should.be.true;
  });
  it("Should process blob result for successful image results", () => {
    let fR = fakeRes(200, 'image/png');
    sfApi.process(fR);
    fR.blob.called.should.be.true;
  });
  it("Should process text result for successful HTML", () => {
    let fR = fakeRes(200, 'text/html');
    sfApi.process(fR);
    fR.text.called.should.be.true;
  });
  it("Should process text result for successful HTML", () => {
    let fR = fakeRes(200, 'text/html');
    sfApi.process(fR);
    fR.text.called.should.be.true;
  });
  it("Should process text result for successful text", () => {
    let fR = fakeRes(200, 'text/plain');
    sfApi.process(fR);
    fR.text.called.should.be.true;
  });
  it("Should fall back to text if mime-type can't be found", () => {
    let fR = {
      url: '/mime-less',
      status: 200,
      ok: true,
      text: sinon.spy(),
      blob: sinon.spy(),
      json: sinon.spy(),
    }
    sfApi.process(fR);
    fR.text.called.should.be.true;
  });
  it("Should throw when enpoint isn't found", () => {
    try {
      sfApi.process(fakeRes(404))
      false.should.be.true;
    } catch(err) {
      err.message.should.equal("Fetch of /fake failed with 404");
    }
  });
  it("Should throw if enpoint crashes", () => {
    try {
      sfApi.process(fakeRes(500))
      false.should.be.true;
    } catch(err) {
      err.message.should.equal("Fetch of /fake failed with 500");
    }
  });
});

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

global.expect = global.chai.expect;

beforeEach(function () {
//    console.log('before  \n')
    this.sandbox = global.sinon.sandbox.create();
    global.stub = this.sandbox.stub.bind(this.sandbox);
    global.spy = this.sandbox.spy.bind(this.sandbox);
});

afterEach(function () {
//    console.log('after \n')
    delete global.stub;
    delete global.spy;
    this.sandbox.restore();
});
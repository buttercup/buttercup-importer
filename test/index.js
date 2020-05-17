const { expect } = require("chai");
const sinon = require("sinon");
const { init } = require("buttercup");

init();

Object.assign(global, {
    expect,
    sinon
});

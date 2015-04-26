gsndfp = require('../src/index.coffee')
assert = require('component-assert')

describe 'gsndfp.load', ->
  it 'should initiate shopper welcome', ()->
    gsndfp.Advertising.load(119)

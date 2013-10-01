var async = require('async')
var dom = require('./dom')
var fvd = require('fvd')
var util = require('./util')
var Watcher = require('./watcher')

var COMMA_SPLIT_RE = /\s*,\s*/
var COLON_SPLIT_RE = /\s*:\s*/

exports.load = load
exports.parse = parse

function load(fonts, callback) {
    callback = util.fn(callback)
    var arr
    try {
        if (!util.isArray(fonts)) throw new Error('load requires a fonts array')
        arr = util.map(fonts, function(font){
            return async.apply(loadFont, font)
        })
    } catch (ex) {
        return util.catcher(ex, callback)
    }
    async.parallel(arr, callback)
}

function loadFont(font, callback) {
    callback = util.fn(callback)
    var arr
    try {
        arr = [
            async.apply(loadStyleSheet, font.css),
            async.apply(watchFamilies, font.families)
        ]
    }
    catch (ex) {
        return util.catcher(ex, callback)
    }
    async.series(arr, callback)
}

function loadStyleSheet(src, callback) {
    callback = util.fn(callback)
    var link = dom.createElement('link', { rel: 'stylesheet', href: src })
    var hasCalled = false
    link.onload = function () {
        if (hasCalled) return
        hasCalled = true
        callback(null)
    }
    link.onerror = function () {
        if (hasCalled) return
        hasCalled = true
        callback(new Error('failed to load CSS: ' + src))
    }
    dom.insert(link, 'head')
}

function watchFamilies(families, callback) {
    callback = util.fn(callback)
    var arr
    try {
        arr = util.map(families, function(family){
            return async.apply(watchFont, parse(family))
        })
    }
    catch (ex) {
        return util.catcher(ex, callback)
    }
    async.parallel(arr, callback)
}

function watchFont(font, callback) {
    callback = util.fn(callback)
    var arr
    try {
        arr = util.map(font.variations, function(variation){
            var watcher = Watcher.create(font.family, variation)
            return watcher.watch.bind(watcher)
        })
    }
    catch (ex) {
        return util.catcher(ex, callback)
    }
    async.parallel(arr, callback)
}

function parse(family) {
    if (typeof family !== 'string' || family.length < 1) return null

    var obj = { family: null, variations: [] }
    var pair = family.split(COLON_SPLIT_RE)
        .filter(function(n){ return typeof n === 'string' && n.trim().length > 0 })
    var variations

    pair.forEach(function(n, i){ return pair[i] = n.trim() })

    obj.family = pair[0]

    if (pair.length < 2) {
        obj.variations.push(fvd.compact())
        return obj
    }

    variations = pair[1].split(COMMA_SPLIT_RE)
        .filter(function(n){ return typeof n === 'string' && n.trim().length > 0 && fvd.expand(n.trim()) })

    variations.forEach(function(n, i){ return variations[i] = n.trim() })

    obj.variations = variations

    return obj
}




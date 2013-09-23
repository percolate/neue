var async = require('async')
var dom = require('./dom')
var util = require('./util')
var Watcher = require('./watcher')

exports.load = load

function load(fonts, callback) {
    callback = callback || function(){}
    async.parallel(util.map(fonts, function(font){
        return async.apply(loadFont, font)
    }), function(err){
        if (err) return callback(err)
        return callback(null, fonts)
    })
}

function loadFont(font, callback) {
    callback = callback || function(){}
    async.series([
        async.apply(loadStyleSheet, font.css),
        async.apply(watchFamilies, font.families)
    ], callback)
}

function loadStyleSheet(src, callback) {
    callback = callback || function(){}
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
    callback = callback || function(){}
    async.parallel(util.map(families, function(family){
        var watcher = Watcher.create(family)
        return watcher.watch.bind(watcher)
    }), callback)
}

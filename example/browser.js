var _ = require('underscore')
var async = require('async')
var fvd = require('fvd')
var neue = require('../')

var FAMILY = 'Source Sans Pro'
var WEIGHTS = [2, 3, 4, 6, 7, 9]
var STYLES = ['n', 'i']
var SERIES = _.chain(WEIGHTS)
    .map(function(w){
        return _.map(STYLES, function(s){
            return s + w
        })
    })
    .flatten()
    .map(function(variation){
        var families = [ [FAMILY, variation].join(':') ]
        var parsed = fvd.parse(variation)
        var css = '//fonts.googleapis.com/css?family=' + FAMILY.replace(/\s/g, '+') + ':' + parsed['font-weight'] + parsed['font-style']
        return function (callback) {
            neue.load([{ families: families, css: css }], function(err){
                if (err) return callback(err)
                write(FAMILY, variation, parsed)
                return callback()
            })
        }
    })
    .map(function(applied){
        return [applied, wait]
    })
    .flatten()
    .value()

async.series(SERIES, function(err, res){
    if (err) throw err
})

function wait(callback) {
    setTimeout(function(){
        callback(null)
    }, 200)
}

function write(family, variation, parsed) {
    var el = document.createElement('div')
    el.setAttribute('style', ['font-size:36px', 'font-family:"' + FAMILY + '"', fvd.expand(variation)].join(';'))
    el.innerHTML = [family, parsed['font-style'], parsed['font-weight']].join(' ')
    document.body.appendChild(el)
}

var async = require('async')
var Font = require('./font')
var Meter = require('./meter')
var own = require('own')

var TIMEOUT_DURATION = 10e3
var DELAY_DURATION = 25
var PROTOTYPE = {

    watch: function (callback) {
        callback = (callback || function(){})
        this.started = Date.now()
        async.whilst(this.isMatch.bind(this), this.delay.bind(this), function(err){
            this.cleanup()
            return callback(err)
        }.bind(this))
    },

    isMatch: function () {
        return this.meterFontSerif.getWidth() === this.meterSerifWidth
            && this.meterFontSans.getWidth() === this.meterSansWidth
    },

    isTimedOut: function () {
        return Date.now() - this.started >= TIMEOUT_DURATION
    },

    delay: function (callback) {
        if (this.isTimedOut()) return callback(new Error('font "' + this.family + '" timed out'))
        setTimeout(callback, DELAY_DURATION)
    },

    cleanup: function () {
        var meters = [
            this.meterFontSerif,
            this.meterFontSans,
            this.meterSerif,
            this.meterSans
        ]
        for (var i = 0; i < meters.length; i++) {
            meters[i].destroy()
        }
    }
}

exports.create = create

function create(family, variation) {
    var meterSerif = Meter.create(Font.create(Font.SERIF, variation))
    var meterSans = Meter.create(Font.create(Font.SANS_SERIF, variation))
    return Object.create(PROTOTYPE, own({
        started: null,
        family: family,
        meterFontSerif: Meter.create(Font.create([family, Font.SERIF].join(','), variation)),
        meterFontSans: Meter.create(Font.create([family, Font.SANS_SERIF].join(','), variation)),
        meterSerif: meterSerif,
        meterSans: meterSans,
        meterSerifWidth: meterSerif.getWidth(),
        meterSansWidth: meterSans.getWidth()
    }))
}

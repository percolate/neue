var async = require('async')
var Font = require('./font')
var Meter = require('./meter')
var own = require('own')

var TIMEOUT_DURATION = 1000
var PROTOTYPE = {

}

exports.create = create

function create(family) {

    var meterSerif = Meter.create(Font.create(Font.SERIF))
    var meterSans = Meter.create(Font.create(Font.SANS_SERIF))

    return Object.create({

        watch: function (callback) {
            callback = (callback || function(){})
            this.started = Date.now()
            async.until(this.isMatch.bind(this), this.delay.bind(this), function(err){
                this.cleanup()
                return callback(err)
            }.bind(this))
        },

        isMatch: function () {
            console.log('check')
            return this.meterFontSerif.getWidth() === this.meterSerifWidth
                && this.meterFontSans.getWidth() === this.meterSansWidth
        },

        isTimedOut: function () {
            return Date.now() - this.started >= TIMEOUT_DURATION
        },

        delay: function (callback) {
            if (this.isTimedOut()) return callback(new Error('font "' + family + '" timed out'))
            setTimeout(callback, 25)
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

    }, own({

        started: null,

        family: family,

        meterFontSerif: Meter.create(Font.create([family, Font.SERIF].join(','))),

        meterFontSans: Meter.create(Font.create([family, Font.SANS_SERIF].join(','))),

        meterSerif: meterSerif,

        meterSans: meterSans,

        meterSerifWidth: meterSerif.getWidth(),

        meterSansWidth: meterSans.getWidth()

    }))
}

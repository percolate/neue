var fvd = require('fvd')
var own = require('own')

var NAME_SPLIT_RE = /,\s*/
var QUOTE_REPLACE_RE = /['"]/g
var PROTOTYPE = {

    getName: function () {
        return this.name
    },

    getCssName: function () {
        var quoted = []
        var split = this.getName().split(NAME_SPLIT_RE)
        var part
        for (var i = 0; i < split.length; i++) {
            part = split[i].replace(QUOTE_REPLACE_RE, '')
            if (part.indexOf(' ') === -1) {
                quoted.push(part);
            } else {
                quoted.push('"' + part + '"')
            }
        }
        return 'font-family:' + quoted.join(',')
    },

    getCssVariation: function () {
        return fvd.expand(this.variation)
    }
}

exports.create = create
exports.SERIF = 'serif'
exports.SANS_SERIF = 'sans-serif'

function create(name, variation) {
    return Object.create(PROTOTYPE, own({
        name: name,
        variation: variation
    }))
}

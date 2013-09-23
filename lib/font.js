var own = require('own')

var NAME_SPLIT_RE = /,\s*/
var VARIATION_RE = /^([nio])([1-9])$/i
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
        var style = 'normal'
        var weight = this.weight + '00'
        if (this.style === 'o') {
            style = 'oblique'
        } else if (this.style === 'i') {
            style = 'italic'
        }
        return 'font-style:' + style + ';font-weight:' + weight
    }
}

exports.create = create
exports.SERIF = 'serif'
exports.SANS_SERIF = 'sans-serif'

function create(name, variation) {
    var match = (variation || 'n4').match(VARIATION_RE)
    var style, weight
    if (match) {
        style = match[1]
        weight = parseInt(match[2], 10)
    }
    return Object.create(PROTOTYPE, own({
        name: name,
        style: style,
        weight: weight
    }))
}

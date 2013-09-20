var own = require('own')

var VARIATION_RE = /^([nio])([1-9])$/i

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

    return Object.create({

        getName: function () {
            return this.name
        },

        getCssName: function () {
            var quoted = []
            var split = name.split(/,\s*/)
            var part
            for (var i = 0; i < split.length; i++) {
                part = split[i].replace(/['"]/g, '')
                if (part.indexOf(' ') === -1) {
                    quoted.push(part);
                } else {
                    quoted.push('"' + part + '"')
                }
            }
            return quoted.join(',')
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

    }, own({

        name: name,

        style: style,

        weight: weight

    }))
}

var dom = require('./dom')
var own = require('own')

var TEST_STRING = 'BESbswy'
var STYLE = [
    'position:absolute',
    'top:-999px',
    'left:-999px',
    'font-size:300px',
    'width:auto',
    'height:auto',
    'line-height:normal',
    'margin:0',
    'padding:0',
    'font-variant:normal',
    'white-space:nowrap'
]

exports.create = create

function create(font) {

    var el = dom.createElement('span', { 'aria-hidden': true }, TEST_STRING)

    dom.setStyle(el, STYLE.concat([font.getCssName(), font.getCssVariation()]).join(';'))
    dom.insert(el)

    return Object.create({

        destroy: function () {
            dom.remove(this.el)
        },

        getWidth: function () {
            return this.el.offsetWidth
        }

    }, own({

        el: el

    }))
}

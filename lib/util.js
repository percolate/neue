var NOOP = function () {}

exports.catcher = catcher
exports.fn = fn
exports.isArray = isArray
exports.map = map

function catcher(err, callback) {
    return process.nextTick(function(){
        return callback(err)
    })
}

function fn(callback) {
    return (typeof callback === 'function') ? callback : NOOP
}

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

function map(arr, iterator, context) {
    var res = []
    if (!arr) return res
    if (arr.map && arr.map === Array.prototype.map) return arr.map(iterator, context)
    for (var i = 0; i < arr.length; i++) {
        res.push(iterator.call(context, arr[i], i, arr))
    }
    return res
}

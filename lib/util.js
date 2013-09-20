exports.map = map

function map(arr, iterator, context) {
    var res = []
    if (!arr) return res
    if (arr.map && arr.map === Array.prototype.map) return arr.map(iterator, context)
    for (var i = 0; i < arr.length; i++) {
        res.push(iterator.call(context, arr[i], i, arr))
    }
    return res
}

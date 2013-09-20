exports.createElement = createElement
exports.insert = insert
exports.remove = remove
exports.setStyle = setStyle

function createElement(tagName, attrs, html) {

    var el = document.createElement(tagName)

    if (attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key])
        }
    }

    if (typeof html === 'string') {
        el.innerHTML = html
    }

    return el
}

function insert(el, targetTag) {
    targetTag = (targetTag || 'body')

    var target = document.getElementsByTagName(targetTag)[0] || document.documentElement

    if (target && target.lastChild) {
        target.insertBefore(el, target.lastChild)
    }
}

function remove(el) {
    if (!el || !el.parentNode) return
    el.parentNode.removeChild(el)
}

function setStyle(el, style) {
    el.style.cssText = style
}

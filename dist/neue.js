/*
    neue - v0.1.0
    (c) 2013 Percolate Industries, Inc. http://percolate.com
*/
!function(e) {
    "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : "undefined" != typeof window ? window.neue = e() : "undefined" != typeof global ? global.neue = e() : "undefined" != typeof self && (self.neue = e());
}(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    throw new Error("Cannot find module '" + o + "'");
                }
                var f = n[o] = {
                    exports: {}
                };
                t[o][0].call(f.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, f, f.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        1: [ function(require, module, exports) {
            exports.createElement = createElement;
            exports.insert = insert;
            exports.remove = remove;
            exports.setStyle = setStyle;
            function createElement(tagName, attrs, html) {
                var el = document.createElement(tagName);
                if (attrs) {
                    for (var key in attrs) {
                        el.setAttribute(key, attrs[key]);
                    }
                }
                if (typeof html === "string") {
                    el.innerHTML = html;
                }
                return el;
            }
            function insert(el, targetTag) {
                targetTag = targetTag || "body";
                var target = document.getElementsByTagName(targetTag)[0] || document.documentElement;
                if (target && target.lastChild) {
                    target.insertBefore(el, target.lastChild);
                }
            }
            function remove(el) {
                if (!el || !el.parentNode) return;
                el.parentNode.removeChild(el);
            }
            function setStyle(el, style) {
                el.style.cssText = style;
            }
        }, {} ],
        2: [ function(require, module, exports) {
            var fvd = require("fvd");
            var own = require("own");
            var NAME_SPLIT_RE = /,\s*/;
            var QUOTE_REPLACE_RE = /['"]/g;
            var PROTOTYPE = {
                getName: function() {
                    return this.name;
                },
                getCssName: function() {
                    var quoted = [];
                    var split = this.getName().split(NAME_SPLIT_RE);
                    var part;
                    for (var i = 0; i < split.length; i++) {
                        part = split[i].replace(QUOTE_REPLACE_RE, "");
                        if (part.indexOf(" ") === -1) {
                            quoted.push(part);
                        } else {
                            quoted.push('"' + part + '"');
                        }
                    }
                    return "font-family:" + quoted.join(",");
                },
                getCssVariation: function() {
                    return fvd.expand(this.variation);
                }
            };
            exports.create = create;
            exports.SERIF = "serif";
            exports.SANS_SERIF = "sans-serif";
            function create(name, variation) {
                return Object.create(PROTOTYPE, own({
                    name: name,
                    variation: variation
                }));
            }
        }, {
            fvd: 10,
            own: 13
        } ],
        3: [ function(require, module, exports) {
            var async = require("async");
            var dom = require("./dom");
            var fvd = require("fvd");
            var util = require("./util");
            var Watcher = require("./watcher");
            var COMMA_SPLIT_RE = /\s*,\s*/;
            var COLON_SPLIT_RE = /\s*:\s*/;
            exports.load = load;
            exports.parse = parse;
            exports.stringify = stringify;
            function load(fonts, callback) {
                callback = util.fn(callback);
                var arr;
                try {
                    if (!util.isArray(fonts)) throw new Error("load requires a fonts array");
                    arr = util.map(fonts, function(font) {
                        return async.apply(loadFont, font);
                    });
                } catch (ex) {
                    return util.catcher(ex, callback);
                }
                async.parallel(arr, callback);
            }
            function loadFont(font, callback) {
                callback = util.fn(callback);
                var arr;
                try {
                    arr = [ async.apply(loadStyleSheet, font.css), async.apply(watchFamilies, font.families) ];
                } catch (ex) {
                    return util.catcher(ex, callback);
                }
                async.series(arr, callback);
            }
            function loadStyleSheet(src, callback) {
                callback = util.fn(callback);
                var link = dom.createElement("link", {
                    rel: "stylesheet",
                    href: src
                });
                var hasCalled = false;
                link.onload = function() {
                    if (hasCalled) return;
                    hasCalled = true;
                    callback(null);
                };
                link.onerror = function() {
                    if (hasCalled) return;
                    hasCalled = true;
                    callback(new Error("failed to load CSS: " + src));
                };
                dom.insert(link, "head");
            }
            function watchFamilies(families, callback) {
                callback = util.fn(callback);
                var arr;
                try {
                    arr = util.map(families, function(family) {
                        return async.apply(watchFont, parse(family));
                    });
                } catch (ex) {
                    return util.catcher(ex, callback);
                }
                async.parallel(arr, callback);
            }
            function watchFont(font, callback) {
                callback = util.fn(callback);
                var arr;
                try {
                    arr = util.map(font.variations, function(variation) {
                        var watcher = Watcher.create(font.family, variation);
                        return watcher.watch.bind(watcher);
                    });
                } catch (ex) {
                    return util.catcher(ex, callback);
                }
                async.parallel(arr, callback);
            }
            function parse(family) {
                if (typeof family !== "string" || family.length < 1) return null;
                var obj = {
                    family: null,
                    variations: []
                };
                var pair = family.split(COLON_SPLIT_RE).filter(function(n) {
                    return typeof n === "string" && n.trim().length > 0;
                });
                var variations;
                pair.forEach(function(n, i) {
                    return pair[i] = n.trim();
                });
                obj.family = pair[0];
                if (pair.length < 2) {
                    obj.variations.push(fvd.compact());
                    return obj;
                }
                variations = pair[1].split(COMMA_SPLIT_RE).filter(function(n) {
                    return typeof n === "string" && n.trim().length > 0 && fvd.expand(n.trim());
                });
                variations.forEach(function(n, i) {
                    return variations[i] = n.trim();
                });
                obj.variations = variations;
                return obj;
            }
            function stringify(family) {
                if (typeof family !== "string" || family.length < 1) return null;
                var parsed = parse(family);
                var res = [];
                var familyTokens;
                if (!parsed) return null;
                familyTokens = parsed.family.toLowerCase().split(" ");
                parsed.variations.forEach(function(v) {
                    res.push(familyTokens.concat(v).join("-"));
                });
                return res;
            }
        }, {
            "./dom": 1,
            "./util": 5,
            "./watcher": 6,
            async: 7,
            fvd: 10
        } ],
        4: [ function(require, module, exports) {
            var dom = require("./dom");
            var own = require("own");
            var TEST_STRING = "BESbswy";
            var STYLE = [ "position:absolute", "top:-999px", "left:-999px", "font-size:300px", "width:auto", "height:auto", "line-height:normal", "margin:0", "padding:0", "font-variant:normal", "white-space:nowrap" ];
            var PROTOTYPE = {
                destroy: function() {
                    dom.remove(this.el);
                },
                getWidth: function() {
                    return this.el.offsetWidth;
                }
            };
            exports.create = create;
            function create(font) {
                var el = dom.createElement("span", {
                    "aria-hidden": true
                }, TEST_STRING);
                dom.setStyle(el, STYLE.concat([ font.getCssName(), font.getCssVariation() ]).join(";"));
                dom.insert(el);
                return Object.create(PROTOTYPE, own({
                    el: el
                }));
            }
        }, {
            "./dom": 1,
            own: 13
        } ],
        5: [ function(require, module, exports) {
            var process = require("__browserify_process");
            var NOOP = function() {};
            exports.catcher = catcher;
            exports.fn = fn;
            exports.isArray = isArray;
            exports.map = map;
            function catcher(err, callback) {
                return process.nextTick(function() {
                    return callback(err);
                });
            }
            function fn(callback) {
                return typeof callback === "function" ? callback : NOOP;
            }
            function isArray(arr) {
                return Object.prototype.toString.call(arr) === "[object Array]";
            }
            function map(arr, iterator, context) {
                var res = [];
                if (!arr) return res;
                if (arr.map && arr.map === Array.prototype.map) return arr.map(iterator, context);
                for (var i = 0; i < arr.length; i++) {
                    res.push(iterator.call(context, arr[i], i, arr));
                }
                return res;
            }
        }, {
            __browserify_process: 12
        } ],
        6: [ function(require, module, exports) {
            var async = require("async");
            var Font = require("./font");
            var Meter = require("./meter");
            var own = require("own");
            var TIMEOUT_DURATION = 1e3;
            var DELAY_DURATION = 25;
            var PROTOTYPE = {
                watch: function(callback) {
                    callback = callback || function() {};
                    this.started = Date.now();
                    async.whilst(this.isMatch.bind(this), this.delay.bind(this), function(err) {
                        this.cleanup();
                        return callback(err);
                    }.bind(this));
                },
                isMatch: function() {
                    return this.meterFontSerif.getWidth() === this.meterSerifWidth && this.meterFontSans.getWidth() === this.meterSansWidth;
                },
                isTimedOut: function() {
                    return Date.now() - this.started >= TIMEOUT_DURATION;
                },
                delay: function(callback) {
                    if (this.isTimedOut()) return callback(new Error('font "' + this.family + '" timed out'));
                    setTimeout(callback, DELAY_DURATION);
                },
                cleanup: function() {
                    var meters = [ this.meterFontSerif, this.meterFontSans, this.meterSerif, this.meterSans ];
                    for (var i = 0; i < meters.length; i++) {
                        meters[i].destroy();
                    }
                }
            };
            exports.create = create;
            function create(family, variation) {
                var meterSerif = Meter.create(Font.create(Font.SERIF, variation));
                var meterSans = Meter.create(Font.create(Font.SANS_SERIF, variation));
                return Object.create(PROTOTYPE, own({
                    started: null,
                    family: family,
                    meterFontSerif: Meter.create(Font.create([ family, Font.SERIF ].join(","), variation)),
                    meterFontSans: Meter.create(Font.create([ family, Font.SANS_SERIF ].join(","), variation)),
                    meterSerif: meterSerif,
                    meterSans: meterSans,
                    meterSerifWidth: meterSerif.getWidth(),
                    meterSansWidth: meterSans.getWidth()
                }));
            }
        }, {
            "./font": 2,
            "./meter": 4,
            async: 7,
            own: 13
        } ],
        7: [ function(require, module, exports) {
            var process = require("__browserify_process");
            (function() {
                var async = {};
                var root, previous_async;
                root = this;
                if (root != null) {
                    previous_async = root.async;
                }
                async.noConflict = function() {
                    root.async = previous_async;
                    return async;
                };
                function only_once(fn) {
                    var called = false;
                    return function() {
                        if (called) throw new Error("Callback was already called.");
                        called = true;
                        fn.apply(root, arguments);
                    };
                }
                var _each = function(arr, iterator) {
                    if (arr.forEach) {
                        return arr.forEach(iterator);
                    }
                    for (var i = 0; i < arr.length; i += 1) {
                        iterator(arr[i], i, arr);
                    }
                };
                var _map = function(arr, iterator) {
                    if (arr.map) {
                        return arr.map(iterator);
                    }
                    var results = [];
                    _each(arr, function(x, i, a) {
                        results.push(iterator(x, i, a));
                    });
                    return results;
                };
                var _reduce = function(arr, iterator, memo) {
                    if (arr.reduce) {
                        return arr.reduce(iterator, memo);
                    }
                    _each(arr, function(x, i, a) {
                        memo = iterator(memo, x, i, a);
                    });
                    return memo;
                };
                var _keys = function(obj) {
                    if (Object.keys) {
                        return Object.keys(obj);
                    }
                    var keys = [];
                    for (var k in obj) {
                        if (obj.hasOwnProperty(k)) {
                            keys.push(k);
                        }
                    }
                    return keys;
                };
                if (typeof process === "undefined" || !process.nextTick) {
                    if (typeof setImmediate === "function") {
                        async.nextTick = function(fn) {
                            setImmediate(fn);
                        };
                        async.setImmediate = async.nextTick;
                    } else {
                        async.nextTick = function(fn) {
                            setTimeout(fn, 0);
                        };
                        async.setImmediate = async.nextTick;
                    }
                } else {
                    async.nextTick = process.nextTick;
                    if (typeof setImmediate !== "undefined") {
                        async.setImmediate = setImmediate;
                    } else {
                        async.setImmediate = async.nextTick;
                    }
                }
                async.each = function(arr, iterator, callback) {
                    callback = callback || function() {};
                    if (!arr.length) {
                        return callback();
                    }
                    var completed = 0;
                    _each(arr, function(x) {
                        iterator(x, only_once(function(err) {
                            if (err) {
                                callback(err);
                                callback = function() {};
                            } else {
                                completed += 1;
                                if (completed >= arr.length) {
                                    callback(null);
                                }
                            }
                        }));
                    });
                };
                async.forEach = async.each;
                async.eachSeries = function(arr, iterator, callback) {
                    callback = callback || function() {};
                    if (!arr.length) {
                        return callback();
                    }
                    var completed = 0;
                    var iterate = function() {
                        iterator(arr[completed], function(err) {
                            if (err) {
                                callback(err);
                                callback = function() {};
                            } else {
                                completed += 1;
                                if (completed >= arr.length) {
                                    callback(null);
                                } else {
                                    iterate();
                                }
                            }
                        });
                    };
                    iterate();
                };
                async.forEachSeries = async.eachSeries;
                async.eachLimit = function(arr, limit, iterator, callback) {
                    var fn = _eachLimit(limit);
                    fn.apply(null, [ arr, iterator, callback ]);
                };
                async.forEachLimit = async.eachLimit;
                var _eachLimit = function(limit) {
                    return function(arr, iterator, callback) {
                        callback = callback || function() {};
                        if (!arr.length || limit <= 0) {
                            return callback();
                        }
                        var completed = 0;
                        var started = 0;
                        var running = 0;
                        (function replenish() {
                            if (completed >= arr.length) {
                                return callback();
                            }
                            while (running < limit && started < arr.length) {
                                started += 1;
                                running += 1;
                                iterator(arr[started - 1], function(err) {
                                    if (err) {
                                        callback(err);
                                        callback = function() {};
                                    } else {
                                        completed += 1;
                                        running -= 1;
                                        if (completed >= arr.length) {
                                            callback();
                                        } else {
                                            replenish();
                                        }
                                    }
                                });
                            }
                        })();
                    };
                };
                var doParallel = function(fn) {
                    return function() {
                        var args = Array.prototype.slice.call(arguments);
                        return fn.apply(null, [ async.each ].concat(args));
                    };
                };
                var doParallelLimit = function(limit, fn) {
                    return function() {
                        var args = Array.prototype.slice.call(arguments);
                        return fn.apply(null, [ _eachLimit(limit) ].concat(args));
                    };
                };
                var doSeries = function(fn) {
                    return function() {
                        var args = Array.prototype.slice.call(arguments);
                        return fn.apply(null, [ async.eachSeries ].concat(args));
                    };
                };
                var _asyncMap = function(eachfn, arr, iterator, callback) {
                    var results = [];
                    arr = _map(arr, function(x, i) {
                        return {
                            index: i,
                            value: x
                        };
                    });
                    eachfn(arr, function(x, callback) {
                        iterator(x.value, function(err, v) {
                            results[x.index] = v;
                            callback(err);
                        });
                    }, function(err) {
                        callback(err, results);
                    });
                };
                async.map = doParallel(_asyncMap);
                async.mapSeries = doSeries(_asyncMap);
                async.mapLimit = function(arr, limit, iterator, callback) {
                    return _mapLimit(limit)(arr, iterator, callback);
                };
                var _mapLimit = function(limit) {
                    return doParallelLimit(limit, _asyncMap);
                };
                async.reduce = function(arr, memo, iterator, callback) {
                    async.eachSeries(arr, function(x, callback) {
                        iterator(memo, x, function(err, v) {
                            memo = v;
                            callback(err);
                        });
                    }, function(err) {
                        callback(err, memo);
                    });
                };
                async.inject = async.reduce;
                async.foldl = async.reduce;
                async.reduceRight = function(arr, memo, iterator, callback) {
                    var reversed = _map(arr, function(x) {
                        return x;
                    }).reverse();
                    async.reduce(reversed, memo, iterator, callback);
                };
                async.foldr = async.reduceRight;
                var _filter = function(eachfn, arr, iterator, callback) {
                    var results = [];
                    arr = _map(arr, function(x, i) {
                        return {
                            index: i,
                            value: x
                        };
                    });
                    eachfn(arr, function(x, callback) {
                        iterator(x.value, function(v) {
                            if (v) {
                                results.push(x);
                            }
                            callback();
                        });
                    }, function(err) {
                        callback(_map(results.sort(function(a, b) {
                            return a.index - b.index;
                        }), function(x) {
                            return x.value;
                        }));
                    });
                };
                async.filter = doParallel(_filter);
                async.filterSeries = doSeries(_filter);
                async.select = async.filter;
                async.selectSeries = async.filterSeries;
                var _reject = function(eachfn, arr, iterator, callback) {
                    var results = [];
                    arr = _map(arr, function(x, i) {
                        return {
                            index: i,
                            value: x
                        };
                    });
                    eachfn(arr, function(x, callback) {
                        iterator(x.value, function(v) {
                            if (!v) {
                                results.push(x);
                            }
                            callback();
                        });
                    }, function(err) {
                        callback(_map(results.sort(function(a, b) {
                            return a.index - b.index;
                        }), function(x) {
                            return x.value;
                        }));
                    });
                };
                async.reject = doParallel(_reject);
                async.rejectSeries = doSeries(_reject);
                var _detect = function(eachfn, arr, iterator, main_callback) {
                    eachfn(arr, function(x, callback) {
                        iterator(x, function(result) {
                            if (result) {
                                main_callback(x);
                                main_callback = function() {};
                            } else {
                                callback();
                            }
                        });
                    }, function(err) {
                        main_callback();
                    });
                };
                async.detect = doParallel(_detect);
                async.detectSeries = doSeries(_detect);
                async.some = function(arr, iterator, main_callback) {
                    async.each(arr, function(x, callback) {
                        iterator(x, function(v) {
                            if (v) {
                                main_callback(true);
                                main_callback = function() {};
                            }
                            callback();
                        });
                    }, function(err) {
                        main_callback(false);
                    });
                };
                async.any = async.some;
                async.every = function(arr, iterator, main_callback) {
                    async.each(arr, function(x, callback) {
                        iterator(x, function(v) {
                            if (!v) {
                                main_callback(false);
                                main_callback = function() {};
                            }
                            callback();
                        });
                    }, function(err) {
                        main_callback(true);
                    });
                };
                async.all = async.every;
                async.sortBy = function(arr, iterator, callback) {
                    async.map(arr, function(x, callback) {
                        iterator(x, function(err, criteria) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, {
                                    value: x,
                                    criteria: criteria
                                });
                            }
                        });
                    }, function(err, results) {
                        if (err) {
                            return callback(err);
                        } else {
                            var fn = function(left, right) {
                                var a = left.criteria, b = right.criteria;
                                return a < b ? -1 : a > b ? 1 : 0;
                            };
                            callback(null, _map(results.sort(fn), function(x) {
                                return x.value;
                            }));
                        }
                    });
                };
                async.auto = function(tasks, callback) {
                    callback = callback || function() {};
                    var keys = _keys(tasks);
                    if (!keys.length) {
                        return callback(null);
                    }
                    var results = {};
                    var listeners = [];
                    var addListener = function(fn) {
                        listeners.unshift(fn);
                    };
                    var removeListener = function(fn) {
                        for (var i = 0; i < listeners.length; i += 1) {
                            if (listeners[i] === fn) {
                                listeners.splice(i, 1);
                                return;
                            }
                        }
                    };
                    var taskComplete = function() {
                        _each(listeners.slice(0), function(fn) {
                            fn();
                        });
                    };
                    addListener(function() {
                        if (_keys(results).length === keys.length) {
                            callback(null, results);
                            callback = function() {};
                        }
                    });
                    _each(keys, function(k) {
                        var task = tasks[k] instanceof Function ? [ tasks[k] ] : tasks[k];
                        var taskCallback = function(err) {
                            var args = Array.prototype.slice.call(arguments, 1);
                            if (args.length <= 1) {
                                args = args[0];
                            }
                            if (err) {
                                var safeResults = {};
                                _each(_keys(results), function(rkey) {
                                    safeResults[rkey] = results[rkey];
                                });
                                safeResults[k] = args;
                                callback(err, safeResults);
                                callback = function() {};
                            } else {
                                results[k] = args;
                                async.setImmediate(taskComplete);
                            }
                        };
                        var requires = task.slice(0, Math.abs(task.length - 1)) || [];
                        var ready = function() {
                            return _reduce(requires, function(a, x) {
                                return a && results.hasOwnProperty(x);
                            }, true) && !results.hasOwnProperty(k);
                        };
                        if (ready()) {
                            task[task.length - 1](taskCallback, results);
                        } else {
                            var listener = function() {
                                if (ready()) {
                                    removeListener(listener);
                                    task[task.length - 1](taskCallback, results);
                                }
                            };
                            addListener(listener);
                        }
                    });
                };
                async.waterfall = function(tasks, callback) {
                    callback = callback || function() {};
                    if (tasks.constructor !== Array) {
                        var err = new Error("First argument to waterfall must be an array of functions");
                        return callback(err);
                    }
                    if (!tasks.length) {
                        return callback();
                    }
                    var wrapIterator = function(iterator) {
                        return function(err) {
                            if (err) {
                                callback.apply(null, arguments);
                                callback = function() {};
                            } else {
                                var args = Array.prototype.slice.call(arguments, 1);
                                var next = iterator.next();
                                if (next) {
                                    args.push(wrapIterator(next));
                                } else {
                                    args.push(callback);
                                }
                                async.setImmediate(function() {
                                    iterator.apply(null, args);
                                });
                            }
                        };
                    };
                    wrapIterator(async.iterator(tasks))();
                };
                var _parallel = function(eachfn, tasks, callback) {
                    callback = callback || function() {};
                    if (tasks.constructor === Array) {
                        eachfn.map(tasks, function(fn, callback) {
                            if (fn) {
                                fn(function(err) {
                                    var args = Array.prototype.slice.call(arguments, 1);
                                    if (args.length <= 1) {
                                        args = args[0];
                                    }
                                    callback.call(null, err, args);
                                });
                            }
                        }, callback);
                    } else {
                        var results = {};
                        eachfn.each(_keys(tasks), function(k, callback) {
                            tasks[k](function(err) {
                                var args = Array.prototype.slice.call(arguments, 1);
                                if (args.length <= 1) {
                                    args = args[0];
                                }
                                results[k] = args;
                                callback(err);
                            });
                        }, function(err) {
                            callback(err, results);
                        });
                    }
                };
                async.parallel = function(tasks, callback) {
                    _parallel({
                        map: async.map,
                        each: async.each
                    }, tasks, callback);
                };
                async.parallelLimit = function(tasks, limit, callback) {
                    _parallel({
                        map: _mapLimit(limit),
                        each: _eachLimit(limit)
                    }, tasks, callback);
                };
                async.series = function(tasks, callback) {
                    callback = callback || function() {};
                    if (tasks.constructor === Array) {
                        async.mapSeries(tasks, function(fn, callback) {
                            if (fn) {
                                fn(function(err) {
                                    var args = Array.prototype.slice.call(arguments, 1);
                                    if (args.length <= 1) {
                                        args = args[0];
                                    }
                                    callback.call(null, err, args);
                                });
                            }
                        }, callback);
                    } else {
                        var results = {};
                        async.eachSeries(_keys(tasks), function(k, callback) {
                            tasks[k](function(err) {
                                var args = Array.prototype.slice.call(arguments, 1);
                                if (args.length <= 1) {
                                    args = args[0];
                                }
                                results[k] = args;
                                callback(err);
                            });
                        }, function(err) {
                            callback(err, results);
                        });
                    }
                };
                async.iterator = function(tasks) {
                    var makeCallback = function(index) {
                        var fn = function() {
                            if (tasks.length) {
                                tasks[index].apply(null, arguments);
                            }
                            return fn.next();
                        };
                        fn.next = function() {
                            return index < tasks.length - 1 ? makeCallback(index + 1) : null;
                        };
                        return fn;
                    };
                    return makeCallback(0);
                };
                async.apply = function(fn) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    return function() {
                        return fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));
                    };
                };
                var _concat = function(eachfn, arr, fn, callback) {
                    var r = [];
                    eachfn(arr, function(x, cb) {
                        fn(x, function(err, y) {
                            r = r.concat(y || []);
                            cb(err);
                        });
                    }, function(err) {
                        callback(err, r);
                    });
                };
                async.concat = doParallel(_concat);
                async.concatSeries = doSeries(_concat);
                async.whilst = function(test, iterator, callback) {
                    if (test()) {
                        iterator(function(err) {
                            if (err) {
                                return callback(err);
                            }
                            async.whilst(test, iterator, callback);
                        });
                    } else {
                        callback();
                    }
                };
                async.doWhilst = function(iterator, test, callback) {
                    iterator(function(err) {
                        if (err) {
                            return callback(err);
                        }
                        if (test()) {
                            async.doWhilst(iterator, test, callback);
                        } else {
                            callback();
                        }
                    });
                };
                async.until = function(test, iterator, callback) {
                    if (!test()) {
                        iterator(function(err) {
                            if (err) {
                                return callback(err);
                            }
                            async.until(test, iterator, callback);
                        });
                    } else {
                        callback();
                    }
                };
                async.doUntil = function(iterator, test, callback) {
                    iterator(function(err) {
                        if (err) {
                            return callback(err);
                        }
                        if (!test()) {
                            async.doUntil(iterator, test, callback);
                        } else {
                            callback();
                        }
                    });
                };
                async.queue = function(worker, concurrency) {
                    if (concurrency === undefined) {
                        concurrency = 1;
                    }
                    function _insert(q, data, pos, callback) {
                        if (data.constructor !== Array) {
                            data = [ data ];
                        }
                        _each(data, function(task) {
                            var item = {
                                data: task,
                                callback: typeof callback === "function" ? callback : null
                            };
                            if (pos) {
                                q.tasks.unshift(item);
                            } else {
                                q.tasks.push(item);
                            }
                            if (q.saturated && q.tasks.length === concurrency) {
                                q.saturated();
                            }
                            async.setImmediate(q.process);
                        });
                    }
                    var workers = 0;
                    var q = {
                        tasks: [],
                        concurrency: concurrency,
                        saturated: null,
                        empty: null,
                        drain: null,
                        push: function(data, callback) {
                            _insert(q, data, false, callback);
                        },
                        unshift: function(data, callback) {
                            _insert(q, data, true, callback);
                        },
                        process: function() {
                            if (workers < q.concurrency && q.tasks.length) {
                                var task = q.tasks.shift();
                                if (q.empty && q.tasks.length === 0) {
                                    q.empty();
                                }
                                workers += 1;
                                var next = function() {
                                    workers -= 1;
                                    if (task.callback) {
                                        task.callback.apply(task, arguments);
                                    }
                                    if (q.drain && q.tasks.length + workers === 0) {
                                        q.drain();
                                    }
                                    q.process();
                                };
                                var cb = only_once(next);
                                worker(task.data, cb);
                            }
                        },
                        length: function() {
                            return q.tasks.length;
                        },
                        running: function() {
                            return workers;
                        }
                    };
                    return q;
                };
                async.cargo = function(worker, payload) {
                    var working = false, tasks = [];
                    var cargo = {
                        tasks: tasks,
                        payload: payload,
                        saturated: null,
                        empty: null,
                        drain: null,
                        push: function(data, callback) {
                            if (data.constructor !== Array) {
                                data = [ data ];
                            }
                            _each(data, function(task) {
                                tasks.push({
                                    data: task,
                                    callback: typeof callback === "function" ? callback : null
                                });
                                if (cargo.saturated && tasks.length === payload) {
                                    cargo.saturated();
                                }
                            });
                            async.setImmediate(cargo.process);
                        },
                        process: function process() {
                            if (working) return;
                            if (tasks.length === 0) {
                                if (cargo.drain) cargo.drain();
                                return;
                            }
                            var ts = typeof payload === "number" ? tasks.splice(0, payload) : tasks.splice(0);
                            var ds = _map(ts, function(task) {
                                return task.data;
                            });
                            if (cargo.empty) cargo.empty();
                            working = true;
                            worker(ds, function() {
                                working = false;
                                var args = arguments;
                                _each(ts, function(data) {
                                    if (data.callback) {
                                        data.callback.apply(null, args);
                                    }
                                });
                                process();
                            });
                        },
                        length: function() {
                            return tasks.length;
                        },
                        running: function() {
                            return working;
                        }
                    };
                    return cargo;
                };
                var _console_fn = function(name) {
                    return function(fn) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        fn.apply(null, args.concat([ function(err) {
                            var args = Array.prototype.slice.call(arguments, 1);
                            if (typeof console !== "undefined") {
                                if (err) {
                                    if (console.error) {
                                        console.error(err);
                                    }
                                } else if (console[name]) {
                                    _each(args, function(x) {
                                        console[name](x);
                                    });
                                }
                            }
                        } ]));
                    };
                };
                async.log = _console_fn("log");
                async.dir = _console_fn("dir");
                async.memoize = function(fn, hasher) {
                    var memo = {};
                    var queues = {};
                    hasher = hasher || function(x) {
                        return x;
                    };
                    var memoized = function() {
                        var args = Array.prototype.slice.call(arguments);
                        var callback = args.pop();
                        var key = hasher.apply(null, args);
                        if (key in memo) {
                            callback.apply(null, memo[key]);
                        } else if (key in queues) {
                            queues[key].push(callback);
                        } else {
                            queues[key] = [ callback ];
                            fn.apply(null, args.concat([ function() {
                                memo[key] = arguments;
                                var q = queues[key];
                                delete queues[key];
                                for (var i = 0, l = q.length; i < l; i++) {
                                    q[i].apply(null, arguments);
                                }
                            } ]));
                        }
                    };
                    memoized.memo = memo;
                    memoized.unmemoized = fn;
                    return memoized;
                };
                async.unmemoize = function(fn) {
                    return function() {
                        return (fn.unmemoized || fn).apply(null, arguments);
                    };
                };
                async.times = function(count, iterator, callback) {
                    var counter = [];
                    for (var i = 0; i < count; i++) {
                        counter.push(i);
                    }
                    return async.map(counter, iterator, callback);
                };
                async.timesSeries = function(count, iterator, callback) {
                    var counter = [];
                    for (var i = 0; i < count; i++) {
                        counter.push(i);
                    }
                    return async.mapSeries(counter, iterator, callback);
                };
                async.compose = function() {
                    var fns = Array.prototype.reverse.call(arguments);
                    return function() {
                        var that = this;
                        var args = Array.prototype.slice.call(arguments);
                        var callback = args.pop();
                        async.reduce(fns, args, function(newargs, fn, cb) {
                            fn.apply(that, newargs.concat([ function() {
                                var err = arguments[0];
                                var nextargs = Array.prototype.slice.call(arguments, 1);
                                cb(err, nextargs);
                            } ]));
                        }, function(err, results) {
                            callback.apply(that, [ err ].concat(results));
                        });
                    };
                };
                var _applyEach = function(eachfn, fns) {
                    var go = function() {
                        var that = this;
                        var args = Array.prototype.slice.call(arguments);
                        var callback = args.pop();
                        return eachfn(fns, function(fn, cb) {
                            fn.apply(that, args.concat([ cb ]));
                        }, callback);
                    };
                    if (arguments.length > 2) {
                        var args = Array.prototype.slice.call(arguments, 2);
                        return go.apply(this, args);
                    } else {
                        return go;
                    }
                };
                async.applyEach = doParallel(_applyEach);
                async.applyEachSeries = doSeries(_applyEach);
                async.forever = function(fn, callback) {
                    function next(err) {
                        if (err) {
                            if (callback) {
                                return callback(err);
                            }
                            throw err;
                        }
                        fn(next);
                    }
                    next();
                };
                if (typeof define !== "undefined" && define.amd) {
                    define([], function() {
                        return async;
                    });
                } else if (typeof module !== "undefined" && module.exports) {
                    module.exports = async;
                } else {
                    root.async = async;
                }
            })();
        }, {
            __browserify_process: 12
        } ],
        8: [ function(require, module, exports) {
            var own = require("own");
            var DESCRIPTOR_RE = /\s+/g;
            var PROTOTYPE = {
                compact: function(input) {
                    var result = [ "n", "4" ];
                    var descriptors = (input || "").split(";");
                    var pair, property, value, index, values;
                    for (var i = 0; i < descriptors.length; i++) {
                        pair = descriptors[i].replace(DESCRIPTOR_RE, "").split(":");
                        if (pair.length !== 2) continue;
                        property = pair[0];
                        value = pair[1];
                        values = this.values[property];
                        if (!values) continue;
                        for (var j = 0; j < values.length; j++) {
                            if (values[j][1] !== value) continue;
                            result[this.properties.indexOf(property)] = values[j][0];
                        }
                    }
                    return result.join("");
                }
            };
            exports.create = create;
            function create(properties, values) {
                return Object.create(PROTOTYPE, own({
                    properties: properties,
                    values: values
                }));
            }
        }, {
            own: 13
        } ],
        9: [ function(require, module, exports) {
            var own = require("own");
            var PROTOTYPE = {
                expand: function(input) {
                    if (typeof input !== "string" || input.length !== 2) return null;
                    var result = [ null, null ];
                    var key, property, values, value;
                    for (var i = 0; i < this.properties.length; i++) {
                        key = input[i];
                        property = this.properties[i];
                        values = this.values[property];
                        for (j = 0; j < values.length; j++) {
                            value = values[j];
                            if (value[0] !== key) continue;
                            result[i] = [ this.properties[i], value[1] ].join(":");
                        }
                    }
                    return result.indexOf(null) < 0 ? result.join(";") + ";" : null;
                }
            };
            exports.create = create;
            function create(properties, values) {
                return Object.create(PROTOTYPE, own({
                    properties: properties,
                    values: values
                }));
            }
        }, {
            own: 13
        } ],
        10: [ function(require, module, exports) {
            var Compactor = require("./compactor");
            var Expander = require("./expander");
            var Parser = require("./parser");
            var PROPERTIES = [ "font-style", "font-weight" ];
            var VALUES = {
                "font-style": [ [ "n", "normal" ], [ "i", "italic" ], [ "o", "oblique" ] ],
                "font-weight": [ [ "4", "normal" ], [ "7", "bold" ], [ "1", "100" ], [ "2", "200" ], [ "3", "300" ], [ "4", "400" ], [ "5", "500" ], [ "6", "600" ], [ "7", "700" ], [ "8", "800" ], [ "9", "900" ] ]
            };
            var compactor, expander, parser;
            exports.compact = compact;
            exports.expand = expand;
            exports.parse = parse;
            function compact(input) {
                if (!compactor) compactor = Compactor.create(PROPERTIES, VALUES);
                return compactor.compact(input);
            }
            function expand(input) {
                if (!expander) expander = Expander.create(PROPERTIES, VALUES);
                return expander.expand(input);
            }
            function parse(input) {
                if (!parser) parser = Parser.create(PROPERTIES, VALUES);
                return parser.parse(input);
            }
        }, {
            "./compactor": 8,
            "./expander": 9,
            "./parser": 11
        } ],
        11: [ function(require, module, exports) {
            var own = require("own");
            var PROTOTYPE = {
                parse: function(input) {
                    if (typeof input !== "string" || input.length !== 2) return null;
                    var result = {};
                    var key, property, values, value;
                    for (var i = 0; i < this.properties.length; i++) {
                        key = input[i];
                        property = this.properties[i];
                        values = this.values[property];
                        for (j = 0; j < values.length; j++) {
                            value = values[j];
                            if (value[0] !== key) continue;
                            result[this.properties[i]] = value[1];
                        }
                    }
                    return result[this.properties[0]] && result[this.properties[1]] ? result : null;
                }
            };
            exports.create = create;
            function create(properties, values) {
                return Object.create(PROTOTYPE, own({
                    properties: properties,
                    values: values
                }));
            }
        }, {
            own: 13
        } ],
        12: [ function(require, module, exports) {
            var process = module.exports = {};
            process.nextTick = function() {
                var canSetImmediate = typeof window !== "undefined" && window.setImmediate;
                var canPost = typeof window !== "undefined" && window.postMessage && window.addEventListener;
                if (canSetImmediate) {
                    return function(f) {
                        return window.setImmediate(f);
                    };
                }
                if (canPost) {
                    var queue = [];
                    window.addEventListener("message", function(ev) {
                        if (ev.source === window && ev.data === "process-tick") {
                            ev.stopPropagation();
                            if (queue.length > 0) {
                                var fn = queue.shift();
                                fn();
                            }
                        }
                    }, true);
                    return function nextTick(fn) {
                        queue.push(fn);
                        window.postMessage("process-tick", "*");
                    };
                }
                return function nextTick(fn) {
                    setTimeout(fn, 0);
                };
            }();
            process.title = "browser";
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.binding = function(name) {
                throw new Error("process.binding is not supported");
            };
            process.cwd = function() {
                return "/";
            };
            process.chdir = function(dir) {
                throw new Error("process.chdir is not supported");
            };
        }, {} ],
        13: [ function(require, module, exports) {
            create.readonly = readonly;
            module.exports = create;
            function create(properties, isWritable, isConfigurable) {
                if (properties !== Object(properties)) return undefined;
                var result = {};
                var name, descriptors, descriptorName, descriptor;
                for (name in properties) {
                    if (!properties.hasOwnProperty(name)) continue;
                    result[name] = Object.getOwnPropertyDescriptor(properties, name);
                    if (typeof isWritable === "boolean") result[name].writable = isWritable;
                    if (typeof isConfigurable === "boolean") result[name].configurable = isConfigurable;
                }
                return result;
            }
            function readonly(properties) {
                return create(properties, false, false);
            }
        }, {} ]
    }, {}, [ 3 ])(3);
});


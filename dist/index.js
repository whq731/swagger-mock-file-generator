'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

var _swaggerMockParser = require('swagger-mock-parser');

var _swaggerMockParser2 = _interopRequireDefault(_swaggerMockParser);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

// babel-polyfill can only be imported once
if (!global._babelPolyfill) {
    require('babel-polyfill');
}

exports['default'] = function (swaggerFile, mockFile, cb) {
    if (!swaggerFile) {
        throw new Error('missing swagger file path');
    }
    _lodash2['default'].mixin({
        nestedOmit: function nestedOmit(obj, iteratee, context, cb) {
            var r = _lodash2['default'].omit(obj, iteratee, context);

            _async2['default'].each(r, function (val, key) {
                if (typeof val === "object") r[key] = _lodash2['default'].nestedOmit(val, iteratee, context, cb);
            });

            return r;
        }
    });
    var parser = new _swaggerMockParser2['default']();
    var parserPromise = new Promise(function (resolve) {
        _swaggerParser2['default'].dereference(swaggerFile, function (err, swagger) {
            if (err) throw err;
            // remove definitions defined example of null
            swagger.definitions = _lodash2['default'].nestedOmit(swagger.definitions, 'example', null, function () {
                resolve(swagger);
            });
        });
    });

    parserPromise.then(function (api) {
        var paths = api.paths;
        try {
            for (var path in paths) {
                if (paths.hasOwnProperty(path)) {
                    for (var action in paths[path]) {
                        if (paths[path].hasOwnProperty(action)) {
                            if (paths[path][action].responses) {
                                for (var resCode in paths[path][action].responses) {
                                    if (paths[path][action].responses.hasOwnProperty(resCode)) {
                                        if (paths[path][action].responses[resCode].schema) {
                                            // if example is defined and not empty,on override just skip it
                                            if (paths[path][action].responses[resCode].schema.example && paths[path][action].responses[resCode].schema.example !== '') {
                                                continue;
                                            } else {
                                                paths[path][action].responses[resCode].schema.example = parser.parse(paths[path][action].responses[resCode].schema);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            _fs2['default'].writeFile(mockFile || 'swaggerWithMock.json', JSON.stringify(api, null, 2), 'utf-8', function (err) {
                if (err) throw err;
                if (cb) cb();
            });
        } catch (e) {
            console.log(e);
        }
    });
};

;
module.exports = exports['default'];
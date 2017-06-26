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

// babel-polyfill only can be imported once
if (!global._babelPolyfill) {
    require('babel-polyfill');
}

exports['default'] = function (swaggerFile, mockFile, cb) {
    if (!swaggerFile) {
        throw new Error('missing swagger file path');
    }
    var parser = new _swaggerMockParser2['default']({ useExample: true });
    var parserPromise = new Promise(function (resolve) {
        _swaggerParser2['default'].dereference(swaggerFile, function (err, swagger) {
            if (err) throw err;
            resolve(swagger);
        });
    });
    parserPromise.then(function (api) {
        var paths = api.paths;
        try {
            (function () {
                for (var path in paths) {
                    if (paths.hasOwnProperty(path)) {
                        for (var action in paths[path]) {
                            if (paths[path].hasOwnProperty(action)) {
                                if (paths[path][action].responses) {
                                    for (var resCode in paths[path][action].responses) {
                                        if (paths[path][action].responses.hasOwnProperty(resCode)) {
                                            var _ret2 = (function () {
                                                var schema = paths[path][action].responses[resCode].schema;
                                                if (schema) {
                                                    // if example is defined and not empty,on override just skip it
                                                    if (schema.example && schema.example !== '') {
                                                        return 'continue';
                                                    } else {
                                                        // if current schema don't have 'properties', return null object
                                                        schema.example = {};
                                                        if (schema.hasOwnProperty('properties')) {
                                                            Object.keys(schema['properties']).forEach(function (key) {
                                                                schema.example[key] = parser.parse(schema['properties'][key]);
                                                            });
                                                        } else {
                                                            schema.example = parser.parse(schema);
                                                        }
                                                    }
                                                }
                                            })();

                                            if (_ret2 === 'continue') continue;
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                var cache = [];
                _fs2['default'].writeFile(mockFile || 'swaggerWithMock.json', JSON.stringify(api, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Circular reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                }, 2), 'utf-8', function (err) {
                    if (err) throw err;
                    if (cb) cb();
                });
                cache = null;
            })();
        } catch (e) {
            console.log(e);
        }
    });
};

;
module.exports = exports['default'];
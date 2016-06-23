'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

var _swaggerMockParser = require('swagger-mock-parser');

var _swaggerMockParser2 = _interopRequireDefault(_swaggerMockParser);

exports['default'] = function (swaggerFile, mockFile) {
    if (!swaggerFile) {
        throw new Error('missing swagger file path');
    }

    var parserPromise = new _Promise(function (resolve) {
        _swaggerParser2['default'].dereference(swaggerFile, function (err, api) {
            if (err) throw err;
            resolve(api);
        });
    });

    parserPromise.then(function (api) {

        var paths = api.paths;
        for (var path in paths) {
            if (paths.hasOwnProperty(path)) {
                for (var action in paths[path]) {
                    if (paths[path].hasOwnProperty(action)) {
                        if (paths[path][action].responses) {
                            for (var resCode in paths[path][action].responses) {
                                if (paths[path][action].responses.hasOwnProperty(resCode)) {
                                    if (paths[path][action].responses[resCode].schema) {
                                        paths[path][action].responses[resCode].schema.example = new _swaggerMockParser2['default']().parse(paths[path][action].responses[resCode].schema);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        _fs2['default'].writeFile(mockFile || 'swaggerWithMock.json', JSON.stringify(api, null, 2), 'utf-8');
    });
};

;
module.exports = exports['default'];
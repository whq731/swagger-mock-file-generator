import fs from 'fs';
import swaggerParser from 'swagger-parser';
import mockParser from 'swagger-mock-parser';
// babel-polyfill can only be imported once
if (!global._babelPolyfill) {
    require('babel-polyfill');
}
export default function(swaggerFile, mockFile, cb) {
    if (!swaggerFile) {
        throw new Error('missing swagger file path');
    }
    let parser = new mockParser({useExample: true});
    let parserPromise = new Promise((resolve) => {
            swaggerParser.dereference(swaggerFile, (err, swagger) => {
            if (err) throw err;
            resolve(swagger);
        });
});

    parserPromise.then((api) => {
        let paths = api.paths;
    try {
        for (let path in paths) {
            if (paths.hasOwnProperty(path)) {
                for (let action in paths[path]) {
                    if (paths[path].hasOwnProperty(action)) {
                        if (paths[path][action].responses) {
                            for (let resCode in paths[path][action].responses) {
                                if (paths[path][action].responses.hasOwnProperty(resCode)) {
                                    if (paths[path][action].responses[resCode].schema) {
                                        // if example is defined and not empty,on override just skip it
                                        if (paths[path][action].responses[resCode].schema.example && paths[path][action].responses[resCode].schema.example !== '') {
                                            continue;
                                        } else {
                                            paths[path][action].responses[resCode].schema.example = setImmediate(()=>{parser.parse(paths[path][action].responses[resCode].schema)})
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        };
        let cache = [];
        fs.writeFile(mockFile || 'swaggerWithMock.json', JSON.stringify(api, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, 2), 'utf-8', (err) => {
            if (err) throw err;
            if (cb) cb();
        });
        cache = null;
    } catch (e) {
        console.log(e)
    }

});

};
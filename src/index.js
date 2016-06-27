import fs from 'fs'
import swaggerParser from 'swagger-parser';
import mockParser from 'swagger-mock-parser'

export default function(swaggerFile, mockFile, cb) {
  if (!swaggerFile) {
    throw new Error('missing swagger file path');
  }

let parserPromise = new Promise((resolve) => {
	swaggerParser.dereference(swaggerFile, function(err, api) {
	  if (err) throw err;
	  resolve(api);
	});
});
parserPromise.then((api) => {
    let paths = api.paths;
    for (let path in paths) {
        if (paths.hasOwnProperty(path)) {
            for(let action in paths[path]){
                if (paths[path].hasOwnProperty(action)) {
                    if(paths[path][action].responses){
                        for(let resCode in paths[path][action].responses){
                            if(paths[path][action].responses.hasOwnProperty(resCode)){
                                if(paths[path][action].responses[resCode].schema){
                                    // if example is defined ,on override just skip it
                                    if(paths[path][action].responses[resCode].schema.example){
                                        continue;
                                    } else {
                                        paths[path][action].responses[resCode].schema.example = new mockParser().parse(paths[path][action].responses[resCode].schema)
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
    };
    fs.writeFile(mockFile || 'swaggerWithMock.json', JSON.stringify(api, null, 2) , 'utf-8', cb);
});

};
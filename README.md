# swagger-mock-file-generator
A generator of mock file base on swagger yaml or JSON,output swagger with mock data JSON file.

The mock data is filled in ````responses.[code].schema.example````
Spec: [here](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-13)

require('swagger-mock-file-generator')(<swaggerFile>, <mockFile>[, callback])
Notice: mockFile must be a json format.
##example
````javascript
var parser = require('swagger-mock-file-generator');
// swagger source file is both .yaml and .json is OK.
parser('./swagger.yaml','./swaggerWithMock.json', function(){
    console.log('mock json file created!')
});

````
This mocked file supports https://github.com/whq731/swagger-express-middleware-with-chance or https://github.com/BigstickCarpet/swagger-express-middleware
Free to choose! 


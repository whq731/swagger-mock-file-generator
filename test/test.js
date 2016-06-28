var parser = require('../dist/index');
parser('./swagger.yaml','./swaggerWithMock.json', function(err){
    console.log(err)
});
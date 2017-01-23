var parser = require('../dist/index');
parser('./swagger.json','./swaggerWithMock.json', function(err){
    console.log(err)
});
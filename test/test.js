var parser = require('../dist/index');
parser('./test/swagger.json','./swaggerWithMock.json', function(err){
    if (!err) console.log('生成成功')
});
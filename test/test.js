var parser = require('../dist/index');
parser('./swagger.json','./swaggerWithMock.json', function(err){
    if (!err) console.log('生成成功')
});
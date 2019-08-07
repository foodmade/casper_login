
phantom.outputEncoding = "GBK"
var casper = require('casper').create();
casper.start(function(){
    this.echo("入口");
})

casper.then(function(){
    this.echo('数字0')
})

casper.wait(5000,function(){
    this.echo("数字1");
})

casper.then(function(){
    this.echo("数字2");
})


casper.run();
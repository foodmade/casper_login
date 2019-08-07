
phantom.outputEncoding="GBK";

var casper = require('casper').create({
    clientScripts: ["./jquery.js"],
    verbose: false,
    logLevel: 'debug',
     //页面访问设置
     pageSettings: {
        //是否加载图片
        'loadImages':  true,
        //用户代理
        'userAgent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
     // 浏览器窗口大小
     viewportSize: {
        width: 1920,
        height: 1080
    }
 });

 if(casper.cli.args.length === 0) {
   casper.echo("Please enter your account number and password").exit();
 }

 var args2 = casper.cli.args;

 var data = {
    userName:args2[0],
    password:args2[1]
}
 
 casper.start('https://account.chsi.com.cn/passport/login?service=https%3A%2F%2Fmy.chsi.com.cn%2Farchive%2Fj_spring_cas_security_check', function() {
    this.waitForSelector('form[id="fm1"]');
    this.echo('打开 '+this.getTitle() + "完毕");
 });
 
//输入账号密码
 casper.then(function(){
    this.echo('Wait Input Username And Password.....');

    var userName = data.userName;
    var pwd = data.password;

    this.echo('userName:' + userName + "  password:" + pwd);

    this.sendKeys('form#fm1 input#username', userName.toString());
    this.sendKeys('form#fm1 input#password', pwd);

    this.capture("./image/input_password.png"); 
    this.echo("Input Finish......"); 

})

//点击登录 并且验证密码
casper.then(function(){
    this.click('form#fm1 input[type="submit"]');

    this.echo("Click Login Button ! ! Wait Jump......"); 

    casper.wait(2000,function(){
        var flag = this.evaluate(function(){
            var pwdIsError = $('div#status').text();
            console.log(pwdIsError);
            return pwdIsError != '';
        });

        if(flag){
            casper.exit();
        }
    })

    this.waitForSelector('a.login-btn');
})



//登录成功
casper.then(function(){
    this.echo("Login Success.... userName:" + data.userName)
    casper.capture("./image/login_success.png");
})

//点击按钮 "进入个人中心界面"
casper.then(function(){
    casper.click('a.login-btn');
    this.waitForSelector('dt#xz-nav');
})

casper.then(function(){
    this.echo('Jump To User Controlr Finish')
    casper.capture("./image/userControl.png")
})

//点击进入学籍界面
casper.then(function(){
    casper.clickLabel('学籍','a')
    this.wait(6000,function(){
        casper.capture('./image/xueji.png')
    })
})


casper.on('remote.message', function(msg) {
    this.echo('remote message : ' + msg);
})

casper.on('mouse.click',function(msg){
    this.echo(' click :' + msg);
})

casper.on('resource.error',function(){
    this.echo('err message :' + msg);
})

casper.on('step.error', function(err) {
    this.die("Step has failed: " + err);
});

casper.on('complete.error', function(err) {
    this.die("Complete callback has failed: " + err);
});

casper.on('fill',function(msg){
    this.die("fill text: " + msg);
})

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});
 
 casper.run();
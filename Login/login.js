
phantom.outputEncoding="GBK";

var casper = require('casper').create({
    clientScripts: ["./jquery.js","./authcode.js"],
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: true, //加载图片
        loadPlugins: true, //插件
        XSSAuditingEnabled: false,
        localToRemoteUrlAccessEnabled: false,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0' //伪造头
    },
    onError: function (casper, msg, backtrace) {
        this.echo("onError msg:", msg);
        backtrace.forEach(function (i, index) {
            this.echo("onError backtrace:", msg);
        });
    },
    onLoadError: function (casper, requestUrl, sta) {
        casper.echo("onLoadError requestUrl: " + requestUrl);
        casper.echo("onLoadError status :" + sta);
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
};
 
 casper.start('https://account.chsi.com.cn/passport/login?service=https%3A%2F%2Fmy.chsi.com.cn%2Farchive%2Fj_spring_cas_security_check', function() {
    this.waitForSelector('form[id="fm1"]');
    this.echo('打开 '+this.getTitle() + "完毕");

    //检测是否存在验证码
     if(!casper.exists('div.errors')){
         this.echo('Already have verification code!!! execute fetch code image ');
         casper.download('https://account.chsi.com.cn/passport/captcha.image?id=7561.789413148365', './image/code.png');
         this.evaluate(test);
         casper.exit();
     }
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
            return pwdIsError !== '';
        });

        if(flag){
            casper.exit();
        }
    });

    this.waitForSelector('a.login-btn');
});



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
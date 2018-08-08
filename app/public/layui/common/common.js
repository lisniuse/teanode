$(function() {
utils = {};

//初始化layui相关控件
layui.use('element', function() {
    var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    //监听导航点击
    element.on('nav(demo)', function(elem) {
        layer.msg(elem.text());
    });
});
var layer = "";
layui.use('layer', function() {
    layer = layui.layer;
});

layui.use('form', function() {
    var form = layui.form;
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
        /^[\S]{8,16}$/
        ,'密码必须8到16位，且不能出现空格'
        ]
    })
});
  
//初始化事件监听
$(".tea-header .layui-nav-item").on("click", function (event) {
    var ele = $(this);
    var eleText = $.trim(ele.text());
    var checkPop = CheckPop();
    switch(eleText) {
        case '登录':
            checkPop.show("login");
            break;
        case '注册':
            checkPop.show("reg");
            break;
    }
});

//初始化登录注册窗口
var CheckPop = function (options) {
    var ele = $('<div class="tea-checkpop" style="display: none;" id="checkPop"></div>');
    ele.html(
        '<div id="regPop" v-if="type===\'reg\'" class="tea-checkpop-form" >' + 
            '<form class="layui-form" action="">' +
                '<div class="layui-form-item">' +
                    '<label class="layui-form-label tea-form-label">邮箱</label>' + 
                    '<div class="layui-input-block tea-input-block">' +
                        '<input type="text" v-model="form.email" name="email" lay-verify="required|email" autocomplete="off" placeholder="输入你的邮箱" class="layui-input">' + 
                    '</div>' + 
                '</div>' +
                '<div class="layui-form-item">' + 
                    '<label class="layui-form-label tea-form-label" >密码</label>' + 
                    '<div class="layui-input-block tea-input-block">' + 
                        '<input type="password" v-model="form.password" name="password" lay-verify="required|pass" placeholder="输入你的密码" autocomplete="off" class="layui-input">' +  
                    '</div>' + 
                '</div>' +
                '<div class="layui-form-item">' + 
                    '<label class="layui-form-label tea-form-label" >重复</label>' + 
                    '<div class="layui-input-block tea-input-block">' + 
                        '<input type="password" v-model="form.repassword" name="password" lay-verify="required|pass" placeholder="再次输入你的密码" autocomplete="off" class="layui-input">' +  
                    '</div>' + 
                '</div>' +
                '<div class="layui-form-item">' + 
                    '<div class="layui-inline">' + 
                        '<label class="layui-form-label tea-form-label ">验证</label>' +
                        '<div class="layui-input-inline" style="margin-left: 12px; width: 164px;">' +
                            '<input type="text" v-model="form.vercode" name="vercode" lay-verify="required|number" autocomplete="off" placeholder="邮箱接收的验证码" class="layui-input">' + 
                        '</div>' + 
                    '</div>' +
                    '<div class="layui-inline" style="margin-right: 0px;">' + 
                        '<button type="button" style="width:106px" class="layui-btn layui-btn-normal" :class="{\'layui-btn-disabled\': countdown < this.maxCount, \'layui-btn-normal\': countdown === this.maxCount}" @click="getVerCode()">{{countdown < this.maxCount ? countdown : \'获取验证码\'}}</button>' +
                    '</div>' +
                '</div>' +
                '<div style="width: 100%;">' + 
                    '<button class="layui-btn layui-btn-fluid layui-btn-normal" lay-submit="" lay-filter="reg"  ><i class="fa fa-registered"></i> 注册</button>' + 
                '</div>' + 
            '</form>' + 
        '</div>' + 
        '<div id="loginPop" class="tea-checkpop-form" v-if="type===\'login\'" >' + 
            '<form id="loginForm" class="layui-form" method="post" action="/passport/local">' +
                '<input type="hidden" name="_csrf" value="" v-model="csrfToken" />' +
                '<div class="layui-form-item">' +
                    '<label class="layui-form-label tea-form-label">邮箱</label>' + 
                    '<div class="layui-input-block tea-input-block">' +
                        '<input type="text" v-model="form.email" name="email" lay-verify="required|email" autocomplete="off" placeholder="输入你的邮箱" class="layui-input">' + 
                    '</div>' + 
                '</div>' +
                '<div class="layui-form-item">' + 
                    '<label class="layui-form-label tea-form-label" >密码</label>' + 
                    '<div class="layui-input-block tea-input-block">' + 
                        '<input type="password" v-model="form.password" name="password" lay-verify="required|pass" placeholder="输入你的密码" autocomplete="off" class="layui-input">' +  
                    '</div>' + 
                '</div>' +
                '<div style="width: 100%">' + 
                    '<button class="layui-btn layui-btn-fluid layui-btn-normal" lay-submit="" lay-filter="login" ><i class="fa fa-user-circle"></i> 登录</button>' + 
                '</div>' + 
                '<div style="width: 100%; text-align:center; height: 40px; line-height: 60px;">' + 
                    '<a href="javascript:void(0);" @click="type=\'forget\'">忘记密码？</a>' + 
                '</div>' + 
            '</form>' + 
        '</div>' + 
        '<div id="forgetPop" v-if="type===\'forget\'" class="tea-checkpop-form" >' + 
            '<form class="layui-form" action="">' +
                '<div class="layui-form-item">' +
                    '<label class="layui-form-label tea-form-label">邮箱</label>' + 
                    '<div class="layui-input-block tea-input-block">' +
                        '<input type="text" v-model="form.email" name="email" lay-verify="required|email" autocomplete="off" placeholder="输入你的邮箱" class="layui-input">' + 
                    '</div>' + 
                '</div>' +
                '<div class="layui-form-item">' + 
                    '<label class="layui-form-label tea-form-label" >密码</label>' + 
                    '<div class="layui-input-block tea-input-block">' + 
                        '<input type="password" v-model="form.password" name="password" lay-verify="required|pass" placeholder="输入你的新密码" autocomplete="off" class="layui-input">' +  
                    '</div>' + 
                '</div>' +
                '<div class="layui-form-item">' + 
                    '<div class="layui-inline">' + 
                        '<label class="layui-form-label tea-form-label ">验证</label>' +
                        '<div class="layui-input-inline" style="margin-left: 12px; width: 164px;">' +
                            '<input type="tel" v-model="form.vercode" name="vercode" lay-verify="required|number" autocomplete="off" placeholder="邮箱接收的验证码" class="layui-input">' + 
                        '</div>' + 
                    '</div>' +
                    '<div class="layui-inline" style="margin-right: 0px;">' + 
                        '<button type="button" style="width:106px" class="layui-btn layui-btn-normal" :class="{\'layui-btn-disabled\': countdown < this.maxCount, \'layui-btn-normal\': countdown === this.maxCount}" @click="getVerCode()">{{countdown < this.maxCount ? countdown : \'获取验证码\'}}</button>' +
                    '</div>' +
                '</div>' +
                '<div style="width: 100%;">' + 
                    '<button class="layui-btn layui-btn-fluid layui-btn-normal" lay-submit="" lay-filter="forget" >立即重置密码</button>' + 
                '</div>' + 
            '</form>' + 
        '</div>' + 
        '<div class="tea-checkpop-foot">' +
            '<div v-if="type===\'reg\' || type===\'forget\'" >已有账号？<a href="javascript:void(0);" @click="type=\'login\'">登录</a></div>' +
            '<div v-if="type===\'login\'" >没有账号？<a href="javascript:void(0);" @click="type=\'reg\'">注册</a></div>' +
        '</div>'
    );
    var layerIndex = 1;
    var checkApp = "";
    var iniVue = function (type) {
        checkApp = new Vue({
            el: ".tea-checkpop",
            data: function () {
                return {
                    isDischarged: false,
                    type: type,
                    countdown: 80,
                    maxCount: 80,
                    csrfToken: $("meta[name='csrf-token']")[0].getAttribute("content"),
                    form: {
                        email: "",
                        password: "",
                        repassword: "",
                        vercode: ""
                    }
                }
            },
            watch: {
                'type': function (val) {
                    switch(val) {
                        case 'reg':
                            layer.title("注册", layerIndex);
                            break;
                        case 'login':
                            layer.title("登陆", layerIndex);
                            break;
                        case 'forget':
                            layer.title("找回密码", layerIndex);
                            break;
                    }
                }
            },
            mounted() {
                var that = this;
                layui.form.on('submit(login)', function(data) {
                    if ( that.isDischarged === false ) {
                        that.login(); //移交给vue处理
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    }
                });
                layui.form.on('submit(reg)', function(data) {
                    that.reg(); //移交给vue处理
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                layui.form.on('submit(forget)', function(data) {
                    that.forget(); //移交给vue处理
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            },
            methods: {
                login: function () {
                    let that = this;
                    $.ajax({
                        url: "/api/v1/user/signin",
                        method: "post",
                        data: {
                            email: this.form.email,
                            password: this.form.password
                        },
                        success: function (res) {
                            if (res.code > 0 ) {
                                layer.msg(res.msg, {icon: 5});
                            } else {
                                that.isDischarged = true;
                                $("button[lay-filter='login']").click();
                            }
                        }
                    });
                },
                reg: function () {
                    var that = this;
                    if (this.form.password !== this.form.repassword) {
                        layer.msg("两次输入的密码不相同", {icon: 5});
                        return;
                    }
                    $.ajax({
                        url: "/api/v1/user/signup",
                        method: "POST",
                        data: {
                            email: this.form.email,
                            password: this.form.password,
                            repassword: this.form.repassword,
                            vercode: this.form.vercode,
                        },
                        success: function (res) {
                            if ( res.code > 0 )  {
                                layer.msg(res.msg, {icon: 5});
                            } else {
                                layer.msg("注册成功，请登陆。", {icon: 1});
                                setTimeout(function () {
                                    that.type = "login";
                                }, 2000);
                            }
                        }
                    });
                },
                forget: function () {

                },
                getVerCode: function () {
                    var that = this;
                    if  ( that.countdown < that.maxCount ) return;
                    if ( !validator.isEmail(this.form.email) ) {
                        layer.msg("邮箱格式不正确", {icon: 5});
                        return;
                    }
                    that.countdown--;
                    var timer = setInterval(function() {
                        that.countdown--;
                        if ( that.countdown <= 0) {
                            window.clearInterval(timer);
                            that.countdown = that.maxCount;
                        }
                    }, 1000);
                    $.ajax({
                        url: "/api/v1/user/get_email_vercode",
                        method: "POST",
                        data: {
                            email: this.form.email
                        },
                        success: function (res) {
                            console.log(res);
                            if ( res.code > 0 )  {
                                layer.msg(res.msg, {icon: 5});
                            } else {
                                layer.msg("验证码已经发送到您的邮箱里了，请查看。", {icon: 1});
                            }
                        }
                    });
                }
            }
        });
    }
    iniVue();

    return {
        show: function (type) {
            $.getScript("/public/layui/bower_components/validator-js/validator.min.js");
            $("body").append(ele);
            iniVue(type);

            var popTitle = type === 'login' ? '登录' : '';
            popTitle = type === 'reg' ? '注册' : popTitle;
            popTitle = type === 'forget' ? '找回密码' : popTitle;

            layerIndex = layer.open({
                title: popTitle,
                maxWidth: 500,
                maxHeight: 500,
                type: 1,
                content: $("#checkPop"),
                cancel: function() {
                    setTimeout(function () {
                        $(".tea-checkpop").remove();
                        checkApp = "";
                    }, 200);
                }
            });
        }
    }
}

});
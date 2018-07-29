$(function () {
    layui.form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
          /^[\S]{8,16}$/
          ,'密码必须8到16位，且不能出现空格'
        ] 
    });

    var installApp = new Vue({ 
        el: ".main",
        data: function() {
            return {
                form: {
                    adminUsername: "user@qq.com",
                    adminPassword: "12345689",
                    emailHost: "smtp.qq.com",
                    emailProtocol: "smtps",
                    emailUsername: "test@qq.com",
                    emailPassword: "123456789",
                    siteTitle: "Teanode",
                    siteDesc: "Teanode 开源论坛社区",
                    siteDomain: "www.teanode.org",
                    sessionSecret: "ddf4tfg"
                }
            }
        },
        mounted() {
            let that = this;
            layui.form.on('submit(installAction)', function(data) {
                that.installAction(); //移交给vue处理
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        },
        methods: {
            installAction: function () {
                $.ajax({
                    url: "/api/v1/install",
                    method: "POST",
                    data: this.form,
                    success: function (res) {
                        if ( res.code > 0) {
                            layer.msg(res.msg, {icon: 5});
                        } else {
                            layer.alert('论坛信息配置成，是否立刻跳转到论坛首页。', 
                            {icon: 1}, 
                            function () {
                                window.location.href = "/";
                            });
                        }
                    }
                });
                //console.log(this.form);
            }
        }
    })
});
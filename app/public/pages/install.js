$(function () {
    layui.form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ] 
    });

    var installApp = new Vue({
        el: ".main",
        data: function() {
            return {
                form: {
                    adminUsername: "",
                    adminPassword: "",
                    emailHost: "",
                    emailPort: "",
                    emailUsername: "",
                    emailPassword: "",
                    siteTitle: "",
                    siteDesc: "",
                    siteDomain: "",
                    sessionSecret: ""
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
                console.log(this.form);
            }
        }
    })
});
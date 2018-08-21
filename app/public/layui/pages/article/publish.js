$(function() {
    var articleEditor = editormd("edit", {
        width   : "100%",
        height  : 640,
        syncScrolling : "single", 
        path    : "/public/layui/bower_components/editor.md/lib/",
        onload: function() {
            this.previewing();
            this.previewing();
        }
    });

    layui.use('form', function() {
        var form = layui.form;
        form.on('submit(artPublishAction)', function(data) {
            console.log(data);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });


    
});
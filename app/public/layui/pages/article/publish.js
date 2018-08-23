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
            var field = data.field;
            delete field['edit-markdown-doc'];
            field.mdContent = articleEditor.getMarkdown();
            console.log(field);
            $.ajax({
                url: "http://127.0.0.1:7001/api/v1/article/publish",
                headers: {'Cookie' : document.cookie },
                method: "post",
                data: field,
                success: function(data) {
                    console.log(data);
                }
            })
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });


    
});
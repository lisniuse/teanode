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
});

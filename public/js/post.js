Main.Post = {
    init: function() {
        document.getElementById("create-post-form").addEventListener("submit", Main.Post.createPostEvent);
    },
    createPostEvent: function(e) {
        e.preventDefault();
        console.log(this);
    }
}
Main.Post = {
    init: function() {
        this.setCreatePostEvent();
    },
    setCreatePostEvent: function() {
        document.getElementById("create-post-form").addEventListener("submit", Main.Post.createPostEvent);
    },
    createPostEvent: function(e) {
        e.preventDefault();
        console.log(this);
    }
}
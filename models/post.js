const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userid: mongoose.Schema.Types.ObjectId,
    content: String,
    imageUrl: String,
    people_liked: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
});

const postModel = mongoose.model('Post', postSchema);

const createPost = async ({ userid, content, imageUrl }) => {
    const post = new postModel({ userid, content, imageUrl });
    return await post.save();
}

const savePostObject = async (post) => {
    return await post.save();
}

const findPostsForGivenUser = async (userid) => {
    return await postModel.find({ userid });
}

const numOfLikes = async (post) => {
    const post = await postModel.findOne(post);
    return post.people_liked.length;

}
module.exports = { createPost, findPostsForGivenUser }
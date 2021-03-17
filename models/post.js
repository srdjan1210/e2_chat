const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userid: mongoose.Schema.Types.ObjectId,
    content: String,
    imageUrl: String,
    people_liked: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
});

const postModel = mongoose.model('Post', postSchema);

const createPost = async ({ userid, content, imageUrl }) => {
    const post = new postModel({ userid, content, imageUrl });
    return await post.save();
}

const savePostObject = async (post) => await post.save();
const findPostsForGivenUser = async (userid) => await postModel.find({ userid });
const findSinglePostById = async (_id, userid) => await postModel.findOne({ _id, userid });
const findPostsByIds = async (postIds, userid) => await postModel.find({_id: { $in: postIds }, userid});
const deletePostById = async (_id, userid) => await postModel.findOneAndRemove({ _id, userid });
const updatePostById = async (_id, userid, update) => await postModel.findOneAndUpdate({ _id, userid}, update);



const numOfLikes = async (post) => {
    const post = await postModel.findOne(post);
    return post.people_liked.length;

}
module.exports = { createPost, findPostsForGivenUser, findSinglePostById, findPostsByIds, deletePostById ,updatePostById }
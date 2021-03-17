const { find } = require('lodash');
const _ = require('lodash')
const { uploadImages } = require('../helpers/firebase-upload');
const { findPostsForGivenUser, findPostsByIds, findSinglePostById } = require('../models/post');

const createPost = async (req, res) => {
    const userid = req.payload._id;
    const content = req.body.content;
    
}   

const getAllPostsForUser = async (req, res) => {
    const userid = req.payload._id;
    const posts = await findPostsForGivenUser(userid);
    if(posts == []) return res.status(404).send([]);
    return res.status(200).send({ posts });
}

const getMultiplePosts = async (req, res) => {
    const postIds = req.body.postIds;
    const userid = req.payload._id;
    const posts = await findPostsByIds(postIds, userid);
    if(posts == []) return res.status(404).send([]);
    return res.status(200).send(posts);
}


const getSinglePost = async (req, res) => {
    const userid = req.payload._id;
    const _id = req.body._id;
    const post = await findSinglePostById(_id, userid);
    if(!post) return res.status(404).send({});
    return res.status(200).send(post); 
}

const deletePost = async (req, res) => {
    const userid = req.payload._id;
    const _id = req.body._id;
    const deleted = await deletePostById(_id, userid);
    if(!deleted) return res.status(404).send({ err: 'User or post not found!'});
    return res.status(200).send({ msg: 'Post succesfully deleted!'});
}

const updatePost = async (req, res) => {
    const userid = req.payload._id;
    const { _id, update } = req.body;
    const updated = await updatePost(_id, userid, update);
    if(!updated) return res.status(404).send({ err: 'User or post not found!'});
    return res.status(200).send({ msg: 'Sucessfully updated post!'});
}


module.exports = { createPost, getAllPostsForUser, getSinglePost, getMultiplePost, deletePost, updatePost}
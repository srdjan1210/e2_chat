const _ = require('lodash')
const { uploadImages } = require('../helpers/firebase-upload');

const createPost = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    
}   
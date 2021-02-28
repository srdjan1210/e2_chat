const {Storage} = require('@google-cloud/storage');
const path = require('path')
const storage = new Storage();
const bucket = storage.bucket('e2chat.appspot.com')




const getImageUrl = async (name) => {
    const file = bucket.file(`profileimgs/${name}.png`)
    const signedUrls = await file.getSignedUrl({
        action:'read',
        expires: '03-09-2491'
    });
    return signedUrls;
}


const uploadImages = async (names) => {
    return names.forEach(name => {
            bucket.upload(path.join(__dirname, `../public/resources/profileimgs/${name}.png`), {
                destination: `profileimgs/${name}.png`,
                metadata: {
                    cacheControl: "public, max-age=315360000",
                    contentType: "image/png"
                }
            })
    });
}

module.exports = { getImageUrl, uploadImages }
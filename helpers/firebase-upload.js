const {Storage} = require('@google-cloud/storage');
const path = require('path')
const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET);

const getImageUrl = async (name) => {
    const file = bucket.file(`profileimgs/${name}.png`)
    const signedUrls = await file.getSignedUrl({
        action:'read',
        expires: '03-09-2491'
    });
    return signedUrls;
}


const uploadImages = async (names) => {
    for(let name of names) {
        await bucket.upload(path.join(__dirname, `../public/uploads/imgs/${name}.png`), {
            destination: `profileimgs/${name}.png`,
            metadata: {
                cacheControl: "public,max-age:10,s-maxage:10",
                contentType: "image/png"
            }
        });
    }
}

const uplaodPostImages = async (names) => {
    for(let name of names) {
        await bucket.upload(path.join(__dirname, `../public/uploads/imgs/${name}.png`), {
            destination: `profileimgs/${name}.png`,
            metadata: {
                cacheControl: "public,max-age:10,s-maxage:10",
                contentType: "image/png"
            }
        });
    }
}
module.exports = { getImageUrl, uploadImages }
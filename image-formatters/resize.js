const fs = require('fs').promises;
const resizeimg = require('resize-img');
const path = require('path');

const resizeProfileImage = async (username) => {
    const image100 = await resizeimg(await fs.readFile(path.join(__dirname, `../public/uploads/imgs/${username}.png`)),{
        width: 200,
        height: 160
    });
    const image500 = await resizeimg(await fs.readFile(path.join(__dirname, `../public/uploads/imgs/${username}.png`)),{
        width: 500,
        height: 400
    });

    fs.writeFile(path.join(__dirname, `../public/resources/profileimgs/${username}_100.png`), image100);
    fs.writeFile(path.join(__dirname, `../public/resources/profileimgs/${username}_500.png`), image500);
}

module.exports = { resizeProfileImage }
const fs = require('fs').promises;
const resizeimg = require('resize-img');
const path = require('path');

const resizeProfileImage = async (username) => {
    const image100 = await resizeimg(await fs.readFile(path.join(__dirname, `../public/uploads/imgs/${username}.png`)),{
        width: 160,
        height: 200
    });
    const image500 = await resizeimg(await fs.readFile(path.join(__dirname, `../public/uploads/imgs/${username}.png`)),{
        width: 300,
        height: 280
    });

    fs.writeFile(path.join(__dirname, `../public/resources/profileimgs/${username}_100.png`), image100);
    fs.writeFile(path.join(__dirname, `../public/resources/profileimgs/${username}_500.png`), image500);
}

module.exports = { resizeProfileImage }
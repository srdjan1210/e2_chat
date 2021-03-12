const fs = require('fs').promises;
const resizeimg = require('resize-img');
const path = require('path');

const resizeProfileImage = async (username) => {
    const image100 = await resizeimg(await fs.readFile(path.join(__dirname, `../public/uploads/imgs/${username}.png`)),{
        width: 100,
        height: 100
    });
    const image300 = await resizeimg(await fs.readFile(path.join(__dirname, `../public/uploads/imgs/${username}.png`)),{
        width: 300,
        height: 300
    });

    await fs.writeFile(path.join(__dirname, `../public/uploads/imgs/${username}_100.png`), image100);
    await fs.writeFile(path.join(__dirname, `../public/uploads/imgs/${username}_300.png`), image300);

    return [`${username}_100`, `${username}_300`];
}

module.exports = { resizeProfileImage }
const bcrypt = require('bcrypt');


const hashPassword = async (password) => {
    console.log(password);
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const verifyPassword = async (providedPassword, hashedPassword) => {
    return await bcrypt.compare(providedPassword, hashedPassword);
}

module.exports = { hashPassword, verifyPassword }
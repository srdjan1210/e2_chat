
trimUserData = (user) => {
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.username = user.username.trim();
}


module.exports = { trimUserData };

const trimUserData = (user) => {
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.username = user.username.trim();
}

const escapeltgt = (message) => {
    return message.replace(/</g, '&lt').replace('/>/g', '&gt');
}


module.exports = { trimUserData, escapeltgt }
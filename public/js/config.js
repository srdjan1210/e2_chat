const RELEASE = false;

let jsConfig = {
    defaultSection: ["home", "feed"],
    defaultUrl: "#/home/feed",
    maxChatWindows: 3,
    domainUrl: ""
}

function setUrl(c) {
    if (c) {
        jsConfig.domainUrl = "https://still-wildwood-26564.herokuapp.com";
    } else {
        jsConfig.domainUrl = "http://localhost:3000";
    }
}

setUrl(RELEASE);

const RELEASE = true;

let jsConfig = {
    defaultSection: ["home", "feed"],
    defaultUrl: "#/home/feed",
    maxChatWindows: 3,
    domainUrl: ""
}

if (RELEASE) {
    jsConfig.domainUrl = "https://still-wildwood-26564.herokuapp.com";
} else {
    jsConfig.domainUrl = "http://localhost:3000";
}
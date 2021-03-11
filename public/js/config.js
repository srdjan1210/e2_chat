const RELEASE = false;

let jsConfig = {
    defaultSection: ["home", "feed"],
    defaultUrl: "#/home/feed",
    maxChatWindows: 3,
    domainUrl: ""
}

if (RELEASE) {
    jsConfig.domainUrl = "https://e2chat.herokuapp.com";
} else {
    jsConfig.domainUrl = "http://localhost:3000";
}
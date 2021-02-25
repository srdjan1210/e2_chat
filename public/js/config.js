const RELEASE = false;

let jsConfig = {
    defaultSection: ["home", "feed"],
    defaultUrl: "#/home/feed",
    maxChatWindows: 3,
    domainUrl: ""
}

function setUrl(c) {
    if (c) {
        jsConfig.domainUrl = "UBACI URL I PROMIJENI RELEASE U TRUE";
    } else {
        jsConfig.domainUrl = "http://localhost:3000";
    }
}

setUrl(RELEASE);
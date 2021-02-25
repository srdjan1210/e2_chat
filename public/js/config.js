const RELEASE = false;

let jsConfig = {
    defaultSection: ["home", "feed"],
    defaultUrl: "#/home/feed",
    maxChatWindows: 3,
<<<<<<< HEAD
    domainUrl:"https://still-wildwood-26564.herokuapp.com" 
}
=======
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
>>>>>>> 5ead0aff5da1f6ec128d46e9a11dc2652a26f870

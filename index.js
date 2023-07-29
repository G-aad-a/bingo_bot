global.rootDir = __dirname
process.noDeprecation = true;
const fs = require("fs");
const defaultData = {
    "bingoRunning": false,
    "participants": [],
    "chosenNumbers": []
}
fs.writeFileSync("./src/data.json", JSON.stringify(defaultData, null, 2), {flag:"w+"})

const client = require("./src/client");
const config = require("./config");
new client(config).login();
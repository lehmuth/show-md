var copyfiles = require('copyfiles');

let filesFromSource = [
    "src/config/default.json",
    "src/public/*",
    "src/public/**/*",
    "build"
];
    
copyfiles(filesFromSource, {"up": 1, "verbose": true}, (err) => console.log(err));
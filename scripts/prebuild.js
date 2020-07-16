var copyfiles = require('copyfiles');

let filesGallery = [
    "node_modules/lightgallery.js/dist/js/lightgallery.min.js",
    "node_modules/lightgallery.js/dist/css/lightgallery.min.css",
    "node_modules/lightgallery.js/dist/img/*",
    "node_modules/lightgallery.js/dist/fonts/*",
    "src/public"
];

let filesGalleryModules = [
    "node_modules/lg-fullscreen.js/dist/lg-fullscreen.min.js",
    "node_modules/lg-thumbnail.js/dist/lg-thumbnail.min.js",
    "node_modules/lg-zoom.js/dist/lg-zoom.min.js",
    "src/public/js"
]

copyfiles(filesGallery, {"up": 3, "verbose": true}, (err) => console.log(err));
copyfiles(filesGalleryModules, {"up": 3, "verbose": true}, (err) => console.log(err));
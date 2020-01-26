"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./src/app");
__export(require("./src/config"));
__export(require("./src/md_parser"));
__export(require("./src/server"));
__export(require("./src/app"));
__export(require("./src/cmd_parser"));
function getDefaultApp() { return new app_1.ShowMdApp(); }
exports.getDefaultApp = getDefaultApp;

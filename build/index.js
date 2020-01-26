"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./show-md/app");
__export(require("./show-md/config"));
__export(require("./show-md/md_parser"));
__export(require("./show-md/server"));
__export(require("./show-md/app"));
__export(require("./show-md/cmd_parser"));
function getDefaultApp() { return new app_1.ShowMdApp(); }
exports.getDefaultApp = getDefaultApp;

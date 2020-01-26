#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//laoding default app
var index_1 = require("../index");
var app = index_1.getDefaultApp();
//init logging
var path = require('path');
var logPath = path.join(__dirname, "../../logs/system.log");
var log = require('simple-node-logger').createSimpleLogger(logPath);
log.setLevel("all");
//loading command parser
var cmdParser = new index_1.ShowMdCmdParser(app);
cmdParser.on('warning', function (msg) { log.warn(msg); });
cmdParser.on('error', function (msg) { log.error(msg); });
cmdParser.on('info', function (msg) { log.info(msg); });
//init Server
app.on('warning', function (msg) { log.warn(msg); });
app.on('error', function (msg) { log.error(msg); });
app.on('started', function () { log.info("Server started on http://localhost:" + app.config.getPort()); });
app.on('stoped', function () { log.info("Server stoped."); });
//Init input stream
var input = process.stdin;
input.setEncoding('utf-8');
input.on('data', function (data) {
    var dataString = data.toString();
    dataString = dataString.replace(/(\r|\n)/g, '');
    cmdParser.parse(dataString.split(' '));
});
//parse initial command
cmdParser.parse(process.argv.slice(2));

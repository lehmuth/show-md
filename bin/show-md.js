#!/usr/bin/env node
//loading and parsing arguments
const showmd = require('../index.js');
const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2));
console.log(argv);
if(argv._[0] !== undefined){

}
//old argument parser
const attrHandler = require('../src/attr_handler.js');
var args = process.argv.slice(2);
attrHandler.parseArguments(args, showmd);

//init logging
const path = require('path');
var logPath = path.join(__dirname, "../logs/system.log");
const log = require('simple-node-logger').createSimpleLogger(logPath);
//log.setLevel("all");

log.debug("Configuration loaded:");
log.debug("Current root directory: " + showmd.config.getRootPath());
log.debug("htdocs directory: " + showmd.config.getHtdocs());
log.debug("Current language: " + showmd.config.getLanguage());
log.debug("Current stylesheet: " + showmd.config.getStylesheet());
log.debug("Current Port: " + showmd.config.getPort());
log.debug("Current http log path: " + showmd.config.getHttpLogPath());
log.debug("Current system log path: " + logPath);

//init command listener
const cmdHandler = require('../src/cmd_handler.js')(showmd);
cmdHandler.start();

//init Server
showmd.on('warning', (msg) => {log.warn(msg);});
showmd.on('error', (msg) => {log.error(msg);});
showmd.on('started', () => {log.info("Server started on http://localhost:" + showmd.config.getPort());});
showmd.on('stoped', () => {log.info("Server stoped.");});

//start Server
log.debug("Starting server...");
showmd.start();

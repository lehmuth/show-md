#!/usr/bin/env node
const ShowmdServer = require('../index.js');
const showmd = new ShowmdServer();
//showmd.  log.setLevel("all");
showmd.config.on('warning', function(msg){
  showmd.log.warn(msg);
});

showmd.start();

showmd.log.info("Server starting...");
showmd.log.info("loading configuration...");
const attrHandler = require('../src/attr_handler.js');
var args = process.argv.slice(2);
attrHandler.parseArguments(args, showmd);
showmd.log.debug("Configuration loaded:");
showmd.log.debug("Current root directory: " + showmd.config.getRootPath());
showmd.log.debug("htdocs directory: " + showmd.config.getHtdocs());
showmd.log.debug("Current language: " + showmd.config.getLanguage());
showmd.log.debug("Current stylesheet: " + showmd.config.getStylesheet());
showmd.log.debug("Current Port: " + showmd.config.getPort());
showmd.log.debug("Current http log path: " + showmd.config.getHttpLogPath());
showmd.log.debug("Current system log path: " + showmd.config.getLogPath());
showmd.log.info("Server ready on http://localhost:" + showmd.config.getPort());


const cmdHandler = require('../src/cmd_handler.js')(showmd);
cmdHandler.start();

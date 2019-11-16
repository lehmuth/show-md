#!/usr/bin/env node
const ShowmdServer = require('../index.js');
const log = require('../src/log.js');
const showmd = new ShowmdServer();
showmd.config.on('warning', function(msg){
  log.warning(msg);
});

showmd.start();

log.success("Server starting...");
log.success("loading configuration...");
const attrHandler = require('../src/attr_handler.js');
var args = process.argv.slice(2);
attrHandler.parseArguments(args, showmd.config);
log.info("configuration loaded");

showmd.initCommandHandler();

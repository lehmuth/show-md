//get app root dir
const log = require('./lib/log.js');
log.info("Server starting...");
log.info("loding configuration...");
const config = require('./lib/config.js')(__dirname);
const attrHandler = require('./lib/attr_handler.js');
var args = process.argv.slice(2);
attrHandler.parseArguments(args, config);
log.info("configuration loaded");
const server = require('./lib/server.js')(config);
server.listen();
log.success("Server started. Ready for requests \n");

const cmdHandler = require('./lib/cmd_handler.js')(config);
//start input Loop
cmdHandler.start();

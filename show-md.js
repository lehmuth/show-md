//get app root dir
module.exports = {
  run: function(args){
    const log = require('./lib/log.js');
    log.success("Server starting...");
    log.success("loading configuration...");
    const config = require('./lib/config.js')(__dirname);
    const attrHandler = require('./lib/attr_handler.js');
    attrHandler.parseArguments(args, config);
    log.info("configuration loaded");
    const server = require('./lib/server.js')(config);
    server.listen();
    log.success("Server started.");
    log.success("Listening on: http://localhost:" + config.getPort());

    const cmdHandler = require('./lib/cmd_handler.js')(config);
    //start input Loop
    cmdHandler.start();
  }
}

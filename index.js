//get app root dir
module.exports = {
  run: function(args){
    const log = require('./src/log.js');
    log.success("Server starting...");
    log.success("loading configuration...");
    const config = require('./src/config.js');
    const attrHandler = require('./src/attr_handler.js');
    attrHandler.parseArguments(args, config);
    log.info("configuration loaded");
    const server = require('./src/server.js')(config);
    server.listen();
    log.success("Server started.");
    log.success("Listening on: http://localhost:" + config.getPort());

    const cmdHandler = require('./src/cmd_handler.js')(config);
    //start input Loop
    cmdHandler.start();
  }
}

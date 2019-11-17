//get app root dir
module.exports = function(){
  var server;
  var config = require('./src/config.js');
  var log = require('simple-node-logger').createSimpleLogger(config.getLogPath());
  return {
    config: config,
    start: function(){
      server = require('./src/server.js')(config);
      server.listen();
    },
    log: log,
    stop: function(){
      if(server != undefined && server.listening)
        server.stop();
      else
        throw new Error('Server not running!');
    }
  }
}

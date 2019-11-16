//get app root dir
module.exports = function(){
  var server;
  return {
    config: require('./src/config.js'),
    start: function(){
      server = require('./src/server.js')(this.config);
      server.listen();
    },
    stop: function(){
      if(server != undefined)
        server.stop();
      else
        throw new Error('Server not running!');
    },
    initCommandHandler: function(){
      const cmdHandler = require('./src/cmd_handler.js')(this.config);
      cmdHandler.start();
    }
  }
}

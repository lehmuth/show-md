const EventEmitter = require('events');

/**
 * A server class which consists of a HTTP server and a configuration.
 */
class ShowMdServer extends EventEmitter{

  /**
   * Init new ShowMdServer
   */
  constructor(){
    super();
    this.config  = require('./src/config.js');;
    this.config.on('warning', (msg) => {this.emit('warning', msg);});
    this.server = require('./src/server.js')(this.config);
  }

  start(){
    try{
      this.server.listen();
      this.emit("started");
    }catch(err){
      this.emit('error', err);
    }
  }

  stop(){
    if(server != undefined && server.listening){
      this.server.stop();
      this.emit("stoped");
    }else{
      this.emit('error', 'Trying to shut down server, but server not running!');
    }
  }

  isListening(){
    return this.server.listening;
  }

}

module.exports = ShowMdServer;

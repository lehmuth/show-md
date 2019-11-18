const EventEmitter = require('events');
const ShowMdServer = require('./src/server.js');

/**
 * A server class which consists of a HTTP server and a configuration.
 */
class ShowMd extends EventEmitter{

  /**
   * Init new ShowMdServer.
   */
  constructor(){
    super();
    this.config  = require('./src/config.js');
    this.config.on('warning', (msg) => {this.emit('warning', msg);});
    this.server = new ShowMdServer(this.config);
  }

  /**
   * Server starts listening, event "started" is emitted.
   */
  start(){
    try{
      this.server.listen();
      this.emit("started");
    }catch(err){
      this.emit('error', err);
    }
  }

  /**
   * Server stops listening, event "stoped" is emitted.
   */
  stop(){
    if(this.server != undefined && this.server.isListening()){
      this.server.close();
      this.emit("stoped");
    }else{
      this.emit('error', 'Trying to shut down server, but server not running!');
    }
  }

  isRunning(){
    return this.server.isListening();
  }



}

module.exports = new ShowMd();
module.exports.ShowMdServer = ShowMdServer;

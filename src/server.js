const EventEmitter = require('events');
const Parser = require('./parser.js');
const LogFactory = require('simple-node-logger');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
var config, parser, httpServer, log, opts = {
  timestampFormat:'[YYYY-MM-DD HH:mm:ss]'
};;

class ShowMdServer extends EventEmitter{
  constructor(_config){
    super();
    config = (_config === undefined) ? require('./config.js') : _config;
    log = (log === undefined) ? LogFactory.createSimpleFileLogger(config.getHttpLogPath()) : log;
    parser = new Parser(config);
    httpServer = http.createServer();
    httpServer.on('request', handleRequest);
    httpServer.on('clientError', (err, socket) => {
    	socket.end('HTTP/1.1 400 Bad Request');
    });
  }
  listen(){
    httpServer.listen(config.getPort());
  }
  close(){
    httpServer.close();
  }
  isListening(){
    return httpServer.listening;
  }
}

function handleRequest(req, res){
  //get path to file
  var href = url.parse(req.url, true).path;
  log.info("REQUEST:  " + href);

  var filename = path.join(config.getRootPath(), href);
  if(filename.indexOf(config.getRootPath()) !== 0) {
    return sendError(403);
  }
  try {
    var stat = fs.statSync(filename);
    if(stat.isDirectory()){
      //Check default file
      stat = fs.statSync(path.join(filename, "README.md"));
      //setze pfad wenn standard-datei existiert
      if(stat.isFile())
        filename = path.join(filename, "README.md");
    }
  } catch (e) {
    //Exception in case of the file does not exist
    //Check htdocs directory
    if(href.match(/^\/favicon\.ico$/))
      href = '/resources/icons/favicon.ico';
    filename = path.join(config.getHtdocs(), href);
    if(filename.indexOf(config.getHtdocs()) !== 0) {
      return sendError(403);
    }
    try {
      var stat = fs.statSync(filename);
      if(stat.isDirectory()){
        //Check default file
        stat = fs.statSync(path.join(filename, "README.md"));
        //setze pfad wenn standard-datei existiert
        if(stat.isFile())
          filename = path.join(filename, "README.md");
      }
    } catch (e) {
      //Exception in case of the file does not exist
      return sendError(404);
    }
  }
  /** Check file extension for allowed file types */
  //Check whether requested file is a markdown file
  if(filename.match(/(.*\.md$)/i)){
    var data = fs.readFileSync(filename, "utf-8");
    res.writeHead(200, {'Content-Type': 'text/html'});
    parser.setFilePath(filename);
    res.end(parser.mdToHtml(data));
    log.info("RETURNED: " + filename);
  }
  //Check whether requested file is an image or js file
  else if(filename.match(/(.*\.(jpg|png|gif|ico|ttf)$)/i)){
    var data = fs.readFileSync(filename);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data, 'binary');
    log.info("RETURNED: " + filename);
  }
  //Check wheather requested file is a css file
  else if(filename.match(/(.*\.css$|.*\.js$)/i)){
    var data = fs.readFileSync(filename, 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end(data);
    log.info("RETURNED: " + filename);
  }
  //Other file extensions are forbidden
  else if(filename.match(/(.*\..*$)/i)){
    return sendError(403);
  }
}

function sendError(res, errorCode){
  var errorpath = path.join(config.getHtdocs(), "error/error" + errorCode + ".md");
  var data = fs.readFileSync(errorpath, 'utf-8')
  res.writeHead(Number(errorCode), {'Content-Type': 'text/html'});
  res.end(parser.mdToHtml(data));
  log.info("ERROR " + errorCode + ": " + filename);
}

module.exports = ShowMdServer;

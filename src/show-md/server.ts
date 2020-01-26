import { EventEmitter } from 'events';
import { ShowMdConfig } from './config.js';
import { ShowMdParser } from './md_parser.js';
const LogFactory = require('simple-node-logger');
import http, { Server, ServerResponse, IncomingMessage } from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';
let config: ShowMdConfig, parser: ShowMdParser, httpServer: Server, log: any, opts = {
  timestampFormat:'[YYYY-MM-DD HH:mm:ss]'
};;

export class ShowMdServer extends EventEmitter{
  constructor(_config?: ShowMdConfig, _parser?: ShowMdParser){
    super();
    config = _config ?? new ShowMdConfig();
    log = (log === undefined) ? LogFactory.createSimpleFileLogger(config.getHttpLogPath()) : log;
    parser = _parser ?? new ShowMdParser(config);
    httpServer = http.createServer();
    httpServer.on('request', handleRequest);
    httpServer.on('clientError', (err, socket) => {
    	socket.end('HTTP/1.1 400 Bad Request');
    });
  }
  listen(): void{
    httpServer.listen(config.getPort());
  }
  close(): void{
    httpServer.close();
  }
  isListening(): boolean{
    return httpServer.listening;
  }
}

function handleRequest(req: IncomingMessage, res: ServerResponse): void{
  //get path to file
  let requestUrl = req.url ?? '';
  let href = url.parse(requestUrl, true).path;
  log.info("REQUEST:  " + href);

  if(!href){
    log.info("ERROR No url specified.");
    return;
  }

  let filename = path.join(config.getRootPath(), href);
  if(filename.indexOf(config.getRootPath()) !== 0) {
    return sendError(res, 403);
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
      return sendError(res, 403);
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
      return sendError(res, 404);
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
    var data = fs.readFileSync(filename, "binary");
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
    return sendError(res, 403);
  }

  function sendError(res: ServerResponse, errorCode: number): void{
    let errorpath = path.join(config.getHtdocs(), "error/error" + errorCode + ".md");
    let data = fs.readFileSync(errorpath, 'utf-8')
    res.writeHead(Number(errorCode), {'Content-Type': 'text/html'});
    res.end(parser.mdToHtml(data));
    log.info("ERROR " + errorCode + ": " + filename);
  }
}

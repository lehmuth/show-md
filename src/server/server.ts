import { EventEmitter } from 'events';
import { ShowMdConfig } from '../config/config';
import { ShowMdParser } from '../md-parser/md_parser';
import http, { Server, ServerResponse, IncomingMessage } from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';

export class ShowMdServer extends EventEmitter{
  config: ShowMdConfig;
  parser: ShowMdParser;
  httpServer: Server;
  constructor(config?: ShowMdConfig, parser?: ShowMdParser){
    super();
    this.config = config ?? new ShowMdConfig();
    this.parser = parser ?? new ShowMdParser(this.config);
    this.httpServer = http.createServer();
    this.httpServer.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request');
    });
    this.httpServer.on('request', (req: IncomingMessage, res: ServerResponse) => {
      //get path to file
      let requestUrl = req.url ?? '';
      let href = url.parse(requestUrl, true).path;
      this.emit("info", "REQUEST:  " + href);
    
      if(!href){
        this.emit("error", "ERROR: No url specified.");
        return;
      }
    
      let filename = path.join(this.config?.getRootPath(), href);
      if(filename.indexOf(this.config?.getRootPath()) !== 0) {
        return this.sendError(res, 403, filename);
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
        filename = path.join(this.config.getHtdocs(), href);
        if(filename.indexOf(this.config.getHtdocs()) !== 0) {
          return this.sendError(res, 403, filename);
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
          return this.sendError(res, 404, filename);
        }
      }
      /** Check file extension for allowed file types */
      //Check whether requested file is a markdown file
      if(filename.match(/(.*\.md$)/i)){
        var data = fs.readFileSync(filename, "utf-8");
        res.writeHead(200, {'Content-Type': 'text/html'});
        this.parser.setFilePath(filename);
        res.end(this.parser.mdToHtml(data));
        this.emit("info", "RETURNED: " + filename);
      }
      //Check whether requested file is an image or js file
      else if(filename.match(/(.*\.(jpg|png|gif|ico|ttf)$)/i)){
        var data = fs.readFileSync(filename, "binary");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data, 'binary');
        this.emit("info", "RETURNED: " + filename);
      }
      //Check wheather requested file is a css file
      else if(filename.match(/(.*\.css$|.*\.js$)/i)){
        var data = fs.readFileSync(filename, 'utf-8');
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(data);
        this.emit("info", "RETURNED: " + filename);
      }
      //Other file extensions are forbidden
      else if(filename.match(/(.*\..*$)/i)){
        return this.sendError(res, 403, filename);
      }
    });
  }
  listen(): void{
    this.httpServer.listen(this.config.getPort());
  }
  close(): void{
    this.httpServer.close();
  }
  isListening(): boolean{
    return this.httpServer.listening;
  }

  sendError(res: ServerResponse, errorCode: number, filename: string): void{
    let errorpath = path.join(this.config.getHtdocs(), "error/error" + errorCode + ".md");
    let data = fs.readFileSync(errorpath, 'utf-8')
    res.writeHead(Number(errorCode), {'Content-Type': 'text/html'});
    res.end(this.parser.mdToHtml(data));
    this.emit("error", "ERROR " + errorCode + ": " + filename);
  }
}
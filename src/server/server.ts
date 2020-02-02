import { EventEmitter } from 'events';
import { ShowMdConfig } from '../config/config';
import { ShowMdParser } from '../md-parser/md_parser';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response } from 'express';
import { setUpDirectoryRouter } from './routers/directory-router';
import { setUpDefaultRouter } from './routers/default-router';

export class ShowMdServer extends EventEmitter{
  config: ShowMdConfig;
  parser: ShowMdParser;
  httpServer: HttpServer;
  httpsServer: HttpsServer;
  constructor(config?: ShowMdConfig, parser?: ShowMdParser){
    super();
    this.config = config ?? new ShowMdConfig();
    this.parser = parser ?? new ShowMdParser(this.config);
    let exp: Express = express();
    for(let dir of this.config.getHtDirs()) {
      exp.use(setUpDirectoryRouter(this, dir));
    }
    exp.use(setUpDefaultRouter(this));
    this.httpServer = new HttpServer(exp);
    this.httpsServer = new HttpsServer(exp);
  }
  listen(): void{
    this.httpServer.listen(this.config.getPort(), () => {
      this.emit('started', 'Server listening on http://localhost:' + this.config.getPort());
    });
    //TODO start https
  }
  close(): void{
    this.httpServer.close((err?: Error | undefined) => {

    });
    //TODO stop https
  }
  isListening(): boolean{
    return this.httpServer.listening;
  }

  sendError(res: Response, errorCode: number, filename: string): void{
    let errorpath = path.join(this.config.getHtdocs(), "error/error" + errorCode + ".md");
    let data = fs.readFileSync(errorpath, 'utf-8')
    res.status(Number(errorCode)).send(this.parser.mdToHtml(data));
    this.emit("error", "ERROR " + errorCode + ": " + filename);
  }

  getConfig(): ShowMdConfig {
    return this.config;
  }

  getParser(): ShowMdParser {
    return this.parser;
  }
}
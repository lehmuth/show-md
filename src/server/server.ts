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
  close(): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      this.httpServer.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    //TODO stop https
  }
  isListening(): boolean{
    return this.httpServer.listening;
  }

  getConfig(): ShowMdConfig {
    return this.config;
  }

  getParser(): ShowMdParser {
    return this.parser;
  }
}
'use strict'

import { EventEmitter } from 'events';
import { ShowMdConfig } from './config/config';
import  {ShowMdServer } from './server/server';
import { ShowMdParser } from './md-parser/md_parser';

/**
 * A server class which consists of a HTTP server and a configuration.
 */
export class ShowMdApp extends EventEmitter {
  config: ShowMdConfig;
  parser: ShowMdParser;
  server: ShowMdServer;
  /**
   * Init new ShowMdServer.
   */
  constructor (config?: ShowMdConfig) {
    super()
    // Setup config
    if (config) 
      this.config = config;
    else
      this.config = new ShowMdConfig();
     
    this.config.on('warning', (msg: string) => { this.emit('warning', msg) });

    this.parser = new ShowMdParser(this.config);
    this.server = new ShowMdServer(this.config, this.parser);
    this.server.on('info', (msg: string) => { this.emit('http-info', msg) });
    this.server.on('error', (msg: string) => { this.emit('http-error', msg) });
  }

  /**
   * Server starts listening, event "started" is emitted.
   */
  start (): void {
    try {
      this.server.listen()
      this.emit('started')
    } catch (err) {
      this.emit('error', err)
    }
  }

  /**
   * Server stops listening, event "stoped" is emitted.
   */
  stop (): void {
    if (this.server !== undefined && this.server.isListening()) {
      this.server.close()
      this.emit('stoped')
    } else {
      this.emit('error', 'Trying to shut down server, but server not running!')
    }
  }

  isRunning (): boolean {
    return this.server.isListening()
  }

  parseIncludes (path: string): boolean {
    // TODO
    return false;
  }

  parse (inputPath: string, outputPath: string): boolean {
    // TODO
    return false;
  }
}

export * from './config/config';
export * from './md-parser/md_parser';
export * from './server/server';
export * from './app';
export * from './cmd-parser/cmd_parser';

export function getDefaultApp() {
  return new ShowMdApp();
}

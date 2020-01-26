import path from 'path';
import { EventEmitter } from 'events';
import fs from 'fs';

export class ShowMdConfig extends EventEmitter {
  htdocs: string;
  rootPath: string;
  language: string;
  stylesheetName: string;
  port: number;
  httpLogPath: string;
  includeExtensions: string[];

  constructor(){
    super();
    this.htdocs = path.join(__dirname, '../../htdocs');
    this.rootPath = process.cwd();
    this.language = 'en';
    this.stylesheetName = 'github';
    this.port = 56657;
    this.httpLogPath = path.join(__dirname, '../../logs/http.log');
    this.includeExtensions = ['.html', '.md', '.txt'];
  }
  
  setHtdocs (htdocs: string): ShowMdConfig {
    this.htdocs = path.resolve(htdocs)
    return this;
  }

  getHtdocs (): string {
    return this.htdocs;
  }

  setRootPath (rootPath: string): ShowMdConfig {
    this.rootPath = path.resolve(rootPath);
    return this;
  }

  getRootPath (): string {
    return this.rootPath;
  }

  setLanguage (language: string): ShowMdConfig {
    this.language = language;
    return this;
  }

  getLanguage (): string {
    return this.language;
  }

  setStylesheet (stylesheet: string): ShowMdConfig {
    this.stylesheetName = stylesheet;
    return this;
  }

  getStylesheet (): string {
    return this.stylesheetName;
  }

  getStylesheetPath (): string {
    let stylesheet: string = this.getStylesheet();
    if(stylesheet === 'none')
      return '/resources/style/none.css';
    if(stylesheet === 'default')
      return '/resources/style/default.css';
    if(stylesheet === 'github')
      return '/resources/style/github.css';
    if(stylesheet.match(/\.(css|CSS)$/)){
        let filename: string = path.resolve(this.getRootPath() + stylesheet);
        try {
          // Check whether stylesheet is a file
          let stat: fs.Stats = fs.statSync(filename);
          if (stat.isFile()) { 
            return path.relative(this.getRootPath(), filename) ;
          }
        } catch (e) {
          this.emit('warning', 'The currently specified stylesheet does not exist. Fallback to default was performed.');
        }
    }
    this.emit('warning', 'The currently specified stylesheet is not a stylesheet. Fallback to default was performed.');
    return '/resources/style/default.css';
  }

  setPort (port: number): ShowMdConfig {
    this.port = port;
    return this;
  }

  getPort (): number {
    return this.port;
  }

  setHttpLogPath (httpLogPath: string): ShowMdConfig {
    this.httpLogPath = path.resolve(httpLogPath);
    return this;
  }

  getHttpLogPath (): string {
    return this.httpLogPath;
  }

  setIncludeExtensions (includeExtensions: string[]): ShowMdConfig {
    this.includeExtensions = includeExtensions;
    return this;
  }

  addIncludeExtension (extension: string): ShowMdConfig {
    this.includeExtensions.push(extension);
    return this;
  }

  getIncludeExtensions (): string[] {
    return this.includeExtensions;
  }
};

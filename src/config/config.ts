import path from 'path';
import { EventEmitter } from 'events';
import fs from 'fs';

export class ShowMdConfig extends EventEmitter {
  language: string;
  stylesheetName: string;
  stylesheets: [string, string][];
  port: number;
  includeExtensions: string[];
  pathVariables: [string, string][];
  htDirs: string[];
  defaultFile: string;

  constructor(){
    super();
    this.language = 'en';
    this.stylesheetName = 'github';
    this.port = 56657;
    this.includeExtensions = ['.html', '.md', '.txt'];
    this.stylesheets = [
      ["default", "{APP_ROOT}/build/public/default.css"],
      ["github", "{APP_ROOT}/libs/github.css"],
      ["none", "{APP_ROOT}/build/public/none.css"]
    ];
    this.pathVariables = [
      ["APP_ROOT", path.resolve(__dirname, '../../')],
      ["HTDOCS", path.resolve(__dirname, '../../htdocs')],
      ["SERVER_ROOT", path.resolve(process.cwd())],
      ["LOG", path.resolve(__dirname, '../../logs')]
    ];
    this.htDirs = [
      "{SERVER_ROOT}",
      "{HTDOCS}"
    ];
    this.defaultFile = "README.md";
  }

  getPath (id: string): string{
    for(let pathTouple of this.pathVariables) {
      if(pathTouple[0] === id){
        return pathTouple[1];
      }
    }
    throw new Error('Undefined path to variable: ' + id);
  }

  setPath (id: string, value: string): ShowMdConfig {
    for(let pathTouple of this.pathVariables) {
      if(pathTouple[0] === id){
        pathTouple[1] = path.resolve(value);
        return this;
      }
    }
    this.pathVariables.push([id, value]);
    return this;
  }

  replacePathVariables(target: string): string {
    return path.resolve( 
      target.replace(/^{(.*)}/,
        (a:string, variable: string): string => {
          return this.getPath(variable); 
        }
      )
    );
  }
  
  setHtdocs (htdocs: string): ShowMdConfig {
    return this.setPath('HTDOCS', htdocs);
  }

  getHtdocs (): string {
    return this.getPath('HTDOCS');
  }

  setRootPath (rootPath: string): ShowMdConfig {
    return this.setPath('SERVER_ROOT', rootPath);
  }

  getRootPath (): string {
    return this.getPath('SERVER_ROOT');
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

  getDefinedStylesheets (): string[] {
    return this.stylesheets.map((elem) => {return elem[0];});
  }

  getStylesheetPath (name: string): string {
    for(let styleTouple of this.stylesheets){
      if(styleTouple[0] === name){
        return this.replacePathVariables(styleTouple[1]);
      }
    }
    throw new Error('Undefined stylesheet: ' + name);
  }

  setPort (port: number): ShowMdConfig {
    this.port = port;
    return this;
  }

  getPort (): number {
    return this.port;
  }

  setLogPath (logPath: string): ShowMdConfig {
    return this.setPath('LOG', logPath);
  }

  getLogPath (): string {
    return this.getPath('LOG');
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

  getHtDirs (): string[] {
    return this.htDirs.map((dir): string => {
      return this.replacePathVariables(dir);
    });
  } 

  setHtDirs (htDirs: string[]): ShowMdConfig {
    this.htDirs = htDirs;
    return this;
  }

  addHtDir (htDir: string): ShowMdConfig {
    this.htDirs.push(htDir);
    return this;
  }

  getDefaultFile (): string {
    return this.defaultFile;
  }

  setDefaultFile (defaultFile: string): ShowMdConfig {
    this.defaultFile = defaultFile;
    return this;
  }
};

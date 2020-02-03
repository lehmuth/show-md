import path from 'path';
import { EventEmitter } from 'events';

export class ShowMdConfig extends EventEmitter {
  language: string;
  stylesheetName: string;
  stylesheets: [string, string][];
  port: number;
  includeExtensions: string[];
  pathVariables: [string, string][];
  htDirs: string[];
  defaultFile: string;
  errorFiles: [number, string][];

  APP_ROOT: string = 'APP_ROOT';
  SERVER_ROOT: string = 'SERVER_ROOT';
  LOGS: string = 'LOGS';
  HTDOCS: string = 'HTDOCS';
  PUBLIC: string = 'PUBLIC';
  LIBS: string = 'LIBS';

  constructor(){
    super();
    let defaultConfig = require('./default.json');
    this.language = defaultConfig.language ?? 'en';
    this.stylesheetName = defaultConfig.stylesheetName ?? 'github';
    this.port = defaultConfig.port ?? 56657;
    this.includeExtensions = defaultConfig.includeExtensions ?? ['.html', '.md', '.txt'];
    this.stylesheets = defaultConfig.stylesheets as [string, string][] ?? [
      ["default", "{APP_ROOT}/build/public/default.css"],
      ["github", "{APP_ROOT}/libs/github.css"],
      ["none", "{APP_ROOT}/build/public/none.css"]
    ];
    this.pathVariables = defaultConfig.pathVariables as [string, string][] ?? [
      ["LOGS", path.resolve(__dirname, '../../logs')]
    ];
    this.pathVariables.push(
      [this.APP_ROOT, path.resolve(__dirname, '../../')],
      [this.HTDOCS, path.resolve(__dirname, "../../htdocs")],
      [this.SERVER_ROOT, path.resolve(process.cwd())],
      [this.PUBLIC, path.resolve(__dirname, "../../build/public")],
      [this.LIBS, path.resolve(__dirname, "../../libs")]
    );
    this.htDirs = defaultConfig.htDirs ?? [
      "{SERVER_ROOT}",
      "{HTDOCS}"
    ];
    this.defaultFile = defaultConfig.defaultFile ?? "README.md";
    this.errorFiles = defaultConfig.errorFiles as [number, string][] ?? [
      [403, "{HTDOCS}/error/error403.md"],
      [404, "{HTDOCS}/error/error404.md"],
      [500, "{HTDOCS}/error/error500.md"]
    ]
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

  setErrorFile (errorCode: number, file: string): ShowMdConfig {
    for(let errTouple of this.errorFiles) {
      if(errTouple[0] === errorCode){
        errTouple[1] = path.resolve(file);
        return this;
      }
    }
    this.errorFiles.push([errorCode, file]);
    return this;
  }

  getErrorFile (errorCode: number): string {
    for(let errTouple of this.errorFiles) {
      if(errTouple[0] === errorCode){
        return this.replacePathVariables(errTouple[1]);
      }
    }
    throw new Error('Undefined path for error ' + errorCode);
  }
};

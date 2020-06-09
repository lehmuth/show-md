import path from 'path';
import { EventEmitter } from 'events';

/**
 * This class represents the complete configuration for the show-md application.
 * 
 * This includes settings for the server and command line interface as well as
 * the markdown parser and html output.
 */
export class Configuration extends EventEmitter {
  
  /**
   * A static identifier for the path to the application's root directory.
   * 
   * **References:**
   * - Use it in [[getPath]] to get the path to the directory.
   * - Use it in [[removePath]] to remove a path from the list.
   */
  static PATH_APP_ROOT: string = 'APP_ROOT';

  /**
   * A static identifier for the path to the server's root directory.
   * 
   * In most of the times this is the current working directory during 
   * the startup.
   * 
   * **References:**
   * - Use it in [[getPath]] to get the path to the directory.
   * - Use it in [[removePath]] to remove a path from the list.
   */
  static PATH_SERVER_ROOT: string = 'SERVER_ROOT';

  /**
   * A static identifier for the path to the application's log directory.
   * 
   * There are two files created:
   * - system.log for default output.
   * - http.log for the server log files with requests and responses.
   * 
   * **References:**
   * - Use it in [[getPath]] to get the path to the directory.
   * - Use it in [[removePath]] to remove a path from the list.
   */
  static PATH_LOGS: string = 'LOGS';

  /**
   * A static identifier for the path to the application's public directory.
   * 
   * This directory contains source file for client side usage.
   * 
   * **References:**
   * - Use it in [[getPath]] to get the path to the directory.
   * - Use it in [[removePath]] to remove a path from the list.
   */
  static PATH_PUBLIC: string = 'PUBLIC';

  /**
   * A static identifier for the path to the application's libs directory.
   * 
   * This directory contains source files for client side usage.
   * 
   * **References:**
   * - Use it in [[getPath]] to get the path to the directory.
   * - Use it in [[removePath]] to remove a path from the list.
   */
  static PATH_LIBS: string = 'LIBS';

  /**
   * A static identifier for the path to the application's assets directory.
   * 
   * This directory contains static files for client side usage.
   * 
   * **References:**
   * - Use it in [[getPath]] to get the path to the directory.
   * - Use it in [[removePath]] to remove a path from the list.
   */
  static PATH_ASSETS: string = 'ASSETS';

  /**
   * A static identifier for notifications in case of port change.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_PORT, (port: number) => {
   *    console.log(port);
   * });
   * ```
   */
  static CHANGED_PORT: string = 'port';

  /**
   * A static identifier for notifications in case of [[language]] change.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_LANGUAGE, (language: string) => {
   *    console.log(language);
   * });
   * ```
   */
  static CHANGED_LANGUAGE: string = 'language';

  /**
   * A static identifier for notifications in case of [[stylesheet]] change.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_STYLESHEET, (stylesheet: string) => {
   *    console.log(stylesheet);
   * });
   * ```
   */
  static CHANGED_STYLESHEET: string = 'stylesheet';

  /**
   * A static identifier for notifications in case of [[defaultFile]] change.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_DEFAULT_FILE, (defaultFile: string) => {
   *    console.log(defaultFile);
   * });
   * ```
   */
  static CHANGED_DEFAULT_FILE: string = 'defaultFile';

  /**
   * A static identifier for notifications in case of [[includeExtensions]] change. 
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_INCLUDE_EXTENSION, (includeExtension: string) => {
   *    console.log(includeExtension);
   * });
   * ```
   */
  static CHANGED_INCLUDE_EXTENSION: string = 'includeExtension';

  /**
   * A static identifier for notifications in case of [[pathVariables]] change.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_PATH_VARIABLES, (id: string, path?: string) => {
   *    if (path) {
   *        console.log('Added or changed: ' + id + ' to ' + path);
   *    } else {
   *        console.log('Removed: ' + id);
   *    }
   * });
   * ```
   */
  static CHANGED_PATH_VARIABLES: string = 'pathVariables';

  /**
   * A static identifier for notifications in case of [[htDirs]] changes.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_HTDIRS, (htDir: string) => {
*       console.log(htDir);
   * });
   * ```
   */
  static CHANGED_HTDIRS: string = 'htDirs';

  /**
   * A static identifier for notifications in case of [[registeredStylesheets]] changes.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_REGISTERES_STYLESHEETS, (name: string, filePath?: string) => {
*       if (filePath) {
   *        console.log('Added or changed: ' + name + ' to ' + filePath);
   *    } else {
   *        console.log('Removed: ' + name);
   *    }
   * });
   * ```
   */
  static CHANGED_REGISTERED_STYLESHEETS: string = 'registeredStylesheets';

  /**
   * A static identifier for notifications in case of [[errorFiles]] changes.
   * 
   * For usage see EventEmitter, especcially [[on]]. 
   * 
   * e.g. 
   * ```typescript
   * config.on(Configuration.CHANGED_ERROR_FILES, (errorCode: number, filePath?: string) => {
*       if (filePath) {
   *        console.log('Added or changed: ' + errorCode + ' to ' + filePath);
   *    } else {
   *        console.log('Removed: ' + errorCode);
   *    }
   * });
   * ```
   */
  static CHANGED_ERROR_FILES: string = 'errorFiles';

  /**
   * The port that should get used by the server. 
   * 
   * **Default:** ```56657```  
   * (fallback: ```56657```)
   * 
   * Afterwards the server is accessable from any browser by using:
   * 
   * http://localhost:<[[port]]>
   * 
   * **Methods:**
   * - Get it with [[getPort]]
   * - Set it with [[setPort]]
   */
  private port: number;

  /**
   * The language that should get set in html files. 
   * 
   * **Default:** ```'en'```
   * (no fallback)
   * 
   * Afterwards css is able to justify text blocks written in this 
   * language correctly.
   * 
   * **Methods:**
   * - Get it with [[getLanguage]]
   * - Set it with [[setLanguage]]
   */
  private language: string | undefined;

  /**
   * The stylesheet which should get linked in the from markdown 
   * to html converted files.
   * 
   * **Default:** ```'github'```  
   * (no fallback)
   * 
   * May be set to:
   * -   a child from [[registeredStylesheets]]
   * -   an absolute path to a CSS file
   * -   a relative path from a specified path variable to a CSS file
   *     (e.g. ```'{SERVER_ROOT}/stylesheets/style.css'``` )
   * 
   * **Methods:**
   * - Get it with [[getStylesheet]]
   * - Set it with [[setStylesheet]]
   */
  private stylesheet: string | undefined;
  
  /**
   * The name of the file that is shown if the client requests a directory.
   * 
   * **Default:** ```'README.md'```
   * (no fallback)
   * 
   * **Methods:**
   * - Get it with [[getDefaultFile]]
   * - Set it with [[setDefaultFile]]
   */
  private defaultFile: string | undefined;

  /**
   * The file extensions that are allowed to use in the include extension.
   * 
   * **Default:**
   * ```
   * [
   *    "html",
   *    "md",
   *    "txt"
   * ]
   * ```
   * (fallback: ```['md']``` )
   * 
   * **Methods:**
   * - Add a file extension [[addIncludeExtension]]
   * - Remove a file extension [[removeIncludeExtension]]
   * - Get a list of all file extensions [[getIncludeExtensions]]
   */
  private includeExtensions: string[];

  /**
   * The variables that may be used in other paths.
   * 
   * **Default:**
   * ```
   * [
   *     ["LOGS", "{APP_ROOT}/logs"],
   *     ["HTDOCS", "{APP_ROOT}/htdocs"]
   * ]
   * ```  
   * (fallback: 
   * ```
   * [
   *   [Configuration.PATH_APP_ROOT, {Installation directory of show-md} ],
   *   [Configuration.PATH_SERVER_ROOT, {Current working directory from startup} ]
   *   [Configuration.PATH_LOGS, '{APP_ROOT}/logs'],
   *   [Configuration.PATH_PUBLIC, '{APP_ROOT}'/build/public'],
   *   [Configuration.PATH_LIBS, '{APP_ROOT}'/libs'],
   *   [Configuration.PATH_ASSETS, '{APP_ROOT}'/assets'],
   * ]
   * ```  
   * )
   * 
   * A path contained in this array has to be an absolute path or a relative 
   * path starting with another path variable.
   * 
   * **Methods:**
   * - Add a path variable [[addPath]]
   * - Remove a path variable [[removePath]]
   * - Get the path for a variable [[getPath]]
   * - Replace path variables in a string [[replacePathVariables]]
   */
  private pathVariables: [string, string][];

  /**
   * The directories that are used as root directories in the server.
   * 
   * **Default:**
   * ```
   * [
   *    "{SERVER_ROOT}",
   *    "{HTDOCS}"
   * ]
   * ```  
   * (no fallback)
   * 
   * Files in these directories are loadable from the server.
   * 
   * A path in this can be:
   * -   an absolute path to a directory
   * -   a relative path from a specified path variable to a directory
   *     (e.g. ```'{SERVER_ROOT}/www'``` or ```{ROOT_PATH}``` )
   * 
   * **Methods:**
   * - Add a path to the list of root directories [[addHtDir]]
   * - Remove a path from the list of root directories [[removeHtDir]]
   * - Get a list with all root directories [[getHtDirs]]
   */
  private htDirs: string[];

  /**
   * The registered aliases for stylesheets.
   * 
   * **Default:** 
   * ```
   * [
   *    ["default", "{PUBLIC}/default.css"],
   *    ["github", "{LIBS}/github.css"],
   *    ["none", "{PUBLIC}/none.css"]
   * ]
   * ```  
   * (no fallback)
   * 
   * Every element in this array is a touple with the 
   * structure ```[{alias}, {path}]``` where
   * -   alias is a URL encoded string
   * -   path may contain:
   *     -   an absolute path to a CSS file
   *     -   a relative path from a specified path variable to a CSS file
   *         (e.g. ```'{SERVER_ROOT}/stylesheets/style.css')```
   * 
   * **Methods:**
   * - Register a new stylesheet [[registerStylesheet]]
   * - Remove a stylesheet from the list [[unregisterStylesheet]]
   * - Get the path to an alias [[getStylesheetPath]]
   * - Get a list with all registered stylesheets [[getRegisteredStylesheets]]
   */
  private registeredStylesheets: [string, string][];

  /**
   * The registered files for HTTP error codes.
   * 
   * **Default:**
   * ```
   * [  
   *     [403, "{HTDOCS}/error/error403.md"],  
   *     [404, "{HTDOCS}/error/error404.md"],  
   *     [500, "{HTDOCS}/error/error500.md"]  
   * ]
   * ``` 
   * (no fallback)
   * 
   * Every element in this array is a touple with the 
   * structure ```[error_code, path]``` where
   * -   error_code is a HTTP error code
   * -   path may contain:
   *     -   an absolute path to a md file
   *     -   a relative path from a specified path variable to a md file
   *         (e.g. ```'{SERVER_ROOT}/error/error404.md')```
   * 
   * **Methods:**
   * - Add a new error file [[addErrorFile]]
   * - Remove an error file from the list [[removeErrorFile]]
   * - Get the path to an error code [[getErrorFile]]
   */
  private errorFiles: [number, string][];

  constructor(){
    super();
    this.port = 56657;
    this.includeExtensions = ['md'];
    this.pathVariables = [
      [Configuration.PATH_APP_ROOT, path.join(__dirname, '../../')],
      [Configuration.PATH_SERVER_ROOT, path.normalize(process.cwd())],
      [Configuration.PATH_LOGS, '{APP_ROOT}/logs'],
      [Configuration.PATH_PUBLIC, '{APP_ROOT}/build/public'],
      [Configuration.PATH_LIBS, '{APP_ROOT}/libs'],
      [Configuration.PATH_ASSETS, '{APP_ROOT}/assets']
    ];
    this.htDirs = [];
    this.registeredStylesheets = [];
    this.errorFiles = []
  }

  setPort (port: number): Configuration {
    this.port = port;
    this.emit(Configuration.CHANGED_PORT, port);
    return this;
  }

  getPort (): number {
    return this.port;
  }

  setLanguage (language?: string): Configuration {
    this.language = language;
    this.emit(Configuration.CHANGED_LANGUAGE, language);
    return this;
  }

  getLanguage (): string | undefined {
    return this.language;
  }

  setStylesheet (stylesheet?: string): Configuration {
    this.stylesheet = stylesheet;
    this.emit(Configuration.CHANGED_STYLESHEET, stylesheet);
    return this;
  }

  getStylesheet (): string | undefined {
    return this.stylesheet;
  }
  
  setDefaultFile (defaultFile?: string): Configuration {
    this.defaultFile = defaultFile;
    this.emit(Configuration.CHANGED_DEFAULT_FILE, defaultFile);
    return this;
  }

  getDefaultFile (): string | undefined {
    return this.defaultFile;
  }

  addIncludeExtension (extension: string): Configuration {
    this.includeExtensions.push(extension);
    this.emit(Configuration.CHANGED_INCLUDE_EXTENSION, this.getIncludeExtensions());
    return this;
  }

  removeIncludeExtension (extension: string): Configuration {
    this.includeExtensions.slice(this.includeExtensions.indexOf(extension), 1);
    this.emit(Configuration.CHANGED_INCLUDE_EXTENSION, this.getIncludeExtensions());
    return this;
  }

  getIncludeExtensions (): string[] {
    return this.includeExtensions;
  }

  addPath (id: string, value: string): Configuration {
    for(let pathTouple of this.pathVariables) {
      if(pathTouple[0] === id){
        pathTouple[1] = path.resolve(value);
        this.emit(Configuration.CHANGED_PATH_VARIABLES, id, value);
        return this;
      }
    }
    this.pathVariables.push([id, value]);
    this.emit(Configuration.CHANGED_PATH_VARIABLES, id, value);
    return this;
  }

  removePath(id: string): Configuration {
    this.pathVariables.slice(this.pathVariables.indexOf([id, this.getPath(id)]), 1);
    this.emit(Configuration.CHANGED_PATH_VARIABLES, id);
    return this;
  }

  getPath (id: string): string {
    for(let pathTouple of this.pathVariables) {
      if(pathTouple[0] === id){
        return pathTouple[1];
      }
    }
    throw new Error('Undefined path to variable: ' + id);
  }
  
  addHtDir (htDir: string): Configuration {
    this.htDirs.push(htDir);
    this.emit(Configuration.CHANGED_HTDIRS, htDir);
    return this;
  }

  removeHtDir (htdir: string): Configuration {
    this.htDirs.slice(this.htDirs.indexOf(htdir), 1);
    this.emit(Configuration.CHANGED_HTDIRS, htdir);
    return this;
  }

  getHtDirs (): string[] {
    return this.htDirs.map((dir): string => {
      return this.replacePathVariables(dir);
    });
  }

  registerStylesheet (name: string, filePath: string): Configuration {
    this.registeredStylesheets.push([name, filePath]);
    this.emit(Configuration.CHANGED_REGISTERED_STYLESHEETS, name, filePath);
    return this;
  }

  unregisterStylesheet (name: string): Configuration {
    let filePath = this.getStylesheetPath(name);
    if(filePath) {
      this.registeredStylesheets.splice(
          this.registeredStylesheets.indexOf(
            [name, filePath]), 1);
    }
    this.emit(Configuration.CHANGED_REGISTERED_STYLESHEETS, name);
    return this;
  }

  getRegisteredStylesheets (): [string, string][] {
    return this.registeredStylesheets;
  }

  getStylesheetPath (name?: string): string | undefined{
    if(name) {
      for(let styleTouple of this.registeredStylesheets){
        if(styleTouple[0] === name){
          return this.replacePathVariables(styleTouple[1]);
        }
      }
      throw new Error('Unregistered stylesheet: ' + name);
    }
    return undefined;
  }

  addErrorFile (errorCode: number, filePath: string): Configuration {
    for(let errTouple of this.errorFiles) {
      if(errTouple[0] === errorCode){
        errTouple[1] = path.resolve(filePath);
        this.emit(Configuration.CHANGED_ERROR_FILES, errorCode, filePath);
        return this;
      }
    }
    this.errorFiles.push([errorCode, filePath]);
    this.emit(Configuration.CHANGED_ERROR_FILES, errorCode, filePath);
    return this;
  }

  removeErrorFile (errorCode: number): Configuration {
    this.errorFiles.slice(
        this.errorFiles.indexOf(
          [errorCode, this.getErrorFile(errorCode)]), 1);
    this.emit(Configuration.CHANGED_ERROR_FILES, errorCode);
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
  
  replacePathVariables(target: string): string {
    let tmp = target;
    do {
      target = target.replace(/^{(.*)}/,
          (a:string, variable: string): string => {
            return this.getPath(variable); 
          });
    } while (tmp !== target);
    return path.resolve(target);
  }
}

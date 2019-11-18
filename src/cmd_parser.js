const EventEmitter = require('events');
const ShowMdApp = require('./app.js');
const parseArgs = require('minimist');

class ShowMdCmdParser extends EventEmitter{
  constructor(app){
    super();
    this.app = app;
    if(this.app === undefined){
      this.app = new ShowMdApp();
    }else if(!(this.app instanceof ShowMdApp)){
      this.emit('error', 'Attribute app is no instance of ShowMdApp');
    }
  }

  parse(argv){
    const args = parseArgs(argv, {
      string: ['dir', 'lang', 'style', 'port'],
      boolean: ['help'],
      alias: {
        d: 'dir',
        h: 'help',
        l: 'lang',
        p: 'port',
        s: 'style'
      }
    });
    if(args._[0] === undefined || args._[0] === '')
      return this.cmdEmpty(args);
    switch(args._[0].toLowerCase()){
      case "root":
        return this.cmdRoot(args);
      case 'status':
        return this.cmdStatus(args);
      case 'start':
        return this.cmdStart(args);
      case 'stop':
        return this.cmdStop(args);
      case 'exit':
        return this.cmdExit(args);
      case 'help':
        return this.cmdHelp(args);
      default:
        this.emit('error', "Unknown command \"" + args._[0] + "\"! Enter help for more detailed information.\n");
    }
  }

  cmdEmpty(args){
    if(args.help){
      this.emit('info', `
  Usage: show-md [OPTION]
  Parse markdown files to html and show them on a http server.
  Uses current directory as server root and port 56657 if not diffrent specified.

  Mandatory arguments to long options are mandatory for short options too.
    -d, --dir  <dir>                  set servers root directory

    -h, --help                        show further information

    -l, --lang <lang-code>            set language for html documents. It is
                                      necessary to set the language it you want
                                      correct justification in text paragraphs.

    -p, --port <port>                 set port for http server

    -s, -- style <path | theme>       set custom stylesheet or a predefined theme.
                                      Provide stylesheet as path to a css file.

                                      Predefined themes:
                         [none]  ->   No stylesheet, just browsers styling.
                      [default]  ->   Default show-md optics
                       [github]  ->   Github styled markdown files
          `);
      }
    if(args.dir !== undefined) this.app.config.setRootPath(args.dir);
    if(args.port !== undefined){
      this.app.config.setPort(args.port);
      console.log(this.app.config.getPort());
    }
    if(args.lang !== undefined) this.app.config.setLanguage(args.lang);
    if(args.style !== undefined) this.app.config.setStylesheet(args.style);
  }

  cmdHelp(args){
    this.emit('info', `
    root      to print current server root directory.
    status    to show current options.
    start     to start the server.
    stop      to stop the server.
    exit      to stop the server and shut down show-md.
    help      to show this help screen.
    `);
    return this;
  }

  cmdRoot(args){
    this.emit('info', this.app.config.getRootPath());
    return this;
  }

  cmdStatus(args){
    this.emit('info', `
    status:
    running:         ${this.app.isRunning()}
    rootPath:        ${this.app.config.getRootPath()}
    port:            ${this.app.config.getPort()}
    language:        ${this.app.config.getLanguage()}
    stylesheetName:  ${this.app.config.getStylesheet()}
    stylesheetPath:  ${this.app.config.getStylesheetPath()}
    htdocs:          ${this.app.config.getHtdocs()}
    httpLogPath      ${this.app.config.getHttpLogPath()}
    `);
    return this;
  }

  cmdStart(args){
    if(args.help){
      this.emit('info', `
  Usage: start [OPTION]
  Start the webserver, uses port 56657 if not specified.

  Mandatory arguments to long options are mandatory for short options too.
    -d, --dir  <dir>                  set servers root directory

    -h, --help                        show further information

    -l, --lang <lang-code>            set language for html documents. It is
                                      necessary to set the language it you want
                                      correct justification in text paragraphs.

    -p, --port <port>                 set port for http server

    -s, -- style <path | theme>       set custom stylesheet or a predefined theme.
                                      Provide stylesheet as path to a css file.

                                      Predefined themes:
                         [none]  ->   No stylesheet, just browsers styling.
                      [default]  ->   Default show-md optics
                       [github]  ->   Github styled markdown files
      `);
    }else if(this.app.isRunning()){
      this.emit('warning', 'Server already running on http://localhost:' + this.app.config.getPort());
    }else{
      if(args.dir !== undefined) this.app.config.setRootPath(args.dir);
      if(args.port !== undefined) this.app.config.setPort(args.port);
      if(args.lang !== undefined) this.app.config.setLanguage(args.lang);
      if(args.style !== undefined) this.app.config.setStylesheet(args.style);
      this.app.start();
    }
    return this;
  }

  cmdStop(args){
    if(!this.app.isRunning())
      this.emit('warning', 'Server is not running.');
    else
      this.app.stop();
    return this;
  }

  cmdExit(args){
    if(this.app.isRunning()){
      this.app.once('stoped', () => {setTimeout(() => {process.exit(0);}, 1);});
      this.app.stop();
    }else{
      process.exit(0);
    }
  }




}

module.exports = ShowMdCmdParser;

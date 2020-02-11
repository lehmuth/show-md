import { EventEmitter } from 'events';
import { ShowMdApp }  from '../app';
import parseArgs, { ParsedArgs } from 'minimist';
import { Configuration } from 'src/config/config';

export enum ShowMdCommand{
  HELP = 'help',
  ROOT = 'root',
  STATUS = 'status',
  START = 'start',
  STOP = 'stop',
  EXIT = 'exit'
}

export class ShowMdCmdParser extends EventEmitter{
  app: ShowMdApp;
  constructor(app: ShowMdApp){
    super();
    if(app)
      this.app = app;
    else
      this.app = new ShowMdApp();
  }

  parse(argv: string[]): ShowMdCmdParser{
    const args: ParsedArgs = parseArgs(argv, {
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
      case ShowMdCommand.ROOT:
        return this.cmdRoot(args);
      case ShowMdCommand.STATUS:
        return this.cmdStatus(args);
      case ShowMdCommand.START:
        return this.cmdStart(args);
      case ShowMdCommand.STOP:
        return this.cmdStop(args);
      case ShowMdCommand.EXIT:
        return this.cmdExit(args);
      case ShowMdCommand.HELP:
        return this.cmdHelp(args);
      default:
        this.emit('error', "Unknown command \"" + args._[0] + "\"! Enter help for more detailed information.\n");
        return this;
    }
  }

  cmdEmpty(args: ParsedArgs): ShowMdCmdParser{
    if(args.help){
      this.emit('info', `
  Usage: show-md [start] [OPTION]
  Parse markdown files to html and show them on a http server.
  Uses current directory as server root and port 56657 if not diffrent specified.

  Mandatory arguments to long options are mandatory for short options too.
    -d, --dir  <dir>                  set servers root directory

    -h, --help                        show further information

    -l, --lang <lang-code>            set language for html documents. It is
                                      necessary to set the language it you want
                                      correct justification in text paragraphs.

    -p, --port <port>                 set port for http server

    -s, --style <path | theme>       set custom stylesheet or a predefined theme.
                                      Provide stylesheet as path to a css file.

                                      Predefined themes:
                         [none]  ->   No stylesheet, just browsers styling.
                      [default]  ->   Default show-md optics
                       [github]  ->   Github styled markdown files
          `);
        setTimeout(() => {process.exit(0);}, 1);
        return this;
    }
    if(args.dir !== undefined) this.app.config.addPath(Configuration.PATH_SERVER_ROOT, args.dir);
    if(args.port !== undefined) this.app.config.setPort(args.port);
    if(args.lang !== undefined) this.app.config.setLanguage(args.lang);
    if(args.style !== undefined) this.app.config.setStylesheet(args.style);
    return this;
  }

  cmdHelp(args: ParsedArgs): ShowMdCmdParser{
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

  cmdRoot(args: ParsedArgs): ShowMdCmdParser{
    this.emit('info', this.app.config.getPath(Configuration.PATH_SERVER_ROOT));
    return this;
  }

  cmdStatus(args: ParsedArgs): ShowMdCmdParser{
    this.emit('info', `
    status:
    running:         ${this.app.isRunning()}
    rootPath:        ${this.app.config.getPath(Configuration.PATH_SERVER_ROOT)}
    port:            ${this.app.config.getPort()}
    language:        ${this.app.config.getLanguage()}
    stylesheetName:  ${this.app.config.getStylesheet()}
    stylesheetPath:  ${this.app.config.getStylesheetPath(this.app.config.getStylesheet())}
    htdocs:          ${this.app.config.getHtDirs()}
    httpLogPath      ${this.app.config.getPath(Configuration.PATH_LOGS)}
    `);
    return this;
  }

  cmdStart(args: ParsedArgs): ShowMdCmdParser{
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
      if(args.dir !== undefined) this.app.config.addPath(Configuration.PATH_SERVER_ROOT, args.dir);
      if(args.port !== undefined) this.app.config.setPort(args.port);
      if(args.lang !== undefined) this.app.config.setLanguage(args.lang);
      if(args.style !== undefined) this.app.config.setStylesheet(args.style);
      this.app.start();
    }
    return this;
  }

  cmdStop(args: ParsedArgs): ShowMdCmdParser{
    if(!this.app.isRunning())
      this.emit('warning', 'Server is not running.');
    else
      this.app.stop();
    return this;
  }

  cmdExit(args: ParsedArgs): ShowMdCmdParser{
    if(this.app.isRunning()){
      this.app.stop().then(() => {process.exit(0);});
    }else{
      process.exit(0);
    }
    return this;
  }

}

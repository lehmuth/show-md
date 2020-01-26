"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var app_js_1 = require("./app.js");
var minimist_1 = __importDefault(require("minimist"));
var ShowMdCommand;
(function (ShowMdCommand) {
    ShowMdCommand["HELP"] = "help";
    ShowMdCommand["ROOT"] = "root";
    ShowMdCommand["STATUS"] = "status";
    ShowMdCommand["START"] = "start";
    ShowMdCommand["STOP"] = "stop";
    ShowMdCommand["EXIT"] = "exit";
})(ShowMdCommand = exports.ShowMdCommand || (exports.ShowMdCommand = {}));
var ShowMdCmdParser = /** @class */ (function (_super) {
    __extends(ShowMdCmdParser, _super);
    function ShowMdCmdParser(app) {
        var _this = _super.call(this) || this;
        if (app)
            _this.app = app;
        else
            _this.app = new app_js_1.ShowMdApp();
        return _this;
    }
    ShowMdCmdParser.prototype.parse = function (argv) {
        var args = minimist_1.default(argv, {
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
        if (args._[0] === undefined || args._[0] === '')
            return this.cmdEmpty(args);
        switch (args._[0].toLowerCase()) {
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
    };
    ShowMdCmdParser.prototype.cmdEmpty = function (args) {
        if (args.help) {
            this.emit('info', "\n  Usage: show-md [start] [OPTION]\n  Parse markdown files to html and show them on a http server.\n  Uses current directory as server root and port 56657 if not diffrent specified.\n\n  Mandatory arguments to long options are mandatory for short options too.\n    -d, --dir  <dir>                  set servers root directory\n\n    -h, --help                        show further information\n\n    -l, --lang <lang-code>            set language for html documents. It is\n                                      necessary to set the language it you want\n                                      correct justification in text paragraphs.\n\n    -p, --port <port>                 set port for http server\n\n    -s, --style <path | theme>       set custom stylesheet or a predefined theme.\n                                      Provide stylesheet as path to a css file.\n\n                                      Predefined themes:\n                         [none]  ->   No stylesheet, just browsers styling.\n                      [default]  ->   Default show-md optics\n                       [github]  ->   Github styled markdown files\n          ");
            setTimeout(function () { process.exit(0); }, 1);
            return this;
        }
        if (args.dir !== undefined)
            this.app.config.setRootPath(args.dir);
        if (args.port !== undefined)
            this.app.config.setPort(args.port);
        if (args.lang !== undefined)
            this.app.config.setLanguage(args.lang);
        if (args.style !== undefined)
            this.app.config.setStylesheet(args.style);
        return this;
    };
    ShowMdCmdParser.prototype.cmdHelp = function (args) {
        this.emit('info', "\n    root      to print current server root directory.\n    status    to show current options.\n    start     to start the server.\n    stop      to stop the server.\n    exit      to stop the server and shut down show-md.\n    help      to show this help screen.\n    ");
        return this;
    };
    ShowMdCmdParser.prototype.cmdRoot = function (args) {
        this.emit('info', this.app.config.getRootPath());
        return this;
    };
    ShowMdCmdParser.prototype.cmdStatus = function (args) {
        this.emit('info', "\n    status:\n    running:         " + this.app.isRunning() + "\n    rootPath:        " + this.app.config.getRootPath() + "\n    port:            " + this.app.config.getPort() + "\n    language:        " + this.app.config.getLanguage() + "\n    stylesheetName:  " + this.app.config.getStylesheet() + "\n    stylesheetPath:  " + this.app.config.getStylesheetPath() + "\n    htdocs:          " + this.app.config.getHtdocs() + "\n    httpLogPath      " + this.app.config.getHttpLogPath() + "\n    ");
        return this;
    };
    ShowMdCmdParser.prototype.cmdStart = function (args) {
        if (args.help) {
            this.emit('info', "\n  Usage: start [OPTION]\n  Start the webserver, uses port 56657 if not specified.\n\n  Mandatory arguments to long options are mandatory for short options too.\n    -d, --dir  <dir>                  set servers root directory\n\n    -h, --help                        show further information\n\n    -l, --lang <lang-code>            set language for html documents. It is\n                                      necessary to set the language it you want\n                                      correct justification in text paragraphs.\n\n    -p, --port <port>                 set port for http server\n\n    -s, -- style <path | theme>       set custom stylesheet or a predefined theme.\n                                      Provide stylesheet as path to a css file.\n\n                                      Predefined themes:\n                         [none]  ->   No stylesheet, just browsers styling.\n                      [default]  ->   Default show-md optics\n                       [github]  ->   Github styled markdown files\n      ");
        }
        else if (this.app.isRunning()) {
            this.emit('warning', 'Server already running on http://localhost:' + this.app.config.getPort());
        }
        else {
            if (args.dir !== undefined)
                this.app.config.setRootPath(args.dir);
            if (args.port !== undefined)
                this.app.config.setPort(args.port);
            if (args.lang !== undefined)
                this.app.config.setLanguage(args.lang);
            if (args.style !== undefined)
                this.app.config.setStylesheet(args.style);
            this.app.start();
        }
        return this;
    };
    ShowMdCmdParser.prototype.cmdStop = function (args) {
        if (!this.app.isRunning())
            this.emit('warning', 'Server is not running.');
        else
            this.app.stop();
        return this;
    };
    ShowMdCmdParser.prototype.cmdExit = function (args) {
        if (this.app.isRunning()) {
            this.app.once('stoped', function () { setTimeout(function () { process.exit(0); }, 1); });
            this.app.stop();
        }
        else {
            process.exit(0);
        }
        return this;
    };
    return ShowMdCmdParser;
}(events_1.EventEmitter));
exports.ShowMdCmdParser = ShowMdCmdParser;

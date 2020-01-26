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
var config_js_1 = require("./config.js");
var md_parser_js_1 = require("./md_parser.js");
var LogFactory = require('simple-node-logger');
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var config, parser, httpServer, log, opts = {
    timestampFormat: '[YYYY-MM-DD HH:mm:ss]'
};
;
var ShowMdServer = /** @class */ (function (_super) {
    __extends(ShowMdServer, _super);
    function ShowMdServer(_config, _parser) {
        var _this = _super.call(this) || this;
        config = (_config !== null && _config !== void 0 ? _config : new config_js_1.ShowMdConfig());
        log = (log === undefined) ? LogFactory.createSimpleFileLogger(config.getHttpLogPath()) : log;
        parser = (_parser !== null && _parser !== void 0 ? _parser : new md_parser_js_1.ShowMdParser(config));
        httpServer = http_1.default.createServer();
        httpServer.on('request', handleRequest);
        httpServer.on('clientError', function (err, socket) {
            socket.end('HTTP/1.1 400 Bad Request');
        });
        return _this;
    }
    ShowMdServer.prototype.listen = function () {
        httpServer.listen(config.getPort());
    };
    ShowMdServer.prototype.close = function () {
        httpServer.close();
    };
    ShowMdServer.prototype.isListening = function () {
        return httpServer.listening;
    };
    return ShowMdServer;
}(events_1.EventEmitter));
exports.ShowMdServer = ShowMdServer;
function handleRequest(req, res) {
    var _a;
    //get path to file
    var requestUrl = (_a = req.url, (_a !== null && _a !== void 0 ? _a : ''));
    var href = url_1.default.parse(requestUrl, true).path;
    log.info("REQUEST:  " + href);
    if (!href) {
        log.info("ERROR No url specified.");
        return;
    }
    var filename = path_1.default.join(config.getRootPath(), href);
    if (filename.indexOf(config.getRootPath()) !== 0) {
        return sendError(res, 403);
    }
    try {
        var stat = fs_1.default.statSync(filename);
        if (stat.isDirectory()) {
            //Check default file
            stat = fs_1.default.statSync(path_1.default.join(filename, "README.md"));
            //setze pfad wenn standard-datei existiert
            if (stat.isFile())
                filename = path_1.default.join(filename, "README.md");
        }
    }
    catch (e) {
        //Exception in case of the file does not exist
        //Check htdocs directory
        if (href.match(/^\/favicon\.ico$/))
            href = '/resources/icons/favicon.ico';
        filename = path_1.default.join(config.getHtdocs(), href);
        if (filename.indexOf(config.getHtdocs()) !== 0) {
            return sendError(res, 403);
        }
        try {
            var stat = fs_1.default.statSync(filename);
            if (stat.isDirectory()) {
                //Check default file
                stat = fs_1.default.statSync(path_1.default.join(filename, "README.md"));
                //setze pfad wenn standard-datei existiert
                if (stat.isFile())
                    filename = path_1.default.join(filename, "README.md");
            }
        }
        catch (e) {
            //Exception in case of the file does not exist
            return sendError(res, 404);
        }
    }
    /** Check file extension for allowed file types */
    //Check whether requested file is a markdown file
    if (filename.match(/(.*\.md$)/i)) {
        var data = fs_1.default.readFileSync(filename, "utf-8");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        parser.setFilePath(filename);
        res.end(parser.mdToHtml(data));
        log.info("RETURNED: " + filename);
    }
    //Check whether requested file is an image or js file
    else if (filename.match(/(.*\.(jpg|png|gif|ico|ttf)$)/i)) {
        var data = fs_1.default.readFileSync(filename, "binary");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data, 'binary');
        log.info("RETURNED: " + filename);
    }
    //Check wheather requested file is a css file
    else if (filename.match(/(.*\.css$|.*\.js$)/i)) {
        var data = fs_1.default.readFileSync(filename, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
        log.info("RETURNED: " + filename);
    }
    //Other file extensions are forbidden
    else if (filename.match(/(.*\..*$)/i)) {
        return sendError(res, 403);
    }
    function sendError(res, errorCode) {
        var errorpath = path_1.default.join(config.getHtdocs(), "error/error" + errorCode + ".md");
        var data = fs_1.default.readFileSync(errorpath, 'utf-8');
        res.writeHead(Number(errorCode), { 'Content-Type': 'text/html' });
        res.end(parser.mdToHtml(data));
        log.info("ERROR " + errorCode + ": " + filename);
    }
}

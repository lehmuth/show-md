'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var config_1 = require("./config");
var server_js_1 = require("./server.js");
var md_parser_js_1 = require("./md_parser.js");
/**
 * A server class which consists of a HTTP server and a configuration.
 */
var ShowMdApp = /** @class */ (function (_super) {
    __extends(ShowMdApp, _super);
    /**
     * Init new ShowMdServer.
     */
    function ShowMdApp(config) {
        var _this = _super.call(this) || this;
        // Setup config
        if (config)
            _this.config = config;
        else
            _this.config = new config_1.ShowMdConfig();
        _this.config.on('warning', function (msg) { _this.emit('warning', msg); });
        _this.parser = new md_parser_js_1.ShowMdParser(_this.config);
        _this.server = new server_js_1.ShowMdServer(_this.config, _this.parser);
        return _this;
    }
    /**
     * Server starts listening, event "started" is emitted.
     */
    ShowMdApp.prototype.start = function () {
        try {
            this.server.listen();
            this.emit('started');
        }
        catch (err) {
            this.emit('error', err);
        }
    };
    /**
     * Server stops listening, event "stoped" is emitted.
     */
    ShowMdApp.prototype.stop = function () {
        if (this.server !== undefined && this.server.isListening()) {
            this.server.close();
            this.emit('stoped');
        }
        else {
            this.emit('error', 'Trying to shut down server, but server not running!');
        }
    };
    ShowMdApp.prototype.isRunning = function () {
        return this.server.isListening();
    };
    ShowMdApp.prototype.parseIncludes = function (path) {
        // TODO
        return false;
    };
    ShowMdApp.prototype.parse = function (inputPath, outputPath) {
        // TODO
        return false;
    };
    return ShowMdApp;
}(events_1.EventEmitter));
exports.ShowMdApp = ShowMdApp;

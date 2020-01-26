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
var path_1 = __importDefault(require("path"));
var events_1 = require("events");
var fs_1 = __importDefault(require("fs"));
var ShowMdConfig = /** @class */ (function (_super) {
    __extends(ShowMdConfig, _super);
    function ShowMdConfig() {
        var _this = _super.call(this) || this;
        _this.htdocs = path_1.default.join(__dirname, '../../htdocs');
        _this.rootPath = process.cwd();
        _this.language = 'en';
        _this.stylesheetName = 'github';
        _this.port = 56657;
        _this.httpLogPath = path_1.default.join(__dirname, '../../logs/http.log');
        _this.includeExtensions = ['.html', '.md', '.txt'];
        return _this;
    }
    ShowMdConfig.prototype.setHtdocs = function (htdocs) {
        this.htdocs = path_1.default.resolve(htdocs);
        return this;
    };
    ShowMdConfig.prototype.getHtdocs = function () {
        return this.htdocs;
    };
    ShowMdConfig.prototype.setRootPath = function (rootPath) {
        this.rootPath = path_1.default.resolve(rootPath);
        return this;
    };
    ShowMdConfig.prototype.getRootPath = function () {
        return this.rootPath;
    };
    ShowMdConfig.prototype.setLanguage = function (language) {
        this.language = language;
        return this;
    };
    ShowMdConfig.prototype.getLanguage = function () {
        return this.language;
    };
    ShowMdConfig.prototype.setStylesheet = function (stylesheet) {
        this.stylesheetName = stylesheet;
        return this;
    };
    ShowMdConfig.prototype.getStylesheet = function () {
        return this.stylesheetName;
    };
    ShowMdConfig.prototype.getStylesheetPath = function () {
        var stylesheet = this.getStylesheet();
        if (stylesheet === 'none')
            return '/resources/style/none.css';
        if (stylesheet === 'default')
            return '/resources/style/default.css';
        if (stylesheet === 'github')
            return '/resources/style/github.css';
        if (stylesheet.match(/\.(css|CSS)$/)) {
            var filename = path_1.default.resolve(this.getRootPath() + stylesheet);
            try {
                // Check whether stylesheet is a file
                var stat = fs_1.default.statSync(filename);
                if (stat.isFile()) {
                    return path_1.default.relative(this.getRootPath(), filename);
                }
            }
            catch (e) {
                this.emit('warning', 'The currently specified stylesheet does not exist. Fallback to default was performed.');
            }
        }
        this.emit('warning', 'The currently specified stylesheet is not a stylesheet. Fallback to default was performed.');
        return '/resources/style/default.css';
    };
    ShowMdConfig.prototype.setPort = function (port) {
        this.port = port;
        return this;
    };
    ShowMdConfig.prototype.getPort = function () {
        return this.port;
    };
    ShowMdConfig.prototype.setHttpLogPath = function (httpLogPath) {
        this.httpLogPath = path_1.default.resolve(httpLogPath);
        return this;
    };
    ShowMdConfig.prototype.getHttpLogPath = function () {
        return this.httpLogPath;
    };
    ShowMdConfig.prototype.setIncludeExtensions = function (includeExtensions) {
        this.includeExtensions = includeExtensions;
        return this;
    };
    ShowMdConfig.prototype.addIncludeExtension = function (extension) {
        this.includeExtensions.push(extension);
        return this;
    };
    ShowMdConfig.prototype.getIncludeExtensions = function () {
        return this.includeExtensions;
    };
    return ShowMdConfig;
}(events_1.EventEmitter));
exports.ShowMdConfig = ShowMdConfig;
;

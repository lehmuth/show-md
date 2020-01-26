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
var config_1 = require("./config");
var showdown_1 = require("showdown");
var include_1 = __importDefault(require("./extensions/include"));
var path_1 = __importDefault(require("path"));
var ShowMdParser = /** @class */ (function (_super) {
    __extends(ShowMdParser, _super);
    function ShowMdParser(config) {
        var _this = _super.call(this) || this;
        _this.config = (config !== null && config !== void 0 ? config : new config_1.ShowMdConfig());
        // Initialize and configure showdown converter
        showdown_1.extension('include', include_1.default);
        _this.converter = new showdown_1.Converter({ extensions: [include_1.default] });
        _this.converter.setOption('tables', true); // enable tables
        _this.converter.setOption('customizedHeaderId', true); // makes it possible to select a custom header id with {custom_id}
        _this.converter.setOption('ghCompatibleHeaderId', true); // generates header ids compatible with github style (spaces are replaced with dashes and a bunch of non alphanumeric chars are removed)
        _this.converter.setOption('parseImgDimensions', true); // makes it possible to add dimensions to image includes
        _this.converter.setOption('tasklists', true); // enables the option of tasklists with [ ] and [x]
        _this.converter.setOption('emoji', true); // enables emoji import
        _this.converter.setOption('underline', true); // enables underline with __
        _this.converter.setOption('strikethrough', true); // enables strikethrew with ~~
        _this.converter.setOption('includeExtensions', _this.config.getIncludeExtensions());
        return _this;
    }
    ShowMdParser.prototype.setFilePath = function (filename) {
        filename = path_1.default.dirname(path_1.default.resolve(filename));
        this.converter.setOption('fileDir', filename);
    };
    // Parse a markdown content into html content
    ShowMdParser.prototype.mdToHtml = function (md) {
        // Use showdown parser
        var htmlContent = this.converter.makeHtml(md);
        return this.generateHtmlFile(htmlContent);
    };
    // Generate html file
    ShowMdParser.prototype.generateHtmlFile = function (content) {
        var html = '\
			<!DOCTYPE html>\
			<html lang="' + this.config.getLanguage() + '">\
				<head>\
					<meta charset="utf-8"/>\
					<meta name="viewport" content="width=device-width, initial-scale=1">\
					<link rel="stylesheet" type="text/css" href="' + this.config.getStylesheetPath() + '"/>\
				</head>\
				<body>\
					<div class="markdown-body">\
						' + content + '\
					</div>\
				</body>\
			</html>';
        return html;
    };
    return ShowMdParser;
}(events_1.EventEmitter));
exports.ShowMdParser = ShowMdParser;

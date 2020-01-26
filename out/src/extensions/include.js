"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.default = {
    type: 'lang',
    filter: function (text, converter, options) {
        return text.replace(/!{(.*)}/gi, function (str) {
            var href = str.substring(2, str.length - 1);
            var filename;
            if (options)
                filename = path_1.default.join(options.fileDir, href);
            else
                return "Include-Error: fileDir not set.";
            try {
                var stat = fs_1.default.statSync(filename);
                if (stat.isDirectory()) {
                    return "Include-Error: Path is a directory.";
                }
            }
            catch (e) {
                //Exception in case of the file does not exist
                return "Include-Error: File does not exist.";
            }
            if (options.includeExtensions.includes(path_1.default.extname(filename))) {
                var file = fs_1.default.readFileSync(filename, 'utf-8');
                return converter.makeHtml(file);
            }
            else if (path_1.default.extname(filename) === '.csv') {
                var file = fs_1.default.readFileSync(filename, 'utf-8');
                var html_1 = "<table>";
                var first_1 = true;
                file.split("\n").forEach(function (line) {
                    if (first_1)
                        html_1 += "<thead><tr>";
                    else
                        html_1 += "<tr>";
                    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
                    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
                    if (!re_valid.test(line))
                        return "Include-Error: Invalid CSV file";
                    var a = []; // Initialize array to receive values.
                    line.replace(re_value, function (m0, m1, m2, m3) {
                        // Remove backslash from \' in single quoted values.
                        if (m1 !== undefined)
                            a.push(m1.replace(/\\'/g, "'"));
                        // Remove backslash from \" in double quoted values.
                        else if (m2 !== undefined)
                            a.push(m2.replace(/\\"/g, '"'));
                        else if (m3 !== undefined)
                            a.push(m3);
                        return ''; // Return empty string.
                    });
                    // Handle special case of empty last value.
                    if (/,\s*$/.test(line))
                        a.push('');
                    a.forEach(function (cell) {
                        if (first_1)
                            html_1 += "<th>" + cell + "</th>";
                        else
                            html_1 += "<td>" + cell + "</td>";
                    });
                    if (first_1) {
                        html_1 += "</tr></thead>";
                        first_1 = false;
                    }
                    else
                        html_1 += "</tr>";
                });
                return html_1 += "</table>";
            }
            else {
                // File Extension not included in list of known file extensions
                return "Include-Error: Invalid File extension";
            }
        });
    }
};

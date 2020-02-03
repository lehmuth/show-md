import fs from 'fs';
import path from 'path';
import { Converter, ConverterOptions } from 'showdown';
export default {
	type: 'lang',
	filter: function(text: string, converter: Converter, options: ConverterOptions | undefined): string{
		return text.replace(/!{(.*)}/gi, function(str){
			let href = str.substring(2, str.length - 1);
			let filename: string;
			if(options)
				filename = path.join(options.fileDir, href);
			else
				return "Include-Error: fileDir not set.";
			try {
				let stat = fs.statSync(filename);
				if(stat.isDirectory()){
					return "Include-Error: Path is a directory.";
				}
			} catch (e) {
				//Exception in case of the file does not exist
				return "Include-Error: File does not exist.";
			}
			if(options.includeExtensions.includes(path.extname(filename).substr(1))) {
				let file = fs.readFileSync(filename, 'utf-8');
				return converter.makeHtml(file);
			} else if (path.extname(filename) === '.csv') {
				let file = fs.readFileSync(filename, 'utf-8');
				let html = "<table>";
				let first = true;
				file.split("\n").forEach(function (line) {
					if(first)
						html += "<thead><tr>"
					else
						html += "<tr>"
					let re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
					var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
					if (!re_valid.test(line)) return "Include-Error: Invalid CSV file";
					var a = [];                     // Initialize array to receive values.
					line.replace(re_value, function(m0, m1, m2, m3) {
							// Remove backslash from \' in single quoted values.
							if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
							// Remove backslash from \" in double quoted values.
							else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
							else if (m3 !== undefined) a.push(m3);
							return ''; // Return empty string.
					});
					// Handle special case of empty last value.
					if (/,\s*$/.test(line)) a.push('');
						a.forEach(function (cell) {
							if(first)
								html += "<th>" + cell + "</th>"
							else
								html += "<td>" + cell + "</td>"
						})
						if (first) {
							html += "</tr></thead>"
							first = false;
						} else
							html += "</tr>"
				});
				return html += "</table>"
			} else {
				// File Extension not included in list of known file extensions
				return "Include-Error: Invalid File extension";
			}
		});
	}
}

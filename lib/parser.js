const showdown  = require('showdown');
const fs = require('fs');

class Parser{
	constructor(config){
		this.config = config;
		//Initialize and configure showdown converter
		const include = require('./extensions/include.js');
		include.config = config;
		showdown.extension('include', include);
		this.converter = new showdown.Converter({ extensions: [include] });
		this.converter.setOption('tables', true);							//enable tables
		this.converter.setOption('customizedHeaderId', true);				//makes it possible to select a custom header id with {custom_id}
		this.converter.setOption('ghCompatibleHeaderId', true);				//generates header ids compatible with github style (spaces are replaced with dashes and a bunch of non alphanumeric chars are removed)
		this.converter.setOption('parseImgDimensions', true);				//makes it possible to add dimensions to image includes
		this.converter.setOption('tasklists', true);						//enables the option of tasklists with [ ] and [x]
		this.converter.setOption('emoji', true);							//enables emoji import
		this.converter.setOption('underline', true);						//enables underline with __
		this.converter.setOption('strikethrough', true);					//enables strikethrew with ~~
	}

	//Parse a markdown content into html content
	mdToHtml(md){
		//Use showdown parser
		var html_content = this.converter.makeHtml(md);
		return this.generateHtmlFile(html_content);
	}

	//Generate html file
	generateHtmlFile(content){
		var html = '\
			<!DOCTYPE html>\
			<html lang="' + this.config.getLanguage() + '">\
				<head>\
					<meta charset="utf-8"/>\
					<meta name="viewport" content="width=device-width, initial-scale=1">\
					<link rel="stylesheet" type="text/css" href="' + this.config.getStylesheet() + '"/>\
				</head>\
				<body>\
					<div class="markdown-body">\
						' + content + '\
					</div>\
				</body>\
			</html>';
		return html;
	}
}

module.exports = Parser;
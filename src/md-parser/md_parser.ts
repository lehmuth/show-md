import { EventEmitter } from 'events';
import { ShowMdConfig } from '../config/config';
import { Converter, Extension, extension } from 'showdown';
import include from './extensions/include';
import path from 'path';

export class ShowMdParser extends EventEmitter {
  config: ShowMdConfig;
  converter: Converter;
  constructor (config: ShowMdConfig) { 
    super();
    this.config = config ?? new ShowMdConfig();
    // Initialize and configure showdown converter
    extension('include', include);
    this.converter = new Converter({ extensions: [include] });
    this.converter.setOption('tables', true);							// enable tables
    this.converter.setOption('customizedHeaderId', true);				// makes it possible to select a custom header id with {custom_id}
    this.converter.setOption('ghCompatibleHeaderId', true);				// generates header ids compatible with github style (spaces are replaced with dashes and a bunch of non alphanumeric chars are removed)
    this.converter.setOption('parseImgDimensions', true);				// makes it possible to add dimensions to image includes
    this.converter.setOption('tasklists', true);						// enables the option of tasklists with [ ] and [x]
    this.converter.setOption('emoji', true);							// enables emoji import
    this.converter.setOption('underline', true);						// enables underline with __
    this.converter.setOption('strikethrough', true);					// enables strikethrew with ~~
    this.converter.setOption('includeExtensions', this.config.getIncludeExtensions());
  }

  setFilePath (filename: string): void {
    filename = path.dirname(path.resolve(filename));
    this.converter.setOption('fileDir', filename);
  }

  // Parse a markdown content into html content
  mdToHtml (md: string): string {
    // Use showdown parser
    let htmlContent = this.converter.makeHtml(md);
    return this.generateHtmlFile(htmlContent);
  }

  // Generate html file
  generateHtmlFile (content: string): string {
    let html = '\
			<!DOCTYPE html>\
			<html lang="' + this.config.getLanguage() + '">\
				<head>\
					<meta charset="utf-8"/>\
					<meta name="viewport" content="width=device-width, initial-scale=1">\
					<link rel="stylesheet" type="text/css" href="/ressources/style/' + this.config.getStylesheet() + '"/>\
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

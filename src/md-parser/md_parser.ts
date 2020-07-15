import { EventEmitter } from 'events';
import { ShowMdConfig } from '../config/config';
import { Converter, Extension, extension } from 'showdown';
import include from './extensions/include';
import replaceLinks from './extensions/replace-links';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export class ShowMdParser extends EventEmitter {
  config: ShowMdConfig;
  converter: Converter;
  constructor(config?: ShowMdConfig) {
    super();
    this.config = config ?? new ShowMdConfig();
    // Initialize and configure showdown converter
    extension('include', include);
    extension('replaceLinks', replaceLinks);

    this.converter = this.initConverter(false);
  }

  private initConverter(build: boolean): Converter {
    let extensions = [];
    extensions.push('include');
    if (build) {
      extensions.push('replaceLinks');
    }

    let converter = new Converter({ extensions });
    converter.setOption('customizedHeaderId', true); // makes it possible to select a custom header id with {custom_id}
    converter.setOption('tables', true); // enable tables
    converter.setOption('ghCompatibleHeaderId', true); // generates header ids compatible with github style (spaces are replaced with dashes and a bunch of non alphanumeric chars are removed)
    converter.setOption('parseImgDimensions', true); // makes it possible to add dimensions to image includes
    converter.setOption('tasklists', true); // enables the option of tasklists with [ ] and [x]
    converter.setOption('emoji', true); // enables emoji import
    converter.setOption('underline', true); // enables underline with __
    converter.setOption('strikethrough', true); // enables strikethrew with ~~
    converter.setOption(
      'includeExtensions',
      this.config.getIncludeExtensions()
    );

    return converter;
  }

  setFilePath(filename: string): void {
    filename = path.dirname(path.resolve(filename));
    this.converter.setOption('fileDir', filename);
  }

  // Parse a markdown content into html content
  mdToHtml(md: string): string {
    // Use showdown parser
    let htmlContent = this.converter.makeHtml(md);
    return this.generateHtmlFile(htmlContent);
  }

  // Generate html file
  generateHtmlFile(content: string): string {
    let html = `
<!DOCTYPE html>
<html lang="${this.config.getLanguage()}">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="/ressources/style/${this.config.getStylesheet()}"/>
  </head>
  <body>
    <div class="markdown-body">
      ${content}
    </div>
  </body>
</html>`;
    return html;
  }

  build(inputDir: string, outputDir: string): boolean {
    let inputStats = fs.statSync(inputDir);

    if (!inputStats.isDirectory()) {
      console.log('Your specified input is no directory!');
    }

    if (fs.existsSync(outputDir)) {
      let outputStats = fs.statSync(outputDir);
      if (!outputStats.isDirectory()) {
        console.log('The specified output path is no directory!');
        return false;
      }
    } else {
      fs.mkdirSync(outputDir);
    }

    fs.readdir(inputDir, (err, files) => {
      //handling error
      if (err) {
        console.log('Unable to scan input directory: ' + inputDir);
        return false;
      }

      this.converter = this.initConverter(true);
      //listing all files
      files.forEach((file) => {
        let fileInputPath = path.resolve(inputDir, file);
        let fileOutputPath = path.resolve(outputDir, file);
        let stat = fs.statSync(fileInputPath);
        if (stat.isDirectory()) {
          this.build(fileInputPath, fileOutputPath);
        } else if (file.match(/.*\.(md)|(MD)$/i)) {
          let data = fs.readFileSync(fileInputPath, 'utf-8');
          this.setFilePath(inputDir);
          // Rename Readme.md to index.md
          fileOutputPath.replace(/.*(README).md$/i, '$1index$2');
          // Rename markdown file to html file
          fileOutputPath = fileOutputPath.slice(0, -2) + 'html';
          fs.writeFileSync(fileOutputPath, this.mdToHtml(data));
        } else if (file.match(/.*\.(jpg|png|gif|ico|ttf|css|js)$/i)) {
          fs.writeFileSync(fileOutputPath, fs.readFileSync(fileInputPath));
        } else {
          console.log('illegal file extension: ', file);
        }
      });

      this.converter = this.initConverter(false);
    });

    // Copy Resources
    let resourcesInputDir = path.resolve(__dirname, '../public');
    let resourcesOutputDir = path.resolve(outputDir, 'resources');
    this.build(resourcesInputDir, resourcesOutputDir);

    return true;
  }
}

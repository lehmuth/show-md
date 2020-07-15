import { EventEmitter } from 'events';
import { ShowMdConfig } from '../config/config';
import { Converter, Extension, extension } from 'showdown';
import include from './extensions/include';
import replaceLinks from './extensions/replace-links';
import replaceReadme from './extensions/replace-readme';
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
    extension('replaceReadme', replaceReadme);

    this.converter = this.initConverter(false);
  }

  private initConverter(build: boolean): Converter {
    let extensions = [];
    extensions.push('include');
    if (build) {
      extensions.push('replaceLinks');
      extensions.push('replaceReadme');
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
    <link rel="stylesheet" type="text/css" href="/resources/style/${this.config.getStylesheet()}"/>
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
    this.converter = this.initConverter(true);

    this.buildDir(inputDir, outputDir);

    // Copy Resources
    let resourcesInputDir = path.resolve(__dirname, '../public');
    let resourcesOutputDir = path.resolve(outputDir, 'resources');
    this.buildDir(resourcesInputDir, resourcesOutputDir);

    // Copy fonts
    let fontsInputDir = path.resolve(__dirname, '../../assets/fonts');
    let fontsOutputDir = path.resolve(outputDir, 'resources/fonts');
    this.buildDir(fontsInputDir, fontsOutputDir);

    // Copy icons
    let iconsInputDir = path.resolve(__dirname, '../../assets/icons');
    this.buildDir(iconsInputDir, outputDir);

    this.converter = this.initConverter(false);
    return false;
  }

  private buildDir(inputDir: string, outputDir: string): boolean {
    let inputStats = fs.statSync(inputDir);

    if (!inputStats.isDirectory()) {
      console.log('Your specified input is no directory!');
      return false;
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

    let files: string[] = [];
    try {
      files = fs.readdirSync(inputDir);
    } catch (err) {
      //handling error
      if (err) {
        console.log('Unable to scan input directory: ' + inputDir);
        return false;
      }
    }

    //listing all files
    files.forEach((file) => {
      let fileInputPath = path.resolve(inputDir, file);
      let fileOutputPath = path.resolve(outputDir, file);
      let stat = fs.statSync(fileInputPath);
      if (stat.isDirectory()) {
        this.buildDir(fileInputPath, fileOutputPath);
      } else if (file.match(/.*\.md$/i)) {
        let data = fs.readFileSync(fileInputPath, 'utf-8');
        this.setFilePath(inputDir);
        // Rename Readme.md to index.md
        fileOutputPath = fileOutputPath.replace(
          /(.*)README(\.md)$/im,
          '$1index$2'
        );
        // Rename markdown file to html file
        fileOutputPath = fileOutputPath.slice(0, -2) + 'html';
        console.log('md file: ', fileOutputPath);
        try {
          fs.writeFileSync(fileOutputPath, this.mdToHtml(data));
        } catch (err) {
          console.log(err);
        }
      } else if (file.match(/.*\.(jpg|png|gif|ico|ttf|css|js|txt)$/i)) {
        console.log('asset file: ', fileOutputPath);
        try {
          fs.writeFileSync(fileOutputPath, fs.readFileSync(fileInputPath));
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('illegal file extension: ', file);
      }

      return true;
    });

    return false;
  }
}

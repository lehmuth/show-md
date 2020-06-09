import { EventEmitter } from "events";
import { Configuration } from "./config";
import fs from "fs";
import path from 'path';
import { extensions } from "showdown";


export class ConfigProvider extends EventEmitter {

    config: Configuration;

    constructor () {
        super();
        this.config = new Configuration();
    }

    applySmdconfigFile (filePath: string) {
        filePath = path.normalize(filePath);
        let loadedConfig = require(filePath);
        
        if(loadedConfig.port) {
            this.config.setPort(loadedConfig.port);
        }

        if(loadedConfig.language) {
            this.config.setLanguage(loadedConfig.language);
        }

        if(loadedConfig.stylesheet) {
            this.config.setStylesheet(loadedConfig.stylesheet);
        }

        if(loadedConfig.defaultFile) {
            this.config.setDefaultFile(loadedConfig.defaultFile);
        }

        if(loadedConfig.includeExtensions) {
            (loadedConfig.includeExtensions as string[])
                    .map((extension) => this.config.addIncludeExtension(extension));
        }

        if(loadedConfig.pathVariables) {
            (loadedConfig.pathVariables as [string, string][])
                    .map((variable) => this.config.addPath(variable[0], variable[1]));
        }

        if(loadedConfig.htDirs) {
            (loadedConfig.htDirs as string[])
                    .map((htdir) => this.config.addHtDir(htdir));
        }

        if(loadedConfig.registeredStylesheets) {
            (loadedConfig.registeredStylesheets as [string, string][])
                    .map((stylesheet) => this.config.registerStylesheet(stylesheet[0], stylesheet[1]));
        }

        if(loadedConfig.errorFiles) {
            (loadedConfig.errorFiles as [number, string][])
                    .map((errorFile) => this.config.addErrorFile(errorFile[0], errorFile[1]))
        }
    }
}
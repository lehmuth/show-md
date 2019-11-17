const path = require('path');
const EventEmitter = require('events');

const defaults = {
	htdocs: path.resolve('htdocs'),
	rootPath: process.cwd(),
	language: "en",
	stylesheetName: "default",
	stylesheetPath: "/resources/style/default.css",
	port: 56657,
	httpLogPath: path.resolve("logs/http.log"),
	logPath: path.resolve("logs/system.log")
};

class Config extends EventEmitter{
	setHtdocs(htdocs){
		this.htdocs = path.resolve(htdocs);
	}
	getHtdocs(){
		return this.htdocs || defaults.htdocs;
	}
	setRootPath(rootPath){
		this.rootPath = path.resolve(rootPath);
	}
	getRootPath(){
		return this.rootPath || defaults.rootPath;
	}
	setLanguage(language){
		this.language = language;
	}
	getLanguage(){
		return this.language || defaults.language;
	}
	setStylesheet(stylesheet){
		this.stylesheet = stylesheet;
	}
	getStylesheet(){
		return this.stylesheet || defaults.stylesheetName;
	}
	getStylesheetPath(){
		switch(this.getStylesheet()){
			case "none":
				return "/resources/style/none.css";
			case "default":
				return "/resources/style/default.css";
			case "github":
				return "/resources/style/github.css";
			case /\.(css|CSS)$/:
				var filename = path.resolve(this.getRootPath() + this.getStylesheet());
				try {
					//Check whether stylesheet is a file
					var stat = fs.statSync(filename);
					if(stat.isFile())
						return path.relative(this.getRootPath(), filename);
				} catch (e) {
					this.emit('warning', 'The currently specified stylesheet does not exist. Fallback to default was performed.')
				}
				break;
			default:
				this.emit('warning', 'The currently specified stylesheet is not a stylesheet. Fallback to default was performed.');
				break;
		}
		return defaults.stylesheetPath;
	}
	setPort(port){
		this.port = port;
	}
	getPort(){
		return this.port || defaults.port;
	}
	setHttpLogPath(httpLogPath){
		this.httpLogPath = path.resolve(httpLogPath);
	}
	getHttpLogPath(){
		return this.httpLogPath || defaults.httpLogPath;
	}
	setLogPath(logPath){
		this.logPath = path.resolve(logPath);
	}
	getLogPath(){
		return this.logPath || defaults.logPath;
	}
};

module.exports = new Config();

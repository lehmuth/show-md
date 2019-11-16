module.exports = function(appRoot){
	const path = require('path');
	var config = {
		setAppRoot: function(appRoot){
			this.appRoot = path.resolve(appRoot);
		},
		getAppRoot: function(){
			return this.appRoot;
		},
		setHtDocs: function(htDocs){
			this.htDocs = path.resolve(htDocs);
		},
		getHtDocs: function(){
			return this.htDocs;
		},
		setRootPath: function(rootPath){
			this.rootPath = path.resolve(rootPath);
		},
		getRootPath: function(){
			return this.rootPath;
		},
		setLanguage: function(language){
			this.language = language;
		},
		getLanguage: function(){
			return this.language;
		},
		setStylesheet: function(stylesheet){
			this.stylesheet = stylesheet;
		},
		getStylesheet: function(){
			return this.stylesheet;
		},
		getStylesheetPath: function(){
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
						log.warning("The given stylesheet does not exist.");
					}
					break;
				default:
					log.warning("The given file is not a stylesheet.");
					break;
			}
			return "/resources/style/default.css";
		}
		setPort: function(port){
			this.port = port;
		},
		getPort: function(){
			return this.port;
		}
	};
	config.setAppRoot(appRoot);
	config.setHtDocs(config.getAppRoot() + '/htdocs');
	config.setRootPath(process.cwd());
	config.setLanguage("en");
	config.setStylesheet("default");
	config.setPort(56657);
	return config;
}

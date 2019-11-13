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
		}
	};
	config.setAppRoot(appRoot);
	config.setHtDocs(config.getAppRoot() + '/htdocs');
	config.setRootPath(process.cwd());
	config.setLanguage("en");
	config.setStylesheet("/resources/style/default.css");
	return config;
}

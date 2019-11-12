module.exports = {
	rootPath: process.cwd(),
	language: "en",
	stylesheet: "/resources/style/default.css",
	setRootPath: function(rootPath){
		this.rootPath = _rootPath;
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
module.exports = function(appRoot){
	return{
		appRoot: appRoot,
		rootPath: process.cwd(),
		language: "en",
		stylesheet: "/resources/style/default.css",
		getAppRoot: function(){
			return this.appRoot;
		},
		setRootPath: function(rootPath){
			this.rootPath = rootPath;
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
}

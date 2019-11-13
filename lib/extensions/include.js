module.exports = function(config){
	const fs = require('fs');
	return {
		type: 'lang',
		filter: function(text, converter, options){
			return text.replace(/!{(.*)}/gi, function(str){
				var href = str.substring(2, str.length - 1);
				href = href.replace(/\\/g, '/');
				var file = fs.readFileSync(config.getRootPath() + '/htdocs' + href, 'utf-8');
				return converter.makeHtml(file);
			});
		}
	}
}

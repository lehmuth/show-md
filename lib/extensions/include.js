module.exports = () => {
	const fs = require('fs');
	const path = require('path');
	return {
		type: 'lang',
		filter: function(text, converter, options){
			return text.replace(/!{(.*)}/gi, function(str){
				var href = str.substring(2, str.length - 1);
				var filename = path.join(options.fileDir, href);
				try {
	        var stat = fs.statSync(filename);
	        if(stat.isDirectory()){
						return "Include-Error: Path is a directory.";
	  	    }
	      } catch (e) {
	  	    //Exception in case of the file does not exist
	        return "Include-Error: File does not exist.";
	      }
				var file = fs.readFileSync(filename, 'utf-8');
				return converter.makeHtml(file);
			});
		}
	}
}

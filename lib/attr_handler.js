//Parse start arguments
module.exports.parseArguments = function(args, config){
	var i;
	const log = require('./log.js');
	const fs = require('fs');
	for(i = 0; i < args.length; i++){
		switch(args[i]){
			//-p [path] flag for path to root directory
			case "-p":
			case "-P":
			case "--path":
			case "--PATH":
			case "/p":
			case "/P":
			case "/path":
			case "/PATH":
				if(++i < args.length && !args[i].match(/^(-|\/).*/)){
					try {
						//Check whether root path contains a directory
						var stat = fs.statSync(args[i]);
						if(stat.isDirectory())
							config.setRootPath(args[i].replace(/\//g, '\\'));
					} catch (e) {
						log.error("The given path is not a directory.\n");
					}
				}else{
					log.error("You have to specify a path after " + args[--i] + "!");
				}
				break;
			case "-l":
			case "-L":
			case "--LANG":
			case "--lang":
			case "/l":
			case "/L":
			case "/LANG":
			case "/lang":
				if(++i < args.length && !args[i].match(/^(-|\/).*/)){
					//Set language for html file
					config.setLanguage(args[i]);
				}else{
					log.error("You have to specify a language after " + args[--i] + "!\nFor example: " + args[--i] + " en");
				}
				break;
			case "-s":
			case "-S":
			case "--STYLE":
			case "--style":
			case "/s":
			case "/S":
			case "/STYLE":
			case "/style":
				if(++i < args.length && !args[i].match(/^(-|\/).*/)){
					switch(args[i]){
						case "none":
							config.setStylesheet("/resources/style/none.css");
							break;
						case "github":
							config.setStylesheet("/resources/style/github.css");
							break;
						case /\.css$/:
							try {
								//Check whether stylesheet is a file
								var stat = fs.statSync(args[i]);
								if(stat.isFile())
									config.setStylesheet(args[i].replace(/\//g, '\\'));
							} catch (e) {
								log.error("The given path is not a stylesheet.\n");
							}
							break;
					}
				}else{
					log.error("You have to specify a path after " + args[--i] + "!");
				}
				break;
			case "--PORT":
			case "--port":
			case "/PORT":
			case "/port":
				if(++i < args.length && !args[i].match(/^(-|\/).*/)){
					//Set port for server
					config.setPort(args[i]);
				}else{
					log.error("You have to specify a port after " + args[--i] + "!\nFor example: " + args[--i] + " 56657");
				}
				break;
		}
	}

	log.info("Current root directory: " + config.getRootPath());
	log.info("Current language: " + config.getLanguage());
	log.info("Current stylesheet: " + config.getStylesheet());
	log.info("Current Port: " + config.getPort());
}

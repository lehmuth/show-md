//Parse start arguments
module.exports.parseArguments = function(args, config){
	var i;
	const log = require('./log.js');
	const fs = require('fs');
	for(i = 0; i < args.length; i++){
		switch(args[i]){
			//-p [path] flag for path to root directory
			case "-d":
			case "-D":
			case "--dir":
			case "--DIR":
				if(++i < args.length && !args[i].match(/^-.*/)){
					try {
						//Check whether root path contains a directory
						var stat = fs.statSync(args[i]);
						if(stat.isDirectory())
							config.setRootPath(args[i]);
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
				if(++i < args.length && !args[i].match(/^-.*/)){
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
				//This argument needs a value, its located in the next array element.
				if(++i < args.length && !args[i].match(/^-.*/)){
					config.setStylesheet(args[i]);
				}else{
					log.error("You have to specify a path after " + args[--i] + "!");
				}
				break;
			case "-p":
			case "-P":
			case "--PORT":
			case "--port":
				if(++i < args.length && !args[i].match(/^-.*/)){
					//Set port for server
					config.setPort(args[i]);
				}else{
					log.error("You have to specify a port after " + args[--i] + "!\nFor example: " + args[--i] + " 56657");
				}
				break;
		}
	}

	log.info("Current root directory: " + config.getRootPath());
	log.info("htdocs directory: " + config.getHtdocs());
	log.info("Current language: " + config.getLanguage());
	log.info("Current stylesheet: " + config.getStylesheet());
	log.info("Current Port: " + config.getPort());
}

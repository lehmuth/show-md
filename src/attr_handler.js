//Parse start arguments
module.exports.parseArguments = function(args, showmd){
	var i;
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
							showmd.config.setRootPath(args[i]);
					} catch (e) {
						showmd.log.error("The given path is not a directory.\n");
					}
				}else{
					showmd.log.error("You have to specify a path after " + args[--i] + "!");
				}
				break;
			case "-l":
			case "-L":
			case "--LANG":
			case "--lang":
				if(++i < args.length && !args[i].match(/^-.*/)){
					//Set language for html file
					showmd.config.setLanguage(args[i]);
				}else{
					showmd.log.error("You have to specify a language after " + args[--i] + "!\nFor example: " + args[--i] + " en");
				}
				break;
			case "-s":
			case "-S":
			case "--STYLE":
			case "--style":
				//This argument needs a value, its located in the next array element.
				if(++i < args.length && !args[i].match(/^-.*/)){
					showmd.config.setStylesheet(args[i]);
				}else{
					showmd.log.error("You have to specify a path after " + args[--i] + "!");
				}
				break;
			case "-p":
			case "-P":
			case "--PORT":
			case "--port":
				if(++i < args.length && !args[i].match(/^-.*/)){
					//Set port for server
					showmd.config.setPort(args[i]);
				}else{
					showmd.log.error("You have to specify a port after " + args[--i] + "!\nFor example: " + args[--i] + " 56657");
				}
				break;
		}
	}
}

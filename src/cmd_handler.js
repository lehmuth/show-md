module.exports = function(showmd){
	const log = require('./log.js');
	const readline = require('readline');
	const fs = require('fs');

	//Init input stream
	var input = process.stdin;
	// Set input character encoding.
	input.setEncoding('utf-8');
	return {
		start: function(){
			input.on('data', function(data){
				data = data.replace(/(\r|\n)/g, '');
				var argv = data.split(' ');
				switch(argv[0]){
					case '':
						break;
					case "root":
					case "ROOT":
						showmd.log.info(showmd.config.getRootPath());
					case 'exit':
					case 'EXIT':
						process.exit();
					case 'help':
					case 'HELP':
						showmd.log.info('EXIT to stop the server and shut down show-md.\n');
						break;
					default:
						schowmd.log.warning("Unknown command! Enter help for more detailed information.\n");
				}
			});
		}
	}
}

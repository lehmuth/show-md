const config = require('./config.js');
const log = require('./log.js');
const readline = require('readline');
const fs = require('fs');

var input = process.stdin;
//Loop that reads commands from input and reacts
exports.runInputLoop = function(){
	//Init input stream
	// Set input character encoding.
	input.setEncoding('utf-8');
	input.on('data', function(data){
		switch(data.substring(0, data.length - 2)){
			case '':
				break;
			case 'exit':
			case 'EXIT':
				process.exit();
			case 'help':
			case 'HELP':
				log.info('EXIT to stop the server and shut down show-md.\n');
				break;
			default:
				log.warning("Unknown command! Enter help for more detailed information.\n");
		}
	});
}
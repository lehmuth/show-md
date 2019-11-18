module.exports = function(showmd){
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
						break;
					case 'stop':
					case 'STOP':
						showmd.stop();
						break;
					case 'exit':
					case 'EXIT':
						if(showmd.isRunning()){
							showmd.once('stoped', () => {process.exit(0);});
							showmd.stop();
						}else{
							process.exit();
						}
						break;
					case 'help':
					case 'HELP':
						showmd.log.info('EXIT to stop the server and shut down show-md.\n');
						break;
					default:
						showmd.log.error("Unknown command \"" + argv[0] + "\"! Enter help for more detailed information.\n");
				}
			});
		}
	}
}

/** log functions */
exports.info = function(info){
	console.log("\x1b[37m%s\x1b[0m", info);
}

exports.success = function(info){
	console.log("\x1b[32m%s\x1b[0m", info);
}

exports.warning = function(info){
	console.log("\x1b[31m%s\x1b[0m", info);
}

exports.error = function(info){
	console.log("\x1b[31m%s\x1b[0m", info);
	process.exit();
}

exports.access = function(info){
	console.log("\x1b[37m%s\x1b[0m", info);
}
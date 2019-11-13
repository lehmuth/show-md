/** log functions */
module.exports.info = function(info){
	console.log("\x1b[37m%s\x1b[0m", info);
}

module.exports.success = function(info){
	console.log("\x1b[32m%s\x1b[0m", info);
}

module.exports.warning = function(info){
	console.log("\x1b[31m%s\x1b[0m", info);
}

module.exports.error = function(info){
	console.log("\x1b[31m%s\x1b[0m", info);
	process.exit();
}

module.exports.access = function(info){
	console.log("\x1b[37m%s\x1b[0m", info);
}

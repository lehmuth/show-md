module.exports = function(config){
  let app_root = config.getAppRoot() + '/htdocs';
  const http = require('http');
  const fs = require('fs');
  const url = require('url');
  const path = require('path');
  const log = require('./log.js');
  const Parser = require('./parser.js');

  /** Initial setup */
  //get argument array
  var parser = new Parser(config);

  /** Start Server and handle requests */
  const server = http.createServer();

  server.on('request', (req, res) => {
    //get path to file
  	var href = url.parse(req.url, true).path;
  	log.access("REQUEST:  " + href);

    var filename = path.join(config.getRootPath(), href);
    if(filename.indexOf(config.getRootPath()) !== 0) {
      return sendError(403);
    }
    try {
      var stat = fs.statSync(filename);
      if(stat.isDirectory()){
			  //Check default file
		    stat = fs.statSync(path.join(filename, "README.md"));
        //setze pfad wenn standard-datei existiert
  			if(stat.isFile())
  				filename = path.join(filename, "README.md");
	    }
    } catch (e) {
	    //Exception in case of the file does not exist
      //Check htdocs directory
    	if(href.match(/^\/favicon\.ico$/))
    		href = '/resources/icons/favicon.ico';
      filename = path.join(config.getHtDocs(), href);
      if(filename.indexOf(config.getHtDocs()) !== 0) {
        return sendError(403);
      }
      try {
        var stat = fs.statSync(filename);
        if(stat.isDirectory()){
  			  //Check default file
  		    stat = fs.statSync(path.join(filename, "README.md"));
          //setze pfad wenn standard-datei existiert
    			if(stat.isFile())
    				filename = path.join(filename, "README.md");
  	    }
      } catch (e) {
  	    //Exception in case of the file does not exist
        sendError(404);
      }
    }
  	/** Check file extension for allowed file types */
  	//Check whether requested file is a markdown file
  	if(filename.match(/(.*\.md$)/i)){
  		fs.readFile(filename, "utf-8", function(err, data) {
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.end(parser.mdToHtml(data));
  			log.access("RETURNED: " + filename);
  		});
  	}
  	//Check whether requested file is an image or js file
  	else if(filename.match(/(.*\.(jpg|png|gif|ico|ttf)$)/i)){
  		fs.readFile(filename, function(err, data) {
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.end(data, 'binary');
  			log.access("RETURNED: " + filename);
  		});
  	}
  	//Check wheather requested file is a css file
  	else if(filename.match(/(.*\.css$|.*\.js$)/i)){
  		fs.readFile(filename, 'utf-8', function(err, data) {
  			res.writeHead(200, {'Content-Type': 'text/css'});
  			res.end(data);
  			log.access("RETURNED: " + filename);
  		});
  	}
  	//Other file extensions are forbidden
  	else if(filename.match(/(.*\..*$)/i)){
  		log.access("ERROR 403: " + href);
  		res.writeHead(403, {'Content-Type': 'text/html'});
  		return res.end("403 Forbidden");
  	}
    function sendError(err){
      errorpath = path.join(config.getHtDocs(), "error/error" + err + ".md");
      fs.readFile(errorpath, 'utf-8', function(err, data) {
        res.writeHead(err, {'Content-Type': 'text/html'});
  			res.end(parser.mdToHtml(data));
        log.access("ERROR " + err + ": " + filename);
  		});
    }
  });
  server.on('clientError', (err, socket) => {
  	log.info(err);
  	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });
  return {
    port: 80,
    listen: function(){
      server.listen(this.port);
    },
    getPort: function(){
      return this.port;
    },
    setPort: function(port){
      this.port = port;
    }
  }
}

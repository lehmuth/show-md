module.exports = function(config){
  let app_root = config.getAppRoot() + '/htdocs';
  const http = require('http');
  const fs = require('fs');
  const url = require('url');
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
  	var path = buildPath(href, app_root, config.getRootPath());
    log.info(path);

  	//TODO: verify href
  	//Check whether file exists and is directory
  	try {
        var stat = fs.statSync(path);
        if(stat.isDirectory()){
  			//Check default file
  			   stat = fs.statSync(path + "README.md");
  			if(stat.isFile())
  				path += "README.md";
		    }
      } catch (e) {
  		//Exception in case of the file does not exist
          log.access("ERROR 404: " + href);
	        res.writeHead(404, {'Content-Type': 'text/html'});
		      return res.end("404 Not Found");
      }
  	/** Check file extension for allowed file types */
  	//Check whether requested file is a markdown file
  	if(path.match(/(.*\.md$)/i)){
  		fs.readFile(path, "utf-8", function(err, data) {
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.end(parser.mdToHtml(data));
  			log.access("RETURNED: " + path);
  		});
  	}
  	//Check whether requested file is an image or js file
  	else if(path.match(/(.*\.(jpg|png|gif|ico|ttf)$)/i)){
  		fs.readFile(path, function(err, data) {
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.end(data, 'binary');
  			log.access("RETURNED: " + path);
  		});
  	}
  	//Check wheather requested file is a css file
  	else if(path.match(/(.*\.css$|.*\.js$)/i)){
  		fs.readFile(path, 'utf-8', function(err, data) {
  			res.writeHead(200, {'Content-Type': 'text/css'});
  			res.end(data);
  			log.access("RETURNED: " + path);
  		});
  	}
  	//Other file extensions are forbidden
  	else if(path.match(/(.*\..*$)/i)){
  		log.access("ERROR 403: " + href);
  		res.writeHead(403, {'Content-Type': 'text/html'});
  		return res.end("403 Forbidden");
  	}
  });
  server.on('clientError', (err, socket) => {
  	log.info(err);
  	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  server.listen(8080);

  function buildPath(href, app_root, root_path){
  	//generalize style
  	href.replace(/\\/g, '/');
  	//remove double dots for parent directory
  	href.replace(/\/\.\.\//, '');

  	href.replace(/^\./, root_path);

  	if(href.match(/^\/favicon\.ico$/))
  		href = '/resources/icons/favicon.ico';
  	var path;
  	if(href.match(/^(\/resources\/|\/wiki\/)/))
  		path = app_root + href;
  	else
  		path = root_path + href;

  	return path;
  }
}

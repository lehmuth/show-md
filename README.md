# show-md - short user guide
show-md is a node application which converts Markdown files to html files and hosts them on a HTTP server, ready to show in browser. To convert markdown to html [showdown](https://github.com/showdownjs/showdown/) is used, with additional extensions.

This application is not made for usage as a public web server, but only for local usage on localhost. Before usage validate the configuration of your firewall to prevent public access.

**Table of contents:**
- 1.Installation guide
	- 1.1. Requirements
	- 1.2. Installation stable version with npm (recommended)
	- 1.3. Install nightly build with npm
	- 1.4. Install manually
- 2. Usage as CLI application
	- 2.1. start
	- 2.2. stop
	- 2.3. exit
	- 2.4. help
	- 2.5. status
	- 2.6. root
	- 2.7. Concatinated usage
- 3. Usage as library
- 4. Configuration
- 5. Markdown syntax

## 1. Installation guide
There are diffrent approaches to install show-md on your local system.

### 1.1. Requirements
For installation and usage of show-md the following applications have to be installed on your system:
- [Node.js](https://github.com/nodejs/node)
- [npm](https://github.com/npm/cli)

### 1.2. Install stable version with npm (recommended)
To use show-md as a CLI-application downlaod it with `npm`:

	npm install --globally show-md@latest

To use show-md as dependency for your own project execute following command in your project directory:

	npm install show-md@latest --save

### 1.3. Install nightly build with npm
The nightly build is the most actual development version. It may contain bugs and errors, so it's not recommended to use is in a stable application.

To use show-md as a CLI-application downlaod it with `npm`:

	npm install --globally show-md@dev

To use show-md as dependency for your own project execute following command in your project directory:
	
	npm install show-md@dev --save

### 1.4. Install manually
To build the application from source code you have to clone the repository with the command:

	git clone https://github.org/lehmuth/show-md

To install show-md use the npm command line tool:

	npm install show-md

Because of the application is written in typescript it needs to be build. To do so you can use the command:

	npm run build

If you want to run the build immidiatly use following command instead:

	npm run prod

Otherwise, if you want to contribute in development there is a script for development hostage without build:

	npm run dev

## 2. Usage as CLI application
Open your command line and navigate to the root directory, where you want to open the show-md server. To run the application enter:

	show-md

This opens the show-md command line, where you can use the following commands.

### 2.1. start
To start the local http server run the `start` command:

	start [-d|--dir <path>]
		  [-p|--port <port>]
		  [-s|--style <path/to/style.css|default|github|none>]
		  [-l|--lang <html-lang-id>]

- **-d**: sets another root directory. Default is the current working directory.
- **-p**: changes the servers port. It is accessable by a browser with address: **http://localhost:[PORT]/**
- **-s**: set the theme by referencing a css file, or one of the available defaults:
	- __github__: Github markdown style by [Sindre Sorhus](https://sindresorhus.com/) [(github)](https://github.com/sindresorhus/github-markdown-css)
	- __default__: Default show-md design
	- __none__: No stylesheet, just pure HTML
- **-l**: set the language of your content. This is needed to justify paragraphs in html.

### 2.2. stop
To stop the local http server run the `stop` command:

	stop

### 2.3. exit
To exit the show-md command line and shut down the http server run the `exit` command:

	exit

### 2.4. help
To get a list of all known commands use the `help` command:

	help

### 2.5. status
To print the current status of the http server and it's configuration run the `status`command:

	status

### 2.6. root
To print the current root directory of your server configuration use the `root`command:

	root

### 2.7. Concatinated usage
To the show-md command you can add every other command to run it directly after the startup of the application. For example to start the server directly on port 80 use the following command:

	show-md start --port 80

## 3. Usage as library
It's  also possible to use show-md as a library if you just need the markdown parser or another part of the application you can import show-md as a library.

	var showMd = require('show-md');
	var parser = new showMd.ShowMdParser();
	var html = parser.mdToHtml('# Test');
	console.log(html);

The output of this code is:

	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link rel="stylesheet" type="text/css" href="/ressources/style/github"/>
		</head>
		<body>
			<div class="markdown-body">
			<h1 id="test">Test</h1>
			</div>
		</body>
	</html>

For more details read the [documentation](./docs/).

## 4. Configuration



## 5. Markdown syntax

Find a detailed syntax description in the wiki: [syntax](htdocs/wiki/syntax/)

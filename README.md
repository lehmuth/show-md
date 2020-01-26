# show-md - short user guide

show-md is a node.js application which converts Markdown files to html files and hosts them on a HTTP server, ready to show in browser. To convert markdown to html [showdown](https://github.com/showdownjs/showdown/) by [showdownjs](http://showdownjs.com/) is used, with additional extensions.

**Table of contents:**

- 1.[Installation guide](#install)
	- 1.1. [Installation with npm](#install_npm)
	- 1.2. [Install manually](#install_source)
- 2. [Usage](#usage)
- 3. [Markdown syntax](#syntax)

## 1. Installation guide {install}

There are diffrent approaches to install show-md on your local system.

### 1.1. Install stable version with npm (recommended){install_npm}

**Required:**

- [Node.js](https://github.com/nodejs/node)
- [npm](https://github.com/npm/cli)

To get the application with `npm` use:

	npm install show-md -g

### 1.2. Install manually {install_source}

**Required:**

- [Node.js](https://github.com/nodejs/node)
- [npm](https://github.com/npm/cli)

To build the application from source code you have to clone the repository with the command:

	git clone https://github.org/lehmuth/show-md

To install show-md use the npm command line tool, delivered with nodejs:

	npm install show-md

## 2. Usage {usage}

Open your command line and navigate to the root directory, where you want to open the show-md server. To execute type:

	show-md start [-d|--dir <path>]
				  [-p|--port <port>]
				  [-s|--style <path/to/style.css|default|github|none>]
				  [-l|--lang <html-lang-id>]

- **-d**: sets another root directory. Default is the current working directory.
- **-p**: changes the servers port. It is accessable by a browser with address: **http://localhost:[PORT]/**
- **-s**: set the theme by referencing a css file, or one of the available defaults:
	- __github__: Github markdown style by [Sindre Sorhus](https://sindresorhus.com/) [(github)](https://github.com/sindresorhus/github-markdown-css)
	- __default__: Default show-md design
	- __none__: No stylesheet, just pure HTML
- **-l**: set the language of your content. This is needed to justify paragraphs.

## 3. Markdown syntax {syntax}

Find a detailed syntax description in the wiki: [syntax](htdocs/wiki/syntax/)

# show-md - short user guide

show-md is a node.js application which converts .md-files (markdown) to html files and hosts them on a specified port,
ready to show in browser.

**Table of contents:**

- 1.[Installation guide](#install)
	- 1.1. [Installation with npm](#install_npm)
	- 1.2. [Install manually](#install_source)
- 2. [Usage](#usage)
- 3. [Markdown syntax](#syntax)

## 1. Installation guide {install}

There are diffrent approaches to install show-md on your local system.

### 1.1. Installation with npm (recommended){install_npm}

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

	show-md [-d|--dir <path>]
	        [-p|--port <port>]
					[-s|--style <path/to/style.css|default|github|none>]
					[-l|--lang <html-lang-id>]

- **-d** sets another root directory. Default is the current working directory.
- **-p** changes the servers port. It is accessable by a browser with address: **http://localhost:[PORT]/**

## 3. Markdown syntax {syntax}

Find a detailed syntax description in the wiki: [syntax](htdocs/wiki/syntax/)

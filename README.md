# show-md - short user guide

show-md is a node.js application which converts .md-files (markdown) to html files and hosts them on a specified port,
ready to show in browser. 

!{/wiki/table_of_contents.md}

## Instalation guide

To make it usable you have to clone the repository with the command:

	git clone https://github.org/lehmuth/show-md

Afterwards you have to add the path to the directory to your path environment variable, using the command:

	setx path "%path%;C:/path/to/show-md/root/"	
	
**Required:**

- [Node.js](https://nodejs.org)
- [Showdown.js](https://github.com/showdownjs/showdown)

To install showdownjs use the npm command line tool, delivered with nodejs:

	npm install showdown
	
## Usage

Open your command line and navigate to the root directory, where you want to open the show-md server. To execute type:

	node show-md.js [-p path][-l lang]
	
## Markdown syntax
Find a detailed syntax description in the wiki: [syntax](wiki/syntax/)


	
	
	


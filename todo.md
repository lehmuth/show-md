# TODOs:

## Server:
- [] customize file extension support

## Security:
- [] include root directory into include extension
- [x] Validate paths (path.resolve())
- [] Remove XSS problem

## Argument parser:
- [] --port to set port
- [] -v to enable verbose mode
- [] -s to enable silent mode
- [] --logs <file> to save logs in this file

## Command parser:
- [] root [set <path>] to show or set root directory
- [] show <file> to open file in browser
- [] ls [-a] | dir [/a] to list markdown files [or all files] and directories
- [] Tab for autocorrection

## Logs:
- [] write logs to file
- [] verbose mode
- [] quiet mode
- [] add timestamp

## Configs:
- [x]AppRoot-Path

## Markdown parser:
- [] include header
- [] include footer
- [] include sidebar

## Style:
- [] y-scroll bug in long documents
- [] print stylesheet for printer support
- [x]Style blockquotes in default.css (left-border)

## Batch launcher:
- [] show-md up [args] to run show-md in deamon thread
- [] show-md down [id] to shut down server
- [] show-md ls to list all active servers

## Other:
- [] command to parse includes in a specified md file or recursivly for every md file in a specified          directory
- [] open server in edit-mode or view-mode

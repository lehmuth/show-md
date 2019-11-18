#!/usr/bin/env node
//laoding default app
const showmd = require('../index.js');
const app = showmd.getDefaultApp();

//init logging
const path = require('path');
var logPath = path.join(__dirname, "../logs/system.log");
const log = require('simple-node-logger').createSimpleLogger(logPath);
log.setLevel("all");

//loading command parser
const cmdParser = new showmd.ShowMdCmdParser(app);
cmdParser.on('warning', (msg) => {log.warn(msg);});
cmdParser.on('error', (msg) => {log.error(msg);});
cmdParser.on('info', (msg) => {log.info(msg);});

//init Server
app.on('warning', (msg) => {log.warn(msg);});
app.on('error', (msg) => {log.error(msg);});
app.on('started', () => {log.info("Server started on http://localhost:" + app.config.getPort());});
app.on('stoped', () => {log.info("Server stoped.");});

//Init input stream
var input = process.stdin;
input.setEncoding('utf-8');
input.on('data', function(data){
  data = data.replace(/(\r|\n)/g, '');
  cmdParser.parse(data.split(' '));
});

//parse initial command
cmdParser.parse(process.argv.slice(2));

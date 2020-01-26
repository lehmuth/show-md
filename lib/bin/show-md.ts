#!/usr/bin/env node
//laoding default app
import { getDefaultApp, ShowMdCmdParser } from '../index';
const app = getDefaultApp();

//init logging
const path = require('path');
var logPath = path.join(__dirname, "../../logs/system.log");
const log = require('simple-node-logger').createSimpleLogger(logPath);
log.setLevel("all");

//loading command parser
const cmdParser = new ShowMdCmdParser(app);
cmdParser.on('warning', (msg: string) => {log.warn(msg);});
cmdParser.on('error', (msg: string) => {log.error(msg);});
cmdParser.on('info', (msg: string) => {log.info(msg);});

//init Server
app.on('warning', (msg: string) => {log.warn(msg);});
app.on('error', (msg: string) => {log.error(msg);});
app.on('started', () => {log.info("Server started on http://localhost:" + app.config.getPort());});
app.on('stoped', () => {log.info("Server stoped.");});

//Init input stream
var input = process.stdin;
input.setEncoding('utf-8');
input.on('data', function(data){
  let dataString = data.toString();
  dataString = dataString.replace(/(\r|\n)/g, '');
  cmdParser.parse(dataString.split(' '));
});

//parse initial command
cmdParser.parse(process.argv.slice(2));

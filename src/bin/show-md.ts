#!/usr/bin/env node
import { getDefaultApp, ShowMdCmdParser } from '../app';
import path from 'path';
import fs from 'fs';
const SimpleNodeLogger = require('simple-node-logger');
//loading default app
const app = getDefaultApp();

//init systemLogging
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const systemLogPath = path.join(logDir, 'system.log');
if (!fs.existsSync(logDir)) {
  fs.closeSync(fs.openSync(systemLogPath, 'w'));
}
const systemLog = SimpleNodeLogger.createSimpleLogger(systemLogPath);
systemLog.setLevel('all');
const httpLogPath = path.join(logDir, 'http.log');
if (!fs.existsSync(logDir)) {
  fs.closeSync(fs.openSync(httpLogPath, 'w'));
}
const httpLog = SimpleNodeLogger.createSimpleLogger(httpLogPath);
httpLog.setLevel('all');

//loading command parser
const cmdParser = new ShowMdCmdParser(app);
cmdParser.on('warning', (msg: string) => {
  systemLog.warn(msg);
});
cmdParser.on('error', (msg: string) => {
  systemLog.error(msg);
});
cmdParser.on('info', (msg: string) => {
  systemLog.info(msg);
});

//init Server
app.on('warning', (msg: string) => {
  systemLog.warn(msg);
});
app.on('error', (msg: string) => {
  systemLog.error(msg);
});
app.on('started', (msg: string) => {
  systemLog.info(msg);
});
app.on('stoped', (msg: string) => {
  systemLog.info(msg);
});
app.on('http-info', (msg: string) => {
  httpLog.info(msg);
});
app.on('http-error', (msg: string) => {
  httpLog.error(msg);
});

//Init input stream
var input = process.stdin;
input.setEncoding('utf-8');
input.on('data', function (data) {
  let dataString = data.toString();
  dataString = dataString.replace(/(\r|\n)/g, '');
  cmdParser.parse(dataString.split(' '));
});

console.log('Show-md started.\n');

//parse initial command
cmdParser.parse(process.argv.slice(2));

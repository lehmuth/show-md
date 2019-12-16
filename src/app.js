'use strict'

const EventEmitter = require('events')
const ShowMdConfig = require('./config.js')
const ShowMdServer = require('./server.js')
const ShowMdParser = require('./md_parser.js')

/**
 * A server class which consists of a HTTP server and a configuration.
 */
class ShowMdApp extends EventEmitter {
  /**
   * Init new ShowMdServer.
   */
  constructor (config) {
    super()
    // Setup config
    this.config = config
    if (this.config === undefined) {
      this.config = new ShowMdConfig()
    } else if (!(this.config instanceof ShowMdConfig)) {
      this.emit('error', 'Attribute config is no instance of ShowMdConfig')
    }
    this.config.on('warning', (msg) => { this.emit('warning', msg) })

    this.parser = new ShowMdParser(this.config)
    this.server = new ShowMdServer(this.config, this.parser)
  }

  /**
   * Server starts listening, event "started" is emitted.
   */
  start () {
    try {
      this.server.listen()
      this.emit('started')
    } catch (err) {
      this.emit('error', err)
    }
  }

  /**
   * Server stops listening, event "stoped" is emitted.
   */
  stop () {
    if (this.server !== undefined && this.server.isListening()) {
      this.server.close()
      this.emit('stoped')
    } else {
      this.emit('error', 'Trying to shut down server, but server not running!')
    }
  }

  isRunning () {
    return this.server.isListening()
  }

  parseIncludes (path) {
    // TODO
  }

  parse (inputPath, outputPath) {
    // TODO
  }
}

module.exports = ShowMdApp

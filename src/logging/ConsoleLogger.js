class ConsoleLogger {
  fatal(msg, ...args) {
    console.error(`[${this.timestamp}] fatal:`, msg, ...args)
  }

  error(msg, ...args) {
    console.error(`[${this.timestamp}] error:`, msg, ...args)
  }

  warn(msg, ...args) {
    console.warn(`[${this.timestamp}] warn:`, msg, ...args)
  }

  info(msg, ...args) {
    console.info(`[${this.timestamp}] info:`, msg, ...args)
  }

  debug(msg, ...args) {
    console.debug(`[${this.timestamp}] debug:`, msg, ...args)
  }

  trace(msg, ...args) {
    console.trace(`[${this.timestamp}] trace:`, msg, ...args)
  }

  get timestamp() {
    return new Date().toISOString();
  }
}

module.exports = ConsoleLogger;

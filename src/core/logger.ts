import * as util from 'util'

export class Logger {
  _log(level: string, message: string, metadata?: object) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...metadata,
    }

    console.log(util.inspect(logData, { depth: null, breakLength: Infinity }))
  }

  info(message: string, metadata?: object) {
    this._log('INFO', message, metadata)
  }

  error(message: string, metadata?: object) {
    this._log('ERROR', message, metadata)
  }

  debug(message: string, metadata?: object) {
    this._log('DEBUG', message, metadata)
  }

  warn(message: string, metadata?: object) {
    this._log('WARN', message, metadata)
  }
}

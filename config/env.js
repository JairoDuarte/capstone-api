'use strict'

/*eslint-disable-next-line*/
import _ from 'lodash';
import path  from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

class Env {
  constructor () {
    if (process.env.NODE_ENV !== 'production') {
        const bootedAsTesting = process.env.NODE_ENV === 'testing'
        const env = this.load(this.getEnvPath(), false)
        /**
         * Throwing the exception when ENV_SILENT is not set to true
         * and ofcourse there is an error
         */
        if (env.error && process.env.ENV_SILENT !== 'true') {
        throw env.error
        }

        /**
         * Load the `.env.testing` file if app was booted
         * under testing mode
         */
        if (bootedAsTesting) {
        this.load('.env.testing')
        }
    }
  }

  /**
   * Replacing dynamic values inside .env file
   *
   * @method _interpolate
   *
   * @param  {String}     env
   * @param  {Object}     envConfig
   *
   * @return {String}
   *
   * @private
   */
  _interpolate (env, envConfig) {
    const matches = env.match(/(\\)?\$([a-zA-Z0-9_]+)|(\\)?\${([a-zA-Z0-9_]+)}/g) || []
    _.each(matches, (match) => {
      /**
       * Variable is escaped
       */
      if (match.indexOf('\\') === 0) {
        env = env.replace(match, match.replace(/^\\\$/, '$'))
        return
      }

      const key = match.replace(/\$|{|}/g, '')
      const variable = envConfig[key] || process.env[key] || ''
      env = env.replace(match, this._interpolate(variable, envConfig))
    })

    return env
  }

  /**
   * Load env file from a given location.
   *
   * @method load
   *
   * @param  {String}  filePath
   * @param  {Boolean} [overwrite = 'true']
   * @param  {String}  [encoding = 'utf8']
   *
   * @return {Object}
   */
  load (filePath, overwrite = true, encoding = 'utf8') {
    const options = {
      path: path.isAbsolute(filePath) ? filePath : path.join(__dirname, `../${filePath}`),
      encoding
    }

    try {
      const envConfig = dotenv.parse(fs.readFileSync(options.path, options.encoding))

      /**
       * Dotenv doesn't overwrite existing env variables, so we
       * need to do it manaully by parsing the file.
       * Loop over values and set them on environment only
       * when actual value is not defined or overwrite
       * is set to true
       */
      _.each(envConfig, (value, key) => {
        if (process.env[key] === undefined || overwrite) {
          process.env[key] = this._interpolate(value, envConfig)
        }
      })
      return { parsed: envConfig }
    } catch (error) {
      return { error }
    }
  }

  /**
   * Returns the path from where the `.env`
   * file should be loaded.
   *
   * @method getEnvPath
   *
   * @return {String}
   */
  getEnvPath () {
    if (!process.env.ENV_PATH || process.env.ENV_PATH.length === 0) {
      return '.env.production'
    }
    return process.env.ENV_PATH
  }

  /**
   * Get value for a given key from the `process.env`
   * object.
   *
   * @method get
   *
   * @param  {String} key
   * @param  {Mixed} [defaultValue = null]
   *
   * @return {Mixed}
   *
   * @example
   * ```js
   * Env.get('CACHE_VIEWS', false)
   * ```
   */
  get (key, defaultValue = null) {
    return _.get(process.env, key, defaultValue)
  }

  /**
   * Set value for a given key inside the `process.env`
   * object. If value exists, will be updated
   *
   * @method set
   *
   * @param  {String} key
   * @param  {Mixed} value
   *
   * @return {void}
   *
   * @example
   * ```js
   * Env.set('PORT', 3333)
   * ```
   */
  set (key, value) {
    _.set(process.env, key, value)
  }
}

module.exports = new Env()
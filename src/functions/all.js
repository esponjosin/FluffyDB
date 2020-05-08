const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs'),
      wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
      ketFinder = require('../utils/objectKF');

module.exports = {
    alias: ['datos'],
    run: async function () {
        return new Promise(async (resolve, reject) => {

            try {

                let file_data = await JSON.parse(fs.readFileSync(this.dbDir))

                return resolve(Object.entries(file_data).map(x => { return { ID: x[0], data: x[1] }}))

            } catch(e) {
                reject(new FError('An internal error occurred'))
            }

        })
    }
}
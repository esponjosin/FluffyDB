const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs'),
      wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
      ketFinder = require('../utils/objectKF');

module.exports = {
    alias: ['algo'],
    run: function (id) {
        return new Promise(async (resolve, reject) => {
            
            if(!id || typeof id !== 'string'  || id.length < 1) return reject(new FError('You need to enter the parameter you want to get'));

            if(this.recovery) {
                do {
                    await wait(100)
                } while(this.recovery)
            }

            let file_data = await JSON.parse(fs.readFileSync(this.dbDir))

            if(!id.includes('.') || id.split('.').length == 1) {
                
                id = id.includes('.') ? id.replace('.', '') : id

                return resolve(file_data[id] ? true : false)

            } else {

                let parameters = id.split('.')

                let keys = await ketFinder(file_data, parameters).then(i => i).catch(e => new Object({error: e}))
                    
                if(typeof keys == 'object' && keys.error) return resolve(false)

                if(!keys[0].hasOwnProperty(keys[1])) return resolve(false)
                    
                return resolve(true)
        
            }
        })
    }
}
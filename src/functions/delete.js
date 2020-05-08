const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs'),
      wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
      ketFinder = require('../utils/objectKF');

module.exports = {
    alias: ['eliminar'],
    run: async function (id) {
        return new Promise(async (resolve, reject) => {
            
            if(!id || typeof id !== 'string'  || id.length < 1) return reject(new FError('You need to enter the parameter you want to delete'));

            if(this.recovery) {
                do {
                    await wait(100)
                } while(this.recovery)
            }

            let file_data = await JSON.parse(fs.readFileSync(this.dbDir))

            if(!id.includes('.') || id.split('.').length == 1) {
                
                id = id.includes('.') ? id.replace('.', '') : id

                if(!file_data[id]) return reject(new FError(`The ${id} not exist`))
                
                delete file_data[id];

                try {
                    await fs.writeFileSync(this.dbDir, JSON.stringify(file_data))
                    return resolve(true)
                } catch(e) {
                    return reject(false)
                }

            } else {

                let parameters = id.split('.')

                let keys = await ketFinder(file_data, parameters).then(i => i).catch(e => new Object({error: e}))
                    
                if(typeof keys == 'object' && typeof keys.error == 'string') reject(new FError(`The ${keys.error} parameter not exist`));
                else if(typeof keys == 'object' && Array.isArray(keys.error)) reject(new FError(`The ${keys.error[0]} parameter is not an object`));

                if(!keys[0].hasOwnProperty(keys[1])) return reject(new FError(`The ${keys[1]} parameter not exist`));
                    
                delete keys[0][keys[1]];
                    
                try {
                    await fs.writeFileSync(this.dbDir, JSON.stringify(file_data))
                    return resolve(true)
                } catch(e) {
                    return reject(false)
                }
        
            }
        })
    }
}
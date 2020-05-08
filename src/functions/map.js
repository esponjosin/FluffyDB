const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs'),
      wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
      ketFinder = require('../utils/objectKF');

module.exports = {
    alias: ['mapear'],
    run: async function (id, f) {
        return new Promise(async (resolve, reject) => {
            
            if(!id || typeof id !== 'string'  || id.length < 1) return reject(new FError('You need to enter the parameter you want to map'));

            if(!f || !f instanceof Function) reject(new FError('You need to enter the mapping function'));

            if(this.recovery) {
                do {
                    await wait(100)
                } while(this.recovery)
            }

            let file_data = await JSON.parse(fs.readFileSync(this.dbDir))

            if(!id.includes('.') || id.split('.').length == 1) {
                
                id = id.includes('.') ? id.replace('.', '') : id

                if(!file_data[id]) return reject(new FError(`The ${id} not exist`))
                if(!Array.isArray(file_data[id])) return reject(new FError(`The ${id} is not array`))
                
                return resolve(file_data[id].map(f))

            } else {

                let keys = await ketFinder(file_data, parameters).then(i => i).catch(e => new Object({error: e}))
                    
                if(typeof keys == 'object' && keys.error) reject(new FError(`The ${keys.error} parameter not exist`));
                else reject(new FError(`The ${keys.error[0]} parameter is not an object`));

                if(!keys[0].hasOwnProperty(keys[1])) return reject(new FError(`The ${keys[1]} not exist`));
                if(!Array.isArray(keys[0][keys[1]])) return reject(new FError(`The ${keys[1]} is not array`))

                return resolve(keys[0][keys[1]].map(f))
        
            }
        })
    }
}
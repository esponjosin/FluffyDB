const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs'),
      wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
      ketFinder = require('../utils/objectKF');

module.exports = {
    alias: ['setear'],
    run: async function (id, item) {
        return new Promise(async (resolve, reject) => {
            
            if(!id || typeof id !== 'string' || id.length < 1) return reject(new FError('You need to enter the parameter you want to set a value'));

            if(!item) reject(new FError('You need to enter the value you want to set'));

            if(this.recovery) {
                do {
                    await wait(100)
                } while(this.recovery)
            }

            let file_data = await JSON.parse(fs.readFileSync(this.dbDir))

            if(!id.includes('.') || id.split('.').length == 1) {
                
                id = id.includes('.') ? id.replace('.', '') : id

                file_data[id] = item
                try {
                    await fs.writeFileSync(this.dbDir, JSON.stringify(file_data))
                    return resolve(file_data[id])
                } catch(e) {
                    return reject(new FError('An error occurred while trying to save changes'))
                }

            } else {

                let keys = await ketFinder(file_data, parameters).then(i => i).catch(e => new Object({error: e}))
                    
                if(typeof keys == 'object' && keys.error) reject(new FError(`The ${keys.error} parameter not exist`));
                else reject(new FError(`The ${keys.error[0]} parameter is not an object`));

                keys[0][keys[1]] = item;
                
                try {
                    await fs.writeFileSync(this.dbDir, JSON.stringify(file_data))
                    return resolve(file_data[parameters[0]])
                } catch(e) {
                    return reject(new FError('An error occurred while trying to save changes'))
                }
        
            }
        })
    }
}
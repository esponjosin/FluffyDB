const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs'),
      wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
      ketFinder = require('../utils/objectKF');

module.exports = {
    alias: ['filtrar'],
    run: async function (id, m, index = false) {
        return new Promise(async (resolve, reject) => {
            
            if(!id || typeof id !== 'string'  || id.length < 1) return reject(new FError('You need to enter the parameter you want to filter'));

            if(!m) return reject(new FError('You need to enter what you want to filter, you can send the filter function instead'));

            if(typeof m == 'number' && index && m < 0) return reject(new FError('The number cannot be less than 0'));

            if(this.recovery) {
                do {
                    await wait(100)
                } while(this.recovery)
            }

            let file_data = await JSON.parse(fs.readFileSync(this.dbDir))

            if(!id.includes('.') || id.split('.').length == 1) {
                
                id = id.includes('.') ? id.replace('.', '') : id

                if(!file_data[id]) return reject(new FError(`The ${id} not exist`))
                if(!Array.isArray(file_data[id])) return reject(new FError(`THe ${id} it is not an array`));

                index ? file_data[id] = file_data[id].filter(x => x !== file_data[id][m])
                : m instanceof Function ? file_data[id] = file_data[id].filter(m)
                : file_data[id].filter(x => x !== m);

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

                if(!keys[0].hasOwnProperty(keys[1])) return reject(new FError(`The ${keys[1]} parameter not exist`));
                if(!Array.isArray(keys[0][keys[1]])) return reject(new FError(`THe ${id} it is not an array`));
                    
                index ? keys[0][keys[1]] = keys[0][keys[1]].filter(x => x !== keys[0][keys[1]][m])
                : m instanceof Function ? keys[0][keys[1]] = keys[0][keys[1]].filter(m)
                : keys[0][keys[1]].filter(x => x !== m);
                    
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
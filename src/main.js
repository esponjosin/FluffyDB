const path = require('path'),
      logger = require('./utils/logger'),
      FError = require('./lib/error'),
      fs = require('fs'),
      backup = require('./utils/backup')

class FluffyDB {

    /**
    * @typedef {Object} FluffyDBOptions
    * @memberof FluffyDB
    */

    /**
    * @param {Object} options FluffyDB options
    * @param {FluffyDBOptions} [options] FluffyDB options
    */

    constructor(options) {
        
        if(!options) throw new FError('You need to enter some parameters before you can start using the db')
        
        if(!options.name || options.name.length < 1) throw new FError('You need to enter the name of the database')
        
        if(!options.dir) throw new FError('You need to enter the directory where everything will be stored')
        
        if(!fs.existsSync(options.dir)) throw new FError('The directory entered does not exist')

        /**
         * @private
         */

        Object.defineProperty(options, 'dir', { value: path.join(options.dir, 'fluffydb') })
        
        for(var key of Object.keys(options)) if(!this[key]) this[key] = options[key]

        if(!fs.existsSync(this.dir)) {
            try {
                fs.mkdirSync(this.dir)
            } catch(e) {
                throw new FError('Could not create directory where everything will be stored ' + e)
            }
        }
                
        if(!fs.existsSync(path.join(this.dir, 'data'))) {
            try {
                fs.mkdirSync(path.join(this.dir, 'data'))
            } catch(e) {
                throw new FError('Could not create data directory ' + e)
            }
        }
       
        if(this.subdir && !fs.existsSync(path.join(this.dir, `data/${this.subdir}`))) {
            try {
                fs.mkdirSync(path.join(this.dir, `data/${this.subdir}`))
            } catch(e) {
                throw new FError('Could not create sub directory ' + e)
            }
        }

        this.dbDir = this.subdir ? path.join(this.dir, `data/${this.subdir}/${this.name.split(' ').join('-').split('.').join('-')}.fluffy`) : path.join(this.dir, `data/${this.name.split(' ').join('-').split('.').join('-')}.fluffy`)
        
        if(!fs.existsSync(this.dbDir)) {
            try {
                fs.writeFileSync(this.dbDir, Buffer.from(JSON.stringify({})))
            } catch(e) {
                throw new FError('Could not generate the database file')
            }
        } else {
            try {
                JSON.parse(fs.readFileSync(this.dbDir))
            } catch(e) {
                this.recovery = true;
                logger.warn(`The database is corrupted, checking if there is any backup to start a restoration`)

                let backupDir = path.join(this.dir, 'backups')

                let fileName = Buffer.from((this.subdir ? `${this.subdir}-` : '') + this.name).toString('base64');
                
                let fileDir = path.join(backupDir, `${fileName}.fluffybackup`)

                if(fs.existsSync(backupDir) && fs.existsSync(fileDir)) {

                    try {
                        let fdata = fs.readFileSync(fileDir, 'utf8')
                        let bdata = JSON.parse(Buffer.from(fdata, 'base64').toString())
                        fs.writeFile(this.dbDir, Buffer.from(JSON.stringify(bdata)), err => {
                            if(err) {
                                logger.warn('The backup could not be loaded, the database was restarted')
                                delete this.recovery
                                return fs.writeFileSync(this.dbDir, Buffer.from(JSON.stringify({})))
                            }
                            logger.log('The database was successfully restored')
                            delete this.recovery
                        })
                    } catch(e) {
                        logger.warn('Unfortunately, the backup was also corrupt, the database was restarted')
                        fs.writeFileSync(this.dbDir, Buffer.from(JSON.stringify({})))
                        delete this.recovery
                    }

                } else {
                    logger.warn('Unfortunately, there was no backup of the database, the database was restarted')
                    fs.writeFileSync(this.dbDir, Buffer.from(JSON.stringify({})))
                    delete this.recovery
                }

            }
        }

        if(!Object.keys(this).includes('backup') || this.backup) setTimeout(() => backup(this), this.backupTime || 7.2e+6)

        let functions = fs.readdirSync(path.join(__dirname, './functions/'))
        for(var f of functions) {
            let fun = require(path.join(__dirname, `./functions/${f}`))
            /**
             * FluffyDB function
             * @type {Function}
             * @private
             */
            if(typeof fun == 'object' && fun.alias.length > 0) fun.alias.forEach(alias => Object.defineProperty(this, alias.toLowerCase(), { value: fun.run }))
            Object.defineProperty(this, f.split('.')[0], { value: fun.run })
        }

        if(this.hasOwnProperty('logger') ? this.logger: true) logger.log('Database started')

    }

}

module.exports = FluffyDB;
const path = require('path'),
      logger = require('../utils/logger'),
      FError = require('../lib/error'),
      fs = require('fs');

module.exports = async function (Fluffy) {

    let backupDir = path.join(Fluffy.dir, 'backups')

    if(!fs.existsSync(backupDir)) {
        try {
            fs.mkdirSync(backupDir)
        } catch(e) {
            throw new FError('Could not generate the backup folder')
        }
    }

    let backupName = Buffer.from((Fluffy.subdir ? `${Fluffy.subdir}-` : '') + Fluffy.name).toString('base64');

    let data = fs.readFileSync(Fluffy.dbDir)

    fs.writeFile(path.join(backupDir, `${backupName}.fluffybackup`), data.toString('base64'), err => {
        if(err) throw new FError(`The backup could not be generated for the file ${(Fluffy.subdir ? Fluffy.subdir : '') + Fluffy.name}`)
        logger.log(`Backup created for the file ${(Fluffy.subdir ? Fluffy.subdir + '/' : '') + Fluffy.name}`)
    })

}
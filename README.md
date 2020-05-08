# FluffyDB

FluffyDB is a json-based database that uses the nodejs (fs) file system, this database will be updated from time to time to fix errors, add functions, improve performance, among other things. Any questions consult [Esponjosin](https://discordapp.com/users/461071138127347713)

## Install

```
npm install fluffydb --save
```

## Usage

```js
const FluffyDB = require('fluffydb');
const db = new FluffyDB({
    dir: __dirname, //This will be the base directory, here all the files created by fluffydb will be stored (Required)
    name: 'example', //This will be the name of the database (Required)
    subdir: '', //With this option you can separate the database into a sub folder to have more separate data (Optional)
    backup: true, // With this option you can enable or disable the option to make a backup from time to time of the database(Optional) (default: true)
    backupTime: 60000, //Here you can define how often the backup is made in case it is activated, the time must be in milliseconds (Optional) (default: 7.2e+6)
    logger: true //This option allows disabling the warning that the database is already ready (Optional) (default: true)
})
```

## Changelogs

# 0.0.6
```
Fixed a error
```

# 0.0.5
```
All functions were created from 0 and the queue system was removed because it caused errors
```

## Functions

All functions support `.` Ex:
<FluffyDB>.set('marry.id', 'id')
That will change the id parameter of the marry

# add

Alias: sumas

The add function allows you to add a number to the specified id
Ex:

```js

/**
 * @param {string} [id]
 * @param {number} [toAdd]
 */

<FluffyDB>.add(id, Number)

/**
 * Expected Promise Output
 * {Object}
 */
```

# all

Alias: datos

The add function allows you to add a number to the specified id
Ex:

```js

<FluffyDB>.all()

/**
 * Expected Promise Output
 * {Array}
 */

```

# delete

Alias: eliminar

The delete function allows you to delete the specified id
Ex:

```js
/**
 * @param {string} [id]
 */

<FluffyDB>.delete(id)

/**
 * Expected Promise Output
 * {Boolean}
 */

```

# filter

Alias: filtrar

The filter function allows you to filter an array in different ways, by index, by function or by value
Ex:

```js
/**
 * @param {string} [id]
 * @param {function/number/string} [f]
 * @param {boolean} [index]
 */

<FluffyDB>.filter(id, f, index)

/**
 * Expected Promise Output
 * {Object}
 */

```

# get

Alias: obtener

The get function allows you to get the data of an id
Ex:

```js
/**
 * @param {string} [id]
 */

<FluffyDB>.get(id)

/**
 * Expected Promise Output
 * {Object}
 */

```



# map

Alias: mapear

The map function allows you to map the data of an array
Ex:

```js
/**
 * @param {string} [id]
 * @param {function} [f]
 */

<FluffyDB>.map(id, f)

/**
 * Expected Promise Output
 * {Array}
 */
```

# push

Alias: agregar

The push function allows you to add an item to a matrix
Ex:

```js
/**
 * @param {string} [id]
 * @param {any} [value]
 */

<FluffyDB>.push(id, value)

/**
 * Expected Promise Output
 * {Object}
 */
```

# set

Alias: setear

The set function allows you to write a value to the specified id
Ex:

```js
/**
 * @param {string} [id]
 * @param {any} [value]
 */

<FluffyDB>.set(id, value)

/**
 * Expected Promise Output
 * {Object}
 */
```

# some

Alias: algo

Some function lets you know if the id exists or not
Ex:

```js
/**
 * @param {string} [id]
 */

<FluffyDB>.get(id)

/**
 * Expected Promise Output
 * {Boolean}
 */
```

# substract

Alias: restar

The substract function allows you to subtract a numeric value from the specified id
Ex:

```js
/**
 * @param {string} [id]
 * @param {number} [toRem]
 */

<FluffyDB>.substract(id, Number)

/**
 * Expected Promise Output
 * {Boolean}
 */
```

## Example with discord.js

# Requirements

```
discord.js
fluffydb
```

# Code

```js

const {Client} = require('discord.js'),
      bot = new Client(),
      FluffyDB = require('fluffydb'),
      db = {
          users: new FluffyDB({
              dir: __dirname,
              name: 'users',
              logger: false
          })
      };

bot.on('ready', () => {
    console.log(`Logged ${bot.user.tag}`)
})

bot.on('message', async message => {

    if(message.author.bot || message.channel.type == "DM"){
        return;
    }

    let guildData = new FluffyDB({ dir: __dirname, name: message.guild.id, subdir: 'guilds', logger: false })
    let membersData = new FluffyDB({ dir: __dirname, name: message.guild.id, subdir: 'members', logger: false })

    let memberData = await membersData.get(message.author.id).then(i => i).catch(e => false)
    
    if(!memberData) memberData = await membersData.set(message.author.id, { daily: null, money: 0 }).then(i => i).catch(e => false)
    
    let prefix = await guildData.get('prefix').then(i => i).catch(e => false) || '!'

    if(!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    let args = message.content.slice((typeof prefix === "string" ? prefix.length : 0)).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    if(command == 'setprefix') {
    
    	if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(':x: | You need to be an administrator to be able to change the prefix')
    
        if(!args[0]) return message.channel.send(`:x: | You need to enter the new prefix (${prefix}setprefix <prefix>)`)

        let status = await guildData.set('prefix', args[0]).then(i => true).catch(e => false)

        if(!status) return message.channel.send(':x: | An error occurred while trying to save the new prefix')

        return message.channel.send('The prefix was successfully updated')
        
    }

    if(command == 'daily') {

        if(!memberData) return message.channel.send(':x: | Your data could not be obtained')

        if(memberData.daily && memberData.daily - Date.now() > 0) return message.channel.send(':x: | You have to wait 24 hours to claim your daily reward again')

        let count = Math.floor(Math.random() * 99)+1

        await membersData.add(`${message.author.id}.money`, count).then(i => i).catch(e => false)
        await membersData.set(`${message.author.id}.daily`, Date.now() + 8.64e+7).then(i => i).catch(e => false)

        return message.channel.send(`Your daily reward was ${count} coins`)

    }

    if(command == 'bal') {

        if(!memberData) return message.channel.send(':x: | Your data could not be obtained')

        return message.channel.send(`You have ${memberData.money} coins`)

    }

    if(command == 'delmember') {
    
    	if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(":x: | You need to be an administrator to be able to delete a member's data")
    
        if(!message.mentions.members.first()) return message.channel.send(`:x: | You need to mention the member`)

	let mem = message.mentions.members.first()

        let status = await membersData.get(mem.user.id).then(i => true).catch(e => false)

        if(!status) return message.channel.send(':x: | The member does not have any data')
        
        membersData.delete(mem.user.id).then(i => true).catch(e => false)

        return message.channel.send(`Data for member ${mem.user.tag} was successfully removed`)
        
    }

})

bot.login('TOKEN')
```
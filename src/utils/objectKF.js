module.exports = (object, keys) => {
    return new Promise((resolve, reject) => {
    
        let __;
        for(var i=0; i < keys.length; i++) {
            
            if(i+1 == keys.length) {

                resolve([__, keys[i]])
                break;

            } else {

                if(i == 0) {
                    
                    if(typeof object !== 'object') {
                        reject(object)
                        break;
                    }

                    if(!object.hasOwnProperty(keys[i])) {
                        reject(keys[i])
                        break;
                    } else __ = object[keys[i]]

                } else {
                    
                    if(!__.hasOwnProperty(keys[i])) {
                        reject(keys[i])
                        break;
                    } else __ = __[keys[i]]

                }

                if((typeof __).toLowerCase() !== 'object') {
                    reject([keys[i]])
                    break;
                }

            }

        }

    })

}
class FluffyError extends TypeError {

    constructor(msg) { 
        super()
        this.name = 'FluffyDB Error'
        this.message= msg;
    }

}

module.exports = FluffyError;
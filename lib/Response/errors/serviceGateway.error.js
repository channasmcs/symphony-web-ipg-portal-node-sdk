"use strict";

const GenericError = require("./error");
const serviceGatewayErrors = require("../errorMappings/serviceGateway.error.mapping");
class ServiceGatewayError extends GenericError {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.message = message;
        this.getCode = this.getCode.bind(this);
        this.getMappedMessage = this.getMappedMessage.bind(this);
        this.getMappedError = this.getMappedError.bind(this);
        this.defaultError = this.defaultError.bind(this);
        this.formatMessageWithParams = this.formatMessageWithParams.bind(this);
    }

    getCode() {
        const responseCode = this.code;
        const error = this.getMappedError(responseCode) || this.defaultError();
        return error.responseCode;
    }

    async getMappedMessage() {
        const responseCode = this.code;
        let message = '';
        const error = this.getMappedError(responseCode) || this.defaultError();

        if(responseCode == '6106'){
            let messageArray = this.message.split(" ");
            let phoneNumber = messageArray[22];
            let time = messageArray[18]+' '+messageArray[19];
            message = this.formatMessageWithParams([time,phoneNumber],error.message);
        }

        if(message){
            return message;
        }
        else{
            return error.message;
        }
    }

    getMappedError(responseCode) {
        return serviceGatewayErrors[responseCode];
    }

    defaultError() {
        return {
            responseCode: "#####",
            message: "System Error",
        };
    }

    formatMessageWithParams(args,message) {
		let formatted = message;
		for (let i = 0; i < args.length; i++) {
			let regexp = new RegExp('\\{' + i + '\\}', 'gi');
			formatted = formatted.replace(regexp, args[i]);
		}
		return formatted;
	};
}

module.exports = ServiceGatewayError;

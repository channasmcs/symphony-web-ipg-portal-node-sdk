'use strict';

const GenericError = require('./error');
const validationErrors = require("../errorMappings/validation.error.mapping");
const constants = require('../../constants');

class ValidationError extends GenericError {
    constructor(message) {
        super(message);
        this.resError = {};
        this.error = {};
        this.message = message;
        this.getCode = this.getCode.bind(this);
        this.getMappedMessage = this.getMappedMessage.bind(this);
        this.getMappedError = this.getMappedError.bind(this);
        this.defaultError = this.defaultError.bind(this);
        this.formatMessageWithParams = this.formatMessageWithParams.bind(this);
        this.getErrorParams = this.getErrorParams.bind(this);
    }

    getCode() {

        return this.error.responseCode;
    }

    async getMappedMessage() {

        this.resError = this.getErrorParams(this.message);
        let message = '';

        if (this.resError.value == constants.VALIDATION_TYPE_REQUIRED){
            this.error = this.getMappedError(301001) || this.defaultError();
        }else if (this.resError.value == constants.VALIDATION_TYPE_INVALID_TYPE){
            this.error = this.getMappedError(301002) || this.defaultError();
        }

        message = this.formatMessageWithParams([this.resError.key],this.error.message);

        if(message){
            return message;
        }
        else{
            return this.error.message;
        }
    }

    getMappedError(responseCode) {
        return validationErrors[responseCode];
    }

    defaultError() {
        return {
            responseCode: "#####",
            message: "",
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

    getErrorParams(args,errorType) {
        for (let i = 0; i < args.length; i++) {
            for (const [key, value] of Object.entries(args[i])) {
                return  {key,value}
            }
        }
    }
}

module.exports = ValidationError;

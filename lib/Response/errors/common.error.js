'use strict';

const GenericError = require('./error');
const commonErrors = require("../errorMappings/common.error.mapping");

class CommonError extends GenericError {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.getCode = this.getCode.bind(this);
        this.getMappedMessage = this.getMappedMessage.bind(this);
        this.getMappedError = this.getMappedError.bind(this);
        this.defaultError = this.defaultError.bind(this);
    }

    getCode() {
        const responseCode = this.code;
        const error = this.getMappedError(responseCode) || this.defaultError();
        return error.responseCode;
    }

    async getMappedMessage() {
        const responseCode = this.code;
        const error = this.getMappedError(responseCode) || this.defaultError();
        return error.message;
    }

    getMappedError(responseCode) {
        return commonErrors[responseCode];
    }

    defaultError() {
        return {
            responseCode: "#####",
            message: "",
        };
    }
}

module.exports = CommonError;

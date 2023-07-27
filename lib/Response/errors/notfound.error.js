'use strict';

const GenericError = require('./error');
const notFoundErrors = require("../errorMappings/notFound.error.mapping.json");
class NotFoundError extends GenericError {
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
        return notFoundErrors[responseCode];
    }

    defaultError() {
        return {
            responseCode: "#####",
            message: "",
        };
    }
}

module.exports = NotFoundError;

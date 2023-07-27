"use strict";
const DuplicateError = require("../Response/errors/duplicate.error"),
    UnauthorizedError = require("../Response/errors/unauthorized.error"),
    BadRequestError = require("../Response/errors/badRequest.error"),
    NotFoundError = require("../Response/errors/notfound.error"),
    CommonError = require("../Response/errors/common.error"),
    ServiceGatewayError = require("../Response/errors/serviceGateway.error"),
    ValidationError = require("../Response/errors/validation.error");
const constants = require('../constants');

function ErrorResponse(response) {
    return response;
}

module.exports.handleError = async (err) => {

    if (err instanceof BadRequestError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    } else if (err instanceof UnauthorizedError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    } else if (err instanceof NotFoundError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    } else if (err instanceof DuplicateError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    } else if (err instanceof CommonError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    } else if (err instanceof ServiceGatewayError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    }
    else if (err instanceof ValidationError) {
        return ErrorResponse(
            {
                message: await err.getMappedMessage(),
                responseCode: err.getCode(),
                status: constants.RESPONSE_TYPE_ERROR,
            });
    }
    return ErrorResponse(
        {
            message: err.message,
            responseCode: err.code || 500,
            status: constants.RESPONSE_TYPE_ERROR,
        }
    );
};


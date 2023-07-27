'use strict';
const order = require('./apis/order.server.api');
const crypto = require('./helpers/crypto');
const constants = require('./constants');
const GenericSuccces = require('./Response/success');
const CommonError = require('./Response/errors/common.error');
const ValidationError = require('./Response/errors/validation.error');
const validate = require('./helpers/validation');
const defaultConfig = require('./config/default');
const {handleError} = require("./helpers/error.handler.server.module");

const createOrder = async (config, request) => {
	try {
        const ipgBasePath = defaultConfig.ipgPortal.url;
        request.pgConnectionIdentifier = config.pgConnectionIdentifier;
        request.platform = constants.PLATFORM;

		var validateResults = validate.validateRequest(
			constants.ORDER_CREATION_REQUEST,
			request
		);

		if (validateResults.length > 0) {
			throw new ValidationError(validateResults);
		}

		const response = await order.createOrder(request, config);
		var hashedValue = crypto.createHashSha256(
			request.platform +
				'|' +
				request.platformIdentifier +
				'|' +
				response.data.orderSessionId
		);

        var getRedirectUrl = getRedirectURL(
            ipgBasePath,
            request.pgConnectionIdentifier,
            hashedValue,
            response.data.orderId
        );

		response.data.token = hashedValue;
        response.data.redirectURL = getRedirectUrl;

		return response;
	} catch (err) {
        return await handleError(err);
	}
};

const getRedirectURL = function ( basePath, pgConnectionIdentifier, token, orderId) {
    let redirectURL = null
    redirectURL = basePath+'/?pgConnectionIdentifier='+pgConnectionIdentifier+'&token='+token+'&orderId='+orderId;
    return redirectURL;
};

const orderStatus = async (config, request) => {
	try {
        request.pgConnectionIdentifier = config.pgConnectionIdentifier;
		var validateResults = validate.validateRequest(
			constants.ORDER_STATUS_REQUEST,
			request
		);

		if (validateResults.length > 0) {
            throw new ValidationError(validateResults);
		}

		return await order.orderStatus(request, config);
	} catch (err) {
        return await handleError(err);
	}
};

const successSignatureVerification = async (config, request) => {
	try {

        var validateResults = validate.validateRequest(
            constants.SUCCESS_SIGNATURE_VERIFICATION,
            request
        );

        if (validateResults.length > 0) {
            throw new ValidationError(validateResults);
        }

		const hashedSignatureLevelOne = crypto.createHashSha256(
			crypto.createHashMD5(
				request.orderId +
					'|' +
					request.originalAmount +
					'|' +
					request.paymentRef +
					'|' +
					request.merchantSecrets +
					'|' +
					constants.SIGNATURE_VERIFICATION_LEVEL1
			)
		);

		if (hashedSignatureLevelOne === request.signature) {
			return new GenericSuccces({ orderId: request.orderId }, '00');
		} else {
			const hashedSignatureLevelTwo = crypto.createHashSha256(
				crypto.createHashMD5(
					request.orderId +
						'|' +
						request.originalAmount +
						'|' +
						request.paymentRef +
						'|' +
						request.merchantSecrets +
						'|' +
						constants.SIGNATURE_VERIFICATION_LEVEL2
				)
			);

			if (hashedSignatureLevelTwo === request.signature) {
				let orderStatusResponse = await order.orderStatus(
					{ pgConnectionIdentifier: config.pgConnectionIdentifier, orderId: request.orderId },
					config
				);

				if (orderStatusResponse.data.orderStatus == constants.PAYMENT_SUCCESS_STATUS) {
					return orderStatusResponse;
				} else {
					throw new CommonError(
						constants.PAYMENT_FAIL_ERROR_MESSAGE,
						data.responseCode
					);
				}
			} else {
				throw new CommonError(
					constants.PAYMENT_FAIL_ERROR_MESSAGE,
					constants.PAYMENT_FAIL_ERROR_CODE
				);
			}
		}
	} catch (err) {
        return await handleError(err);
	}
};

const errorSignatureVerfication = async (config, request) => {
    try {

        var validateResults = validate.validateRequest(
            constants.ERROR_SIGNATURE_VERIFICATION,
            request
        );

        if (validateResults.length > 0) {
            throw new ValidationError(validateResults);
        }

        const hashedSignatureLevelOne = crypto.createHashSha256(
            crypto.createHashMD5(
                request.orderId +
                '|' +
                request.originalAmount +
                '|' +
                request.merchantSecrets +
                '|' +
                constants.SIGNATURE_VERIFICATION_LEVEL1
            )
        );

        if (hashedSignatureLevelOne === request.signature) {
            throw new CommonError(
                constants.PAYMENT_FAIL_ERROR_MESSAGE,
                request.errorCode
            );
        } else {
            const hashedSignatureLevelTwo = crypto.createHashSha256(
                crypto.createHashMD5(
                    request.orderId +
                    '|' +
                    request.originalAmount +
                    '|' +
                    request.merchantSecrets +
                    '|' +
                    constants.SIGNATURE_VERIFICATION_LEVEL2
                )
            );

            if (hashedSignatureLevelTwo === request.signature) {
                let orderStatusResponse = await order.orderStatus(
                    { pgConnectionIdentifier: config.pgConnectionIdentifier, orderId: request.orderId },
                    config
                );

                if (orderStatusResponse.data.orderStatus == constants.PAYMENT_SUCCESS_STATUS) {
                    return orderStatusResponse;
                } else {
                    throw new CommonError(
                        constants.PAYMENT_FAIL_ERROR_MESSAGE,
                        data.responseCode
                    );
                }
            } else {
                throw new CommonError(
                    constants.PAYMENT_FAIL_ERROR_MESSAGE,
                    constants.PAYMENT_FAIL_ERROR_CODE
                );
            }
        }
    } catch (err) {
        return await handleError(err);
    }
};

const createMerchantVerificationToken = async (config, request) => {
	try {
		var validateResults = validate.validateRequest(
			constants.CREATE_MERCHANT_VERIFICATION_TOKEN_REQUEST,
			request
		);

		if (validateResults.length > 0) {
            throw new ValidationError(validateResults);
		}

		var merchantVerificationToken = crypto.createHashSha256(
			request.platform +
				'|' +
				request.platformIdentifier +
				'|' +
				request.orderSessionId
		);

		return new GenericSuccces({ merchantVerificationToken }, '00');
	} catch (err) {
        return await handleError(err);
	}
};

module.exports = {
	createOrder: createOrder,
    successSignatureVerification: successSignatureVerification,
	orderStatus: orderStatus,
	createMerchantVerificationToken: createMerchantVerificationToken,
    errorSignatureVerfication: errorSignatureVerfication,
};

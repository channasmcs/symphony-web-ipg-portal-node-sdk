'use strict';

const constants = require('../constants');

const validTypeList = {
	currencyCode: ['LKR', 'USD', 'JPY'],
	platform: ['WEB', 'IOS', 'ANDROID'],
};

const serviceValidationMap = {
	[constants.ORDER_CREATION_REQUEST]: {
        pgConnectionIdentifier: { required: true },
		originalAmount: { required: true },
		currencyCode: { required: true, validTypeInList: true },
		platform: { required: true },
		platformIdentifier: { required: true },
		otherParameters: {},
        trxDynamicTimeout: {},
	},
	[constants.ORDER_STATUS_REQUEST]: {
        pgConnectionIdentifier: { required: true },
		orderId: { required: true },
	},
	[constants.CREATE_MERCHANT_VERIFICATION_TOKEN_REQUEST]: {
		platform: { required: true },
		platformIdentifier: { required: true },
		orderSessionId: { required: true },
	},
    [constants.SUCCESS_SIGNATURE_VERIFICATION]: {
        merchantSecrets: { required: true },
        orderId: { required: true },
        originalAmount: { required: true },
        paymentRef: { required: true },
        signature: { required: true },
    },
    [constants.ERROR_SIGNATURE_VERIFICATION]: {
        merchantSecrets: { required: true },
        orderId: { required: true },
        originalAmount: { required: true },
        signature: { required: true },
    },
};

const validateRequest = function (requestType, requestData) {
	let newMap = serviceValidationMap[requestType];

	let validationMsgArray = [];

	for (var key in newMap) {
		let keyErros = {};
		keyErros[key] = [];
		if (newMap[key].required) {
			if (typeof requestData[key] === 'undefined' || requestData[key] === '') {
				keyErros[key].push(constants.VALIDATION_TYPE_REQUIRED);
			}
		}

		if (newMap[key].validTypeInList) {
			if (typeof requestData[key] != 'undefined') {
				if (!validTypeList[key].includes(requestData[key])) {
					keyErros[key].push(constants.VALIDATION_TYPE_INVALID_TYPE);
				}
			}
		}

		if (keyErros[key].length > 0) {
			validationMsgArray.push(keyErros);
		}
	}

	return validationMsgArray;
};

module.exports = {
	validateRequest: validateRequest,
};

'use strict';

const httpHelper = require('../helpers/http.helper.server.module');
const ServiceGatewayError = require('../Response/errors/serviceGateway.error');
const GenericSuccces = require('../Response/success');
const packageConfig = require('../config/package.config');
const defaultConfig = require('../config/default');

const createOrder = async (requestData, config) => {
	const basePath = defaultConfig.servicesGateway.url;

	const createOrderEndpoint = packageConfig.api.endpoints.createOrder;

	const serviceUrl = basePath.concat(createOrderEndpoint);

	const serviceResponse = await httpHelper.doPostRequestWithBasicAuth({
		url: serviceUrl,
		data: {
			request: requestData,
		},

		auth: {
			username: config.clientId,
			password: config.clientSecret,
		},
	});

	const data = serviceResponse.data.response;

	if (data.responseCode === '00') {
		return new GenericSuccces(data.orderInfo, data.responseCode);
	} else {
        throw new ServiceGatewayError(data.message, data.responseCode);
	}
};

const orderStatus = async (requestData, config) => {
    const basePath = defaultConfig.servicesGateway.url;

	const orderStatusEndpoint = packageConfig.api.endpoints.orderStatus;

	const serviceUrl = basePath.concat(orderStatusEndpoint);

	const serviceResponse = await httpHelper.doPostRequestWithBasicAuth({
		url: serviceUrl,
		data: {
			request: requestData,
		},

		auth: {
			username: config.clientId,
			password: config.clientSecret,
		},
	});

	const data = serviceResponse.data.response;

	if (data.responseCode === '00') {
		return new GenericSuccces(data.orderInfo, data.responseCode);
	} else {
		throw new ServiceGatewayError(data.message, data.responseCode);
	}
};

module.exports = {
	createOrder,
	orderStatus,
};

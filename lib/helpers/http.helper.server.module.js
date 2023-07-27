'use strict';
const axios = require('axios');
const CommonError = require('../Response/errors/common.error');

const doRequest = (params) => {
	return axios({
		url: params.url,
		headers: params.headers,
		method: params.method,
		data: params.data,
		auth: params.auth,
		timeout: params.timeout || 10 * 10000,
	})
		.then((response) => {
			return response;
		})
		.catch((error) => {
			if (!error.response) {
				const errJSON = error.toJSON();
                throw new CommonError(errJSON.message, errJSON.code);
			} else {
                throw new CommonError(
					error.response.statusText,
					error.response.status
				);
			}
		});
};

const doPostRequestWithBearer = (params) => {
	if (params.headers == undefined) {
		params.headers = {};
	}

	var customerId = getSharedData('customer').customerId;

	params.headers['Authorization-IH'] = localStorage.getItem(
		'auth_token_'.concat(customerId)
	);

	const request = {
		url: params.url,
		headers: params.headers,
		method: 'POST',
		data: params.data,
		auth: params.auth,
		timeout: params.timeout,
	};

	return doRequest(request);
};

const doPostRequestWithBasicAuth = (params) => {
	const request = {
		url: params.url,
		headers: params.headers,
		method: 'POST',
		data: params.data,
		auth: params.auth,
		timeout: params.timeout,
	};

	return doRequest(request);
};

module.exports = {
	doRequest,
	doPostRequestWithBearer,
	doPostRequestWithBasicAuth,
};

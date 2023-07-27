'use strict';

const webServices = require('./webservices.gateway');

function soloPayConnect(config) {
	function Services(config) {
		this.config = config;
	}

	Services.prototype = (() => {
		return {
			createOrder: async function (request) {
				return await webServices.createOrder(this.config, request);
			},

            successSignatureVerification: function (request) {
				return webServices.successSignatureVerification(this.config, request);
			},

            errorSignatureVerfication: function (request) {
                return webServices.errorSignatureVerfication(this.config, request);
            },

            orderStatus: async function (request) {
                return await webServices.orderStatus(this.config, request);
            },

			createMerchantVerificationToken: function (request) {
				return webServices.createMerchantVerificationToken(
					this.config,
					request
				);
			},
		};
	})();

	var services = new Services(config);
	return services;
}

module.exports = {
    soloPayConnect: soloPayConnect,
};

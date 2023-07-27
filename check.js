const { soloPayConnect } = require('./index');



//=======================================================

//Initiate the library with credentials
const soloPayConnectInstance = soloPayConnect({
    pgConnectionIdentifier: 'PG00008272',
    clientId: 'wc_clientid_kbQNRMnBZOYaEzh',
    clientSecret: 'yAPpQIkgXEYZsR1FMzecIL7Wi',
});

//=======================================================

soloPayConnectInstance.createOrder({
 		originalAmount: 105,
        currencyCode: 'LKR',
        platformIdentifier: 'com.test',
        otherParameters:
            '{"employee":{"name":"sonoo","salary":56000,"married":true}}',
        trxDynamicTimeout:null,
 	})
 	.then(function (response) {
 		console.log(response);
 	})
 	.catch(function (error) {
 		console.log(error);
 	});

//===================================================

/*soloPayConnectInstance.successSignatureVerification({
        merchantSecrets: '7092580233784e679038c2d7a8d6abb86189',
		orderId: 'ODR_211028152825Dz95ul1k',
        originalAmount: '105',
		paymentRef: '20210000000154479',
        signature: '5d1310e82cde8398fd542fcbba782c39fdcf612165f54f3ecec663dab98e8715',
	})
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});*/

//===================================================

/*soloPayConnectInstance.errorSignatureVerfication({
    merchantSecrets: '7092580233784e679038c2d7a8d6abb86189',
    orderId: 'ODR_211028152825Dz95ul1k',
    originalAmount: '105',
    errorCode: '701045',
    signature: '5d1310e82cde8398fd542fcbba782c39fdcf612165f54f3ecec663dab98e8715',
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });*/

//================================================

/*soloPayConnectInstance.orderStatus({ orderId: 'ODR_2111091522095X80Ot4g' })
 	.then(function (response) {
 		console.log(response);
 	})
 	.catch(function (error) {
 		console.log(error);
 	});*/

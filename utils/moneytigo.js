import {base64encode} from 'nodejs-base64';
import CryptoJS from 'crypto-js';
import 'url-search-params-polyfill';

export async function getPaymentUrl(order, url, slug){

    console.log("the order", order)
	var params = {MerchantKey : '3875606336840ece3API606336840ece4',
    amount : Number(order.total).toFixed(2),
    RefOrder : order.uid,
    Customer_Email : order.email,
	urlIPN: 'https://thecometnetwork.npkn.net/confirm-transaction/',
	urlOK: `https://checkout.future-bridge.eu/thank-you`,
	urlKO: 'https://checkout.future-bridge.eu/payment-failed'
	};

	var req = base64encode(Object.values(params).concat('ZGE2MzQ4MDNjNTRlOTFhYWE0MWUxNTZiYTljNzEyNmI=').join('!') + "|ZGE2MzQ4MDNjNTRlOTFhYWE0MWUxNTZiYTljNzEyNmI="); // 
	console.log(req)
    
	var signature = CryptoJS.SHA512(req).toString();
	console.log(signature)

	params.SHA = signature;

	var final = new URLSearchParams(params);

	var response = await fetch('https://payment.moneytigo.com/init_transactions/', {
		method: 'post',
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    	body: final.toString(),
    })
    return response.json();

}
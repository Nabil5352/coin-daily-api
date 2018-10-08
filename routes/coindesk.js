const express = require('express');
const auth = require('../middleware/auth');
const request = require('request');
const rp = require('request-promise');
const router = express.Router();


router.get('/currency-list', auth, async (req, res) => {
	const options = {
	    uri: 'https://api.coindesk.com/v1/bpi/supported-currencies.json',
	    json: true
	};
	rp(options)
    .then(function (response) {
        res.status(200).send(response);
    })
    .catch(function (err) {
        if(err) return res.status(500).send({status: 500, success: false, message: 'An error occurred! Please try again.'});
    });
});

router.get('/current', auth, async (req, res) => {
	const options = {
	    uri: 'https://api.coindesk.com/v1/bpi/currentprice.json',
	    json: true
	};
	rp(options)
    .then(function (response) {
        res.status(200).send(response);
    })
    .catch(function (err) {
        if(err) return res.status(500).send({status: 500, success: false, message: 'An error occurred! Please try again.'});
    });
});

module.exports = router;
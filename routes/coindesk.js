const express = require('express');
const auth = require('../middleware/auth');
const request = require('request');
const rp = require('request-promise');
const router = express.Router();

// List of currencies
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

// Current Price
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

router.post('/custom-price', auth, async (req, res) => {
	const currency = req.body.currency
	const options = {
	    uri: `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`,
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

// History Data
router.get('/global-history', auth, async (req, res) => {
	const options = {
	    uri: 'https://api.coindesk.com/v1/bpi/historical/close.json',
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

router.post('/custom-history', auth, async (req, res) => {
	const currency = req.body.currency
	const options = {
	    uri: `https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}`,
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
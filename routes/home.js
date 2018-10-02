const express = require('express');
const router = express.Router();

//GET
router.get('/', (req, res) => {
	res.render('index', { title: 'Coin Daily Api', message: 'WELCOME TO COIN DAILY API' });
});
module.exports = router;
const express = require('express');
const router = express.Router();

//GET
router.get('/', (req, res) => {
	res.send('Welcome to coin daily api.');
});
module.exports = router;
function error(err, req, res, next){
	res.status(500).send('Request time out.');
}

module.exports = error;
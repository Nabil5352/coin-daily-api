const jwt = require('jsonwebtoken');

function auth(req, res, next){
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('Access denied.');

	try{
		const decode = jwt.verify(token, process.env.CDA_JWT_TOKEN);
		req.user = decode;
		next();
	}
	catch(ex){
		res.status(400).send('Invalid token.');
	}
};

module.exports = auth;
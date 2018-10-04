const jwt = require('jsonwebtoken');

exports.jwtToken = async function(value){
	const token = jwt.sign({ id: value }, process.env.CDA_JWT_TOKEN);
	return token;
}
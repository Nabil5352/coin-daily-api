const bcrypt = require('bcrypt');

exports.encryptPassword = async function(value){
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(value, salt);
	return hashed;
}

exports.comparePassword = async function(inputValue, hashValue){
	const validPassword = await bcrypt.compare(inputValue, hashValue);
	return validPassword;
}
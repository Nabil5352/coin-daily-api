const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: { 
		type: String, 
		required: true, 
		index: { unique: true },
		minLength: 5,
		maxLength: 255,
		match: /.*@.*/,
		lowercase: true
	},
	password: { 
		type: String, 
		required: true 
	},
	last_logged_in: { 
		type: Date, 
		default: Date.now 
	},
	currency: String
});

const User = mongoose.model('User', userSchema);



function validateUser(user){
	const schema = Joi.object().keys({
		email: Joi.string().email({ minDomainAtoms: 2 }).required(),
		password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
		currency: Joi.string()
	});

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
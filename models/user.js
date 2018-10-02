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
	const schema = {
		name: Joi.string().min(3).required()
	};
	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
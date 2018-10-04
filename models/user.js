const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: { 
		type: String, 
		required: true, 
		index: true,
		unique: true,
		minLength: 5,
		maxLength: 255,
		match: /.*@.*/,
		lowercase: true
	},
	password: { 
		type: String, 
		required: true,
		minLength: 5,
		maxLength: 1024
	},
	last_logged_in: { 
		type: Date, 
		default: Date.now 
	},
	access_token: { type: String },
	currency: String
});
userSchema.index({ email: 1 }, { unique: true});

const User = mongoose.model('User', userSchema);



function validateUser(user){
	const schema = Joi.object().keys({
		id: Joi.objectId(),
		email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(255).required(),
		access_token: [Joi.string(), Joi.number()],
		password: Joi.string().min(5).max(255).regex(/^[a-zA-Z0-9]{3,30}$/),
		currency: Joi.string()
	});

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
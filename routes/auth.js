const express = require('express');
const crypt = require('../helper/hash');
const jwt = require('../helper/jwt');
const router = express.Router();
const { User, validate } = require('../models/user');

// login
router.post('/login', async (req, res) => {
	try{
		const { error } = validate(req.body);
		if(error) return res.status(400).send({status: 400, message: error.details[0].message});
		
		const user = await User
			.findOne({ email: req.body.email });
		if(!user || user.length < 1) return res.status(404).send({status: 404, success: false, message: 'Invalid Username or Password!'});

		const validPass = await crypt.comparePassword(req.body.password, user.password);
		if(!validPass) return res.status(404).send({status: 404, success: false, message: 'Invalid Username or Password!'});
		
		const token = await jwt.jwtToken(user.id);
		res.status(200).send(token);
	}
	catch(exception){
		if(exception) return res.status(500).send({status: 500, success: false, message: 'An error occurred! Please try again.'});
	}
});

// CREATE new user
router.post('/signup', async (req, res) => {	
	try{	
		const { error } = validate(req.body);
		if(error) return res.status(400).send({status: 400, message: error.details[0].message});
		
		const user = new User({
			email: req.body.email,
			password: req.body.password,
			currency: req.body.currency
		})

		await crypt.encryptPassword(req.body.password).then((hashedPassword)=>{
			user.password = hashedPassword;
		});

		await user.save();
		const token = await jwt.jwtToken(user.id);
		res.status(200).header('x-auth-token', token).json({ status: 200, success: true });
	}
	catch(exception){
		if(exception){
			if(exception.name === 'MongoError' && exception.code === 11000){
				res.status(400).send({status: 400, success: false, message: 'User already exists'});
			}
			return res.status(500).send({status: 500, success: false, message: 'An error occurred! Please try again.'})
		}
		
	}

});

module.exports = router;
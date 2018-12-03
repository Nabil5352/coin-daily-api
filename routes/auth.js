const express = require('express');
const auth = require('../middleware/auth');
const crypt = require('../helper/hash');
const router = express.Router();
const { User, validate } = require('../models/user');

// Signup
router.post('/signup', async (req, res) => {	
	try{	
		const { error } = validate(req.body);
		if(error) return res.status(406).send({status: 406, message: error.details[0].message});
		
		const user = new User({
			email: req.body.email,
			password: req.body.password,
			currency: req.body.currency
		})

		await crypt.encryptPassword(req.body.password).then((hashedPassword)=>{
			user.password = hashedPassword;
		});

		await user.save();
		const token = user.generateAuthToken();
		res.status(201).header('x-auth-token', token).json({ status: 201, success: true });
	}
	catch(exception){
		if(exception){
			if(exception.name === 'MongoError' && exception.code === 11000){
				res.status(406).send({status: 406, success: false, message: 'Email already in use.'});
			}
			return res.status(400).send({status: 400, success: false, message: 'An error occurred! Please try again.'})
		}
		
	}

});

// login
router.post('/login', async (req, res) => {
	try{
		const { error } = validate(req.body);
		if(error) return res.status(406).send({status: 406, message: error.details[0].message});
		
		let user = await User
			.findOne({ email: req.body.email });
		if(!user || user.length < 1) return res.status(404).send({status: 404, success: false, message: 'Invalid Username or Password!'});

		const validPass = await crypt.comparePassword(req.body.password, user.password);
		if(!validPass) return res.status(404).send({status: 404, success: false, message: 'Invalid Username or Password!'});
		
		if(user && validPass){
			const token = user.generateAuthToken();

			//serialize
			let clone = {};
			clone.email = user.email;
			clone.currency = user.currency;

			res.status(200).header('x-auth-token', token).json({ status: 200, success: true, user: clone });
		}else{
			res.status(401).send({status: 401, success: false, message: 'Invalid Username or Password!'});
		}
	}
	catch(exception){
		if(exception) return res.status(400).send({status: 400, success: false, message: 'An error occurred! Please try again.'});
	}
});

// Get current user
router.get('/current-user', auth, async (req, res) => {
	try{
		const user = await User.findById(req.user.id).select('-password');
		res.status(200).send({status: 200, success: true, user: user});
	}catch(exception){
		if(exception) return res.status(400).send({status: 400, success: false, message: 'An error occurred! Please try again.'});
	}
});

module.exports = router;
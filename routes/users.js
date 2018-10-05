const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

// GET all users
router.get('/', async (req, res) => {
	const users = await User.find().sort('_id');
	res.status(200).send(users);
});

// GET user currency
router.post('/get-currency', async (req, res) => {
	try{
		const { error } = validate(req.body);
		if(error) return res.status(400).send({status: 400, message: error.details[0].message});
		
		const currency = await User
			.find({ email: req.body.email })
			.limit(1)
			.select({ currency: 1 });

		if(!currency || currency.length < 1) return res.status(404).send({status: 404, success: false, message: 'Invalid User!'});
		res.status(200).json(currency);
	}
	catch(exception){
		if(exception) return res.status(500).send({status: 500, success: false, message: 'An error occurred! Please try again.'});
	}
});

// UPDATE user
router.put('/:id', async (req, res) => {

	try{
		const { error } = validate(req.body);
		if(error) return res.status(400).send({status: 400, success: false, message: error.details[0].message});

		const user = await User.findById(req.body.id)
		if(!user) return res.status(404).send({status: 404, success: false, message: 'Invalid Id. Not Found!'});
		
		user.set({
			id: req.body.id,
			email: req.body.email,
			currency: req.body.currency
		});

		await user.save();
		res.status(200).json({ status: 200, success: true });
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

// DELETE user
router.delete('/:id', async (req, res) => {
	try{
		const result = await User.findOneAndRemove({ _id: req.params.id })
								 .exec(function(err, item) {
							        if (err) {
							            return res.status(404).json({status: 404, success: false, msg: 'Cannot remove item'});
							        }       
							        if (!item) {
							            return res.status(404).json({status: 404, success: false, msg: 'User not found'});
							        }  
							        res.status(200).json({status: 200, success: true, msg: 'User deleted.'});
							     });

	}
	catch(exception){
		if(exception) return res.status(500).send({status: 500, success: false, message: 'An error occurred! Please try again.'});
	}

});

module.exports = router;
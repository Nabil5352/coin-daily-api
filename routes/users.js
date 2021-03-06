const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { User, validate } = require('../models/user');


// GET all users
// router.get('/', async (req, res) => {
// 	const users = await User.find().sort('_id');
// 	res.status(200).send(users);
// });

// GET user currency
router.post('/get-currency', auth, async (req, res) => {
	try{
		const { error } = validate(req.body);
		if(error) return res.status(406).send({status: 406, message: error.details[0].message});
		
		const currency = await User
			.find({ email: req.body.email })
			.limit(1)
			.select({ currency: 1 });

		if(!currency || currency.length < 1) return res.status(404).send({status: 404, success: false, message: 'Invalid User!'});
		res.status(200).json(currency);
	}
	catch(exception){
		if(exception) return res.status(400).send({status: 400, success: false, message: 'An error occurred! Please try again.'});
	}
});

// UPDATE user
router.put('/:id', auth, async (req, res) => {

	try{
		const { error } = validate(req.body);
		if(error) return res.status(406).send({status: 406, success: false, message: error.details[0].message});

		const user = await User.findById(req.body.id);
		if(!user) return res.status(404).send({status: 404, success: false, message: 'Invalid User!'});
		
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
			if(exception) return res.status(400).send({status: 400, success: false, message: 'An error occurred! Please try again.'});
		}
	}

});

// DELETE user
router.delete('/:id', auth, async (req, res) => {
	try{
		const result = await User.findOneAndRemove({ _id: req.params.id })
								 .exec(function(err, item) {
							        if (err) {
							            return res.status(405).json({status: 405, success: false, msg: 'Not allowed!'});
							        }       
							        if (!item) {
							            return res.status(404).json({status: 404, success: false, msg: 'User not found!'});
							        }  
							        res.status(200).json({status: 200, success: true, msg: 'User has been deleted.'});
							     });

	}
	catch(exception){
		if(exception) return res.status(400).send({status: 400, success: false, message: 'An error occurred! Please try again.'});
	}

});

module.exports = router;
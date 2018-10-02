const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

//GET
router.get('/', async (req, res) => {
	const users = await User.find().sort('_id');
	res.send(users);
});

router.get('/:id', async (req, res) => {
	const user = await User
		.find({ email: req.param.email, password: req.param.pasword })
		.limit(1)
		.select({ currency: 1 });

	if(!user) return res.status(404).send('Invalid Id. Not Found!');
	res.send(user);
});

//POST
router.post('/', async (req, res) => {	
	const { error } = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	
	const user = new User({
		email: req.body.email,
		password: req.body.password,
		currency: req.body.currency
	})

	try{
		const result = await user.save();
		res.send(result);
	}
	catch(exception){
		console.log(exception.message);
		for (err in exception.errors)
			console.log(exception.errors[err].message);
	}

});

//PUT
router.put('/:id', async (req, res) => {

	const { error } = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const user = await User.findById(parseInt(req.param.id))
	if(!user){
		return res.status(404).send('Invalid Id. Not Found!');
	}
	
	user.set({
		email: req.body.email,
		currency: req.body.currency
	});

	const result = await user.save();
	res.send(result);

});

//DELETE
router.delete('/:id', async (req, res) => {
	const user = await User.findById(parseInt(req.param.id))
	if(!user) return res.status(404).send('Invalid Id. Not Found!');

	const result = await User.deleteOne({ _id: id });
	res.send(result);

});

module.exports = router;
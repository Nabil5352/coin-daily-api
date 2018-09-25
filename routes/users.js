const express = require('express');
const router = express.Router();

const users = [
	{id: 1, name: 'Nabil Ahmad'},
	{id: 2, name: 'Nabil Ahmad 2'},
	{id: 3, name: 'Nabil Ahmad 3'}
]

//GET
router.get('/', (req, res) => {
	res.send(users);
});
router.get('/:id', (req, res) => {
	const user = users.find(c => c.id === parseInt(req.param.id));
	if(!user) return res.status(404).send('Invalid Id. Not Found!');
	res.send(user);
});

//POST
router.post('/', (req, res) => {	
	const { error } = validateuser(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	
	const user = {
		id: users.length + 1,
		name: req.body.name
	}

	users.push(user);
	res.send(user);
});

//PUT
router.put('/:id', (req, res) => {
	const user = users.find(c => c.id === parseInt(req.param.id));
	if(!user){
		return res.status(404).send('Invalid Id. Not Found!');
	}

	const { error } = validateuser(req.body);
	if(error) return res.status(400).send(error.details[0].message);
		

	user.name = req.body.name;
	res.send(user);

});

//DELETE
router.delete('/:id', (req, res) => {
	const user = users.find(c => c.id === parseInt(req.param.id));
	if(!user) return res.status(404).send('Invalid Id. Not Found!');

	const index = users.indexOf(user);
	users.splice(index, 1);

	res.send(user);

});

module.exports = router;
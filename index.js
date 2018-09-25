const express = require('express');
const helmet = require('helmet');
const Joi = require('joi');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
		.then(() => console.log('Connected to MongoDB'))
		.catch(err => console.log("Could not connect to MongoDB", err));

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	last_logged_in: { type: Date, default: Date.now },
	currency: String
});

const User = mongoose.model('User', userSchema);

async function createUser(){
	const user = new User({
		email: 'sample2@test.com',
		password: 12345678,
		currency: 'BDT'
	})

	const result = await user.save();
	console.log(result);
}

createUser();

const logger = require('./middleware/logger');
const auth = require('./middleware/auth')

const home = require('./routes/home');
const users = require('./routes/users');

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use(auth);

//route
app.use('/api/users', users);
app.use('/', home);



function validateuser(user){
	const schema = {
		name: Joi.string().min(3).required()
	};
	return Joi.validate(user, schema);
}
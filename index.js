const express = require('express');
const helmet = require('helmet');
const Joi = require('joi');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const auth = require('./middleware/auth')

const home = require('./routes/home');
const users = require('./routes/users');

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => 'Listening on 4000');

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
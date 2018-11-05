require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const error = require('./middleware/error');
//routes
const authRoute = require('./routes/auth');
const coindeskdata = require('./routes/coindesk');
const home = require('./routes/home');
const users = require('./routes/users');
const mongoose = require('mongoose');

// Environment variables
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 4000;
const jwtToken = process.env.CDA_JWT_TOKEN;

const app = express();

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

if(!jwtToken){
	console.log('Set initial environment variables');
	process.exit(1);
}
if(!process.env.DBSTRING){
	process.exit(1);
}
mongoose.connect(process.env.DBSTRING, { useNewUrlParser: true })
		.then(() => console.log('Connected....'))
		.catch(err => console.log("Could not connect to database"));

//view engine
app.set('view engine', 'pug');
app.set('views', './views');

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

//route
app.use('/api/users', users);
app.use('/auth', authRoute);
app.use('/api/data', coindeskdata);
app.use('/', home);
app.use(error);
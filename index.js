const express = require('express');
const helmet = require('helmet');
const auth = require('./middleware/auth');
//routes
const auth = require('./routes/auth');
const home = require('./routes/home');
const users = require('./routes/users');
const mongoose = require('mongoose').set('debug', true);

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

if(!process.env.CDA_JWT_TOKEN){
	console.log('Set initial environment variables');
	process.exit(1);
}

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
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
app.use(auth);

//route
app.use('/api/users', users);
app.use('/auth', auth);
app.use('/', home);

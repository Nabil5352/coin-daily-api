const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose').set('debug', true);

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
		.then(() => console.log('Connected to MongoDB'))
		.catch(err => console.log("Could not connect to MongoDB", err));

const auth = require('./middleware/auth')

const home = require('./routes/home');
const users = require('./routes/users');

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

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
app.use('/', home);

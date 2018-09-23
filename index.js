const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.listen(port, () => 'Listening on 4000';

const courses = [
	{id: 1, name: 'Nabil Ahmad'},
	{id: 2, name: 'Nabil Ahmad 2'},
	{id: 3, name: 'Nabil Ahmad 3'}
]

//GET
app.get('/', (req, res) => {
	res.send('Hello World');
});
app.get('/api/courses', (req, res) => {
	res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.param.id));
	if(!course) return res.status(404).send('Invalid Id. Not Found!');
	res.send(course);
});

//POST
app.post('/api/courses', (req, res) => {	
	const { error } = validateCourse(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	
	const course = {
		id: courses.length + 1,
		name: req.body.name
	}

	courses.push(course);
	res.send(course);
});

//PUT
app.put('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.param.id));
	if(!course){
		return res.status(404).send('Invalid Id. Not Found!');
	}

	const { error } = validateCourse(req.body);
	if(error) return res.status(400).send(error.details[0].message);
		

	course.name = req.body.name;
	res.send(course);

});

//DELETE
app.delete('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.param.id));
	if(!course) return res.status(404).send('Invalid Id. Not Found!');

	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);

});



function validateCourse(course){
	const schema = {
		name: Joi.string().min(3).required()
	};
	return Joi.validate(course, schema);
}
const mongoose = require('mongoose');


const QuizSchema = new mongoose.Schema({
	question: String,
	options: [{
		name: String,
		value: Number
	}]

})

module.exports = mongoose.model('Quizes',QuizSchema);
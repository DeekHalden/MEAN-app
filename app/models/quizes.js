var mongoose = require('mongoose');


var QuizSchema = new mongoose.Schema({
	question: String,
	options: [{
		name: String,
		value: Number
	}]

})

module.exports = mongoose.model('Quizes',QuizSchema);
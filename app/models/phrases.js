const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const phrasesSchema = new Schema ({
	content: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	}

});

module.exports = mongoose.model('Phrase', phrasesSchema);

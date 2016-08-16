var mongoose =  require('mongoose');

var Schema = mongoose.Schema;

var phrasesSchema = new Schema ({
	content: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	}

});

mongoose.model('Phrase', phrasesSchema);

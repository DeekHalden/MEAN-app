var mongoose = require('mongoose');



var ItemSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	image: String,
	stock: {
		type:Number,
		min:1
	}
});


module.exports =  mongoose.model('Item',ItemSchema);
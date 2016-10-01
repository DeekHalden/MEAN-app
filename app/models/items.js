const  mongoose = require('mongoose');



const  ItemSchema = new mongoose.Schema({
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
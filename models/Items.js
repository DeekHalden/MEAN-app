var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var ItemSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Currency,
	image: String,
	stock: {
		type:Number,
		min:1
	}
});

mongoose.model('Item',ItemSchema);
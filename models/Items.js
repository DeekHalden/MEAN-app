var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var ItemSchema = new mongoose.Schema({
	title: String,
	desciption: String,
	price: Currency,
	image: String
});

mongoose.model('Item',ItemSchema);
const Item = require('../models/items');


module.exports = {
	getItems : (req, res, next)=> {
        Item.find((err, items) =>{
            if (err) return next(err);
            res.json(items);
        });
    },
    addItem : (req, res, next) =>{
        var item = new Item(req.body);

        item.save((err, item) =>{
            if (err) return next(err);
            res.json(item);
        });
    },
    getItem : (req, res, next) =>{
        Item.findById(req.params.itemId, (err, item) =>{
            if (err) return next(err);
            res.json(item);
        });
    },
    editItem : (req, res, next) =>{
        Item.findByIdAndUpdate(req.params.itemId, {
            $set: req.body
        }, {
            new: true
        }, (err, item) =>{
            if (err) return next(err);
            res.json(item)
        })
    },
    deleteItem : (req, res, next) =>{
        Item.findByIdAndRemove(req.params.itemId, (err, item) =>{
            if (err) return next(err);
            res.json(item);
        });
    }

}
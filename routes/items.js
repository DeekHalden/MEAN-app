var express = require('express');
var itemRouter = express.Router();
var mongoose = require('mongoose');
var Item = mongoose.model('Item');




itemRouter.route('/')
    .get(function(req, res, next) {
        Item.find(function(err, items) {
            if (err) {
                return next(err);
            }

            res.json(items);
        });
    })
    .post(function(req, res, next) {
        var item = new Item(req.body);

        item.save(function(err, item) {
            if (err) {
                return next(err);
            }

            res.json(item);
        });
    })
itemRouter.route('/:itemId')
    .delete(function(req, res, next) {
        Item.findByIdAndRemove(req.params.itemId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });



module.exports = itemRouter;

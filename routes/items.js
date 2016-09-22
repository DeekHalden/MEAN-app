var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Item = require('../models/items');
var Verify = require('./verify');


var itemRouter = express.Router();
itemRouter.use(bodyParser.json())

itemRouter.route('/')
    .get(function(req, res, next) {
        Item.find(function(err, items) {
            if (err) {
                return next(err);
            }

            res.json(items);
        });
    })
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        var item = new Item(req.body);

        item.save(function(err, item) {
            if (err) {
                return next(err);
            }

            res.json(item);
        });
    })
itemRouter.route('/:itemId')
    .get(function(req, res, next) {
        Item.findById(req.params.itemId, function(err, item) {
            if (err) return next(err);
            res.json(item);
        });
    })
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Item.findByIdAndUpdate(req.params.itemId, {
            $set: req.body
        }, {
            new: true
        }, function(err, item) {
            if (err) return next(err);
            res.json(item)
        })
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Item.findByIdAndRemove(req.params.itemId, function(err, item) {
            if (err) return next(err);
            res.json(item);
        });
    });




module.exports = itemRouter;

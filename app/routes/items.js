const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),

    Verify = require('./verify'),
    ItemCtrl = require('../controllers/market.ctrl')

itemRouter = express.Router();
itemRouter.use(bodyParser.json())

itemRouter.route('/')
    .get(ItemCtrl.getItems)
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, ItemCtrl.addItem)

itemRouter.route('/:itemId')
    .get(ItemCtrl.getItem)
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, ItemCtrl.editItem)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, ItemCtrl.deleteItem);


module.exports = itemRouter;

const express = require('express'),
    phraseRouter = express.Router(),
    Phrase = require('../models/phrases');

phraseRouter.get('/', function(req, res, next) {
    Phrase.find(function(err, phrases) {
        if (err) {
            return next(err);
        }
        res.json(phrases);
    });
});

module.exports = phraseRouter;

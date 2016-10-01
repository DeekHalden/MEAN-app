const express = require('express'),
    phraseRouter = express.Router(),
    Phrase = require('../models/phrases');

phraseRouter.get('/', (req, res, next) =>{
    Phrase.find((err, phrases) =>{
        if (err) {
            return next(err);
        }
        res.json(phrases);
    });
});

module.exports = phraseRouter;

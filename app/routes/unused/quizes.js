const express = require('express'),
    quizesRouter = express.Router(),
    Quiz = require('../models/quizes');


quizesRouter.get('/', (req, res, next) => {
    Quiz.find((err, quizes) => {
        if (err) return next(err);
        res.json(quizes)
    })
})
.route('/:id').get((req,res,next)=>{
	Quiz.findById(req.params.id,(err,quiz)=>{
		if(err)return next(err);
		res.json(quiz)
	})
})

module.exports = quizesRouter;
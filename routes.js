'use strict';

var express = require('express')
var router = express.Router()
var Question = require('./models').Question

router.param('qID',function(req,res,next,id){
    Question.findById(id,function(err,doc){
        if(err) return next(err)
        if(!doc){
            err = new Error('Not Found')
            err.status = 404;
            return next(err)
        }
        req.question = doc
        return next()
    })
})

router.param('aID',function(req,res,next,id){
    req.answer = req.question.answers.id(id);
    if(!req.answer){
        err = new Error('Not found');
        err.status = 404;
        return next(err)
    }
    next()
})    

//Get questions
router.get('/',(req,res,next)=>{
    // Question.find({},null,{sort: {createdAt: -1}},function(err,questions){
    //     if(err) return next(err)
    //     res.json(questions)
    // })
    Question.find({})
            .sort({createdAt: -1})
            .exec(function(err,questions){
                if(err) return next(err)
                res.json(questions)
            })
})

//Post questions
router.post('/',(req,res,next)=>{
    var question = new Question(req.body)
    question.save((err,question)=>{
        if(err) return next(err)
        res.status(201)
        res.json(question)
    })
    
})

//Get question
router.get('/:qID',(req,res)=>{
    res.json(req.question)
})

//Get answers
router.get('/:qID/answers',(req,res)=>{
    res.json(req.question.answers)
})

//Get answers
router.post('/:qID/answers',(req,res)=>{
    req.question.answers.push(req.body);
    req.question.save(function(err,question){
        if(err) return next(err);
        res.status(201);
        res.json(question)
    })
})

//PUT /questions/:qID/answers/:aID
//Change the specific answer
router.put('/:qID/answers/:aID',(req,res)=>{
    req.answer.update(req.body,function(err,result){
        if(err) return next(err);
        res.json(result);
    })
})

//DELETE /questions/:qID/answers/:aID
//Delete the specific answer
router.delete('/:qID/answers/:aID',(req,res)=>{
    req.answer.remove(function(err){
        req.question.save(function(err,question){
            if(err) return next(err);
            res.json(question);
        })
    })
})

//Vote up or down /questions/:qID/answers/:aID/vote-up or vote-down
//Vote to a specific answer
router.post('/:qID/answers/:aID/vote-:dir',
    (req,res,next)=>{
        if(req.params.dir.search(/^(up|down)$/) === -1){
            var err = new Error("Not Found")
            err.status = 404
            next(err)
        }else{
            req.vote = req.params.dir;
            next()
        }
    },
    (req,res)=>{
        req.answer.vote(req.vote, function(err,question){
            if(err) return next(err)
            res.json(question)
        })
    })

module.exports = router;
'use strict';

var express = require('express')
var app = express()
var port = process.env.PORT || 3001
var jsonParser = require('body-parser').json;
var routes = require('./routes')
var logger = require('morgan')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/qa')

var db = mongoose.connection;

db.on('error',(err)=>{
    console.error('There was error:', err)

})

db.once('open',()=>{
    console.log('Connection successful')
})

app.use(logger('dev'))

app.use(jsonParser())

app.use('/questions', routes)

// catch 404 and forward to error handler
app.use((req,res,next)=>{
    var err = new Error('Not found')
    err.status = 404;
    next(err)
})

//Error handler
app.use((err,req,res,next)=>{
    res.status(err.status || '500')
    res.json({
        error:{
            message: err.message
        }
    })
})

app.listen(port, () => {
    console.log(`Listening to port ${port}` )
})
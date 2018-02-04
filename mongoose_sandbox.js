'use strict';

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/sandbox')

var db = mongoose.connection;

db.on('error',(err)=>{
    console.error('There was error:', err)

})

db.once('open',()=>{
    console.log('Connection successful')
    // All database communication done here
    var Schema = mongoose.Schema;

    var AnimalSchema = new Schema({
        type:{ type:String, default: 'goldfish'},
        color:{ type:String, default: 'golden'},
        size: String,
        mass:{ type:Number, default: 0.007},
        name: { type:String, default: 'ivory'}
    })

    //Static methods
    AnimalSchema.statics.findSmall = function(callback){
        //this == Animal
        return this.find({size: 'small'}, callback)
    }

    //Generalising
    AnimalSchema.statics.findSize = function(size,callback){
        return this.find({size: size}, callback)
    }

    //Instance method
    //Instance method exists on all documents 
    //In instance methods, the this value points to instances of the document itself.
    AnimalSchema.methods.findSameColor = function(callback){
        //this == document
        return this.model('Animal').find({color: this.color},callback)
    }
    //Pre hook
    AnimalSchema.pre('save',function(next){
        if(this.mass >= 100){
            this.size = "big"
        }else if(this.mass >= 5 && this.mass <100){
            this.size = "medium"
        }else {
            this.size = "small"
        }
        next()
        
    })

    var Animal = mongoose.model('Animal', AnimalSchema);

    var elephant = new Animal({
        type: 'elephant',
        color: 'white',
        mass: 6000,
        name: 'raja'
    })

    var animal = new Animal({})

    var whale = new Animal({
        type: 'whale',
        color: 'white',
        mass: 60000,
        name: 'figy'
    })

    var animalData = [
        {
            type: 'mouse',
            color: 'gray',
            mass: 0.06,
            name: 'Marvin'
        },
        {
            type: 'nutria',
            color: 'brown',
            mass: 6.35,
            name: 'Gretchen'
        },
        {
            type: 'wolf',
            color: 'gray',
            mass: 45,
            name: 'Ghost'
        },
        elephant,
        animal,
        whale
    ]

    Animal.remove({},(err)=>{
        if(err) console.error(err)
        Animal.create(animalData,(err)=>{
            if(err) console.error(err)
            Animal.findOne({type:'elephant'},function(err,elephant){
                elephant.findSameColor(function(err,animals){
                    if(err) console.error(err)
                    animals.forEach((animal)=>{
                        console.log(`Animal found is ${animal.name} of color ${animal.color} of size ${animal.size}`)
                    })
                    db.close(()=>{
                        console.log('connection closed')
                    })
                })               
            })
        })
    })

    
})





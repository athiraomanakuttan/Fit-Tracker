const mongoose  = require('mongoose');

const calorieCollection =  new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'users', 
        required: true  
    },
    BMR:{
        type:Number,
        required: true
    },
    calorieIntake:{
        type:Number,
        required:true
    },
    calorieBreakdown :{
        type:Object,
        required:true
    }
    
})
module.exports = mongoose.model('calories',calorieCollection)
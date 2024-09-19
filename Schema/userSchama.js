const mongoose = require('mongoose');
// const { type } = require('os');
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type: String,
        required: true,
        unique: true
    },
    userPassword:{
        type: String,
        required: true,
    },
    otherDetails:[{
        age:{
            type:String
        },
        height:{
            type:String
        },
        weight:{
            type:String
        },
        gender:{
            type:String
        },
        activity_level:{
            type:String
        },
        fitness_goal:{
            type:String
        },
        targeted_weight:{
            type:String
        },
        exercise_preferences:{
            type:String
        },
        BMI:{
            type:Number
        },
        BMI_status:{
            type:String,
            enum:['Underweight','Normal','Overweight','Obesity']
        }
    }],
    userStatus:{
        type:Number,
        enum:[1,0],
        default:1
    }
})

module.exports = mongoose.model('users',userSchema)
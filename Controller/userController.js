const userCollection = require("../Schema/userSchama");
const calorieCollection = require('../Schema/calorieSchema')
const { ObjectId } =  require('mongodb')


// ---------------------------- render the BMI checking Page --------------------- 
const bmiDetails = (req, res) => {
    res.render("bmi-page");
};


// --------------------------- Get the BMI deatils of user ----------------------- 

const getBmiDetails = async (req, res) => {
    const userId = req.session.user;
    if (!userId) res.status(400).json({ message: "invalid user" });
    try {

        const BMIData = await userCollection.findOne({_id : new ObjectId(userId)},{otherDetails:1})
        if(BMIData === null || BMIData.otherDetails.length === 0)
        {
            res.status(200).json({ message : 'No records Found'})
        }
        else
        res.status(200).json({ BMIData })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err,
        });
    }
};

const getCalorieDetails = async (req, res) => {
    const userId = req.session.user;
    try {
        const calorieData = await calorieCollection.findOne({ userId: new ObjectId(userId) });
        if (calorieData === null) {
            const BMIData = await userCollection.findOne({ _id: new ObjectId(userId) }, { otherDetails: 1 });
            if (BMIData) {
                let data = BMIData.otherDetails[0], BMR;

                const activityMultipliers = {
                    'lightly active': 1.375,
                    'moderately active': 1.55,
                    'very active': 1.725
                };

                if (data.gender === 'male')
                    BMR = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
                else
                    BMR = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

                let totalCalories = Math.round(BMR * activityMultipliers[data.activity_level]);

                // Split the total calories into meals
                let calorieBreakdown = {
                    breakfast: Math.round(totalCalories * 0.25), // 25% for breakfast
                    lunch: Math.round(totalCalories * 0.35),     // 35% for lunch
                    dinner: Math.round(totalCalories * 0.30),    // 30% for dinner
                    snacks: Math.round(totalCalories * 0.10)     // 10% for snacks
                };

                // Insert calorie breakdown into the database
                const insertData = await calorieCollection.insertMany({
                    userId: userId,
                    BMR: BMR,
                    calorieIntake: totalCalories,
                    calorieBreakdown: calorieBreakdown
                });

                res.status(200).json({
                    userId: userId,
                    BMR: BMR,
                    calorieIntake: totalCalories,
                    calorieBreakdown: calorieBreakdown
                });
            }
        }
    } catch (err) {
        res.status(400).json(err);
    }
};


const getCaloriData = (req,res)=>{
    res.render('caloriePage')
}



module.exports = {
    bmiDetails,
    getBmiDetails,
    getCalorieDetails,
    getCaloriData
};

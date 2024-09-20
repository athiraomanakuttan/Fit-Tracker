const userCollection = require("../Schema/userSchama");
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

module.exports = {
    bmiDetails,
    getBmiDetails,
};

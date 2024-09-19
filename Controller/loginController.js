require("../configuration/dbConnection");
const session = require("express-session");
const userCollection = require("../Schema/userSchama");
const bcrypt = require("bcrypt");
let globalNotification = {};
const { ObjectId } = require("mongodb");

const loginPage = (req, res) => {
  res.render("./index");
};

// ---------------- user sign up page -----------------

const signupPage = (req, res) => {
  res.render("./signup-page");
};
const signupUser = async (req, res) => {
  let data = req.body;
  const salt = 10;
  data.userPassword = await bcrypt.hash(data.userPassword, salt);
  const userExistance = await userCollection.findOne({
    userEmail: data.userEmail,
    userStatus: 1,
  });
  if (userExistance === null) {
    const addUser = await userCollection.insertMany(data);
    if (addUser) {
      req.session.user = addUser[0]._id;
      res.redirect("/home-page");
    }
  } else {
    globalNotification = {
      status: true,
      message: "User Already exist. please login with this Email id",
    };
  }
};

const homepage = async (req, res) => {
  const calories = [300, 500, 400, 700, 600, 800, 1000]; // Example data
  res.render("./homepage", { calories });
};

const userLogin = async (req, res) => {
  const data = req.body;
  try {
    const checkuser = await userCollection.findOne({
      userEmail: data.userEmail,
    });
    if (checkuser) {
      let passwordCheck = await bcrypt.compare(
        data.userPassword,
        checkuser.userPassword
      );
      if (passwordCheck) {
        req.session.user = checkuser._id;
        res.redirect("/home-page");
      } else {
        globalNotification = {
          status: true,
          message: "User not found",
        };
        res.redirect("/");
      }
    } else {
      globalNotification = {
        status: true,
        message: "User not found",
      };
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

const checkProfile = async (req, res) => {
  const userId = req.session.user;

  try {
    const userData = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (userData) {
      if (userData.otherDetails && Array.isArray(userData.otherDetails)) {
        res.status(200).json({ length: userData.otherDetails.length });
      } else {
        res
          .status(200)
          .json({ length: 0, message: "No other details available" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------ saving some aditional details of user ------------------------
const additionalData = async (req, res) => {
  const userId = req.session.user;
  const data = req.body;

  try {
    if (!userId || !data) {
      res.status(400).json({ message: "invald Data" });
    }
    const BMI_data = calculateBMIData(data.height, data.weight);
    if(BMI_data)
    {
        data.BMI = BMI_data.bmi
        data.BMI_status = BMI_data.bmi_status
    }
    const addData = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { otherDetails: data } },
      { returnDocument: "after" } // To return the updated document if needed
    );
    if (!addData.value)
      res.status(400).json({ message: "could't update the record" });
    else res.status(200).json({ message: "Data added successfully" });
  } catch (err) {
    res.status(400).json({ message: "could't update the record" });
  }
};

const calculateBMIData = (height, weight) => {
    if (height > 0 && weight > 0) {

        const bmi = (Number(weight) / ((Number(height) / 100) * (Number(height) / 100))).toFixed(2);
        let bmi_status;
        if (bmi > 30) {
            bmi_status = 'Obesity';
        } else if (bmi > 25) {
            bmi_status = 'Overweight';
        } else if (bmi > 18.5) {
            bmi_status = 'Normal';
        } else {
            bmi_status = 'Underweight';
        }
        return { bmi, bmi_status };
    }
    return null;
};


module.exports = {
  loginPage,
  signupPage,
  signupUser,
  homepage,
  userLogin,
  checkProfile,
  additionalData,
};

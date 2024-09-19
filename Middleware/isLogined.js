const session = require('express-session');
const userCollection = require('../Schema/userSchama');
const { model } = require('mongoose');

const isLogined = async(req,res,next)=>{
    if(!req.session.user)
        res.redirect('/')
    else
    {
        const checkuser = await userCollection.findOne({_id: req.session.user,userStatus:1})
        if(checkuser=== null)
        res.redirect('/login')
        else
        next();
    }
}

const checkLogin = async (req,res,next)=>{
    if(!req.session.user)
        next();
    else
    {
        const checkuser = await userCollection.findOne({_id: req.session.user,userStatus:1})
        if(checkuser)
        res.redirect('/home-page')
    }
}

module.exports ={ isLogined,checkLogin }
const express = require("express")
const Router = express.Router()
const {login,AddUser,verifyMail,initiatePasswordReset,resetPassword} = require("../Controllers/Registration_Controller")

Router.use("/login",login)
Router.use("/signup",AddUser)
Router.get('/verify',verifyMail)
Router.post("/resetpassword",initiatePasswordReset)
Router.post('/resetpassword/:token', resetPassword);

module.exports = Router
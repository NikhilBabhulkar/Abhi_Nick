const express = require("express")
const Router = express.Router()
const {login,AddUser,verifyMail} = require("../Controllers/Registration_Controller")

Router.use("/login",login)
Router.use("/signup",AddUser)
Router.get('/verify',verifyMail)

module.exports = Router
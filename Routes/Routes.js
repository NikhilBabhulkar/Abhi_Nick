const express = require("express")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Router = express.Router()
const {login,AddUser,verifyMail,initiatePasswordReset,resetPassword} = require("../Controllers/Registration_Controller")
const uploadAudio=require('../Controllers/UploadController')

Router.use("/login",login)
Router.use("/signup",AddUser)
Router.get('/verify',verifyMail)
Router.post("/resetpassword",initiatePasswordReset)
Router.post('/resetpassword/:token', resetPassword);
Router.post('/upload', upload.single('audio'),uploadAudio)
module.exports = Router
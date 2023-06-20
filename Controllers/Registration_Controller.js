const User = require("../Modules/Auth")
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// for sending the email

const SendVarificationEmail = async (name, email, userID) => {

  try {
   const transporter =  nodemailer.createTransport({
      host :'smtp.gmail.com',
      port :587,
      secure :false,
      requireTLS:true,
      auth:{
        user:"nikbcreates@gmail.com",
        pass:'brfxvlvbrrznzblr'
      }
    })

    const mailOptions = {
      from :"nikbcreates@gmail.com",
      to:email,
      subject:"Varification Mail",
      html:`<p>Hii ${name} plese click here to  <a href="http://localhost:8080/api/verify?id=${userID}">Verify</a> Your mail.</p>`
    }
    transporter.sendMail(mailOptions,(err,info)=>{
      if(err){
        console.log(err)
      }else{
        console.log("Email has been sent")
      }
    })
  } catch (err) {
    console.log(err.message);
  }
}

// Email Varification 

const verifyMail = async (req,res)=>{
  try{
    const update = await User.updateOne({_id:req.query.id},{$set:{ isverified:true}})
    console.log(update);
    res.send("User Email Varification success!!!")

  }catch(err){
    console.log(err)
  }
}


const AddUser = async (req, res) => {
  try {
    const { fullname, age, email, number, address, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).send({ status: 'failed', msg: 'Email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      fullname: fullname,
      age: age,
      email: email,
      number: number,
      address: address,
      password: hashedPassword,
      isverified:false
    });
    const useradded = await newUser.save();

    const token = jwt.sign({ userID: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '5d'
    });

    if (useradded) {
      SendVarificationEmail(req.body.fullname, req.body.email, useradded._id)
      res.send({ status: 'success', msg: 'User created', token: token });
    } else {
      res.status(500).send({ status: 'error', msg: 'Internal Server Error' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 'error', msg: 'Internal Server Error' });
  }
};



// login 

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ status: 'failed', msg: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ status: 'failed', msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, {
      expiresIn: '5d'
    });

    res.send({ status: 'success', msg: 'Login successful', token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 'error', msg: 'Internal Server Error' });
  }
};

// Initial Password reset 
const initiatePasswordReset = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateResetToken();

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Password Reset after login

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the user with the provided token and check if it is still valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Reset the user's password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};




module.exports = { AddUser, login,verifyMail,initiatePasswordReset,resetPassword }
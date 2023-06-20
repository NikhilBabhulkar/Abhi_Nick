const mongoose = require("mongoose");

const url = 'mongodb+srv://nikhil:nikhil@cluster0.x7p2hfa.mongodb.net/medical';

const connect = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("You are connected to the database");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connect;

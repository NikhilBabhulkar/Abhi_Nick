const fs = require('fs');
const path = require('path');
const audioCheck = require('../Services/AudioCheck.js');
const { json } = require('body-parser');
const outputFolder = path.join(__dirname, '..', 'uploads', 'audio');

const uploadAudio = (req, res, err) => {
  if (err) {
    res.status(500), json({ message: "Invalid File Type" })
  }
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const tempPath = req.file.path;
  const outputPath = path.join(outputFolder);
  // Move the file to the desired folder

  
  fs.rename(tempPath, outputPath, async (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving the audio file' });
      console.log(err);
      return;
    }
    try {
      const condition = await audioCheck()
      if (condition) {
        console.log("here");
        res.status(200).json({ message: 'Audio Submitted' });
        return
      }
    }
    catch (err) {
      res.status(500).json({ message: "InValid File" })
    }



    fs.unlink(outputFolder, (error) => {
      if (error) {
        console.error('An error occurred while deleting the file:', error);
        return;
      }

      console.log('File deleted successfully');
    });
  });
}


module.exports = uploadAudio
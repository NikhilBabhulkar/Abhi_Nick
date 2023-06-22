const fs = require('fs');
const wav = require('node-wav');
const path = require('path')

const audioCheck = () => {
    return new Promise((resolve, reject) => {
      // Create an audio context
      const audioFile = path.join(__dirname, '..', 'uploads', 'audio');
      console.log("in audio check");
      fs.readFile(audioFile, (error, data) => {
        if (error) {
          console.error('An error occurred while reading the audio file:', error);
          reject(error); // Reject the promise with the error
          return;
        }
        try {
          const result = wav.decode(data);
          const audioData = result.channelData[0]; // Access audio data of the first channel
  
          const sampleRate = result.sampleRate;
          const numberOfChannels = result.channelData.length;
          const bitDepth = result.bitsPerSample;
          const durationInSeconds = audioData.length / sampleRate;
  
          // Perform quality analysis based on the audio properties
          const quality = sampleRate >= 44100 && numberOfChannels >= 1 && Math.floor(durationInSeconds) >= 30;
          resolve(quality); // Resolve the promise with the quality value
  
        } catch (error) {
          console.log(error);
          reject(error); // Reject the promise with the error
        }
  
        // Additional quality analysis can be performed based on your specific requirements
      });
    });
  };
  

module.exports = audioCheck
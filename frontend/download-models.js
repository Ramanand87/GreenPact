const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const OUTPUT_DIR = path.join(__dirname, 'public', 'models');

// Create models directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

console.log('Downloading face-api.js models...');

let downloaded = 0;

models.forEach(model => {
  const url = `${MODEL_URL}/${model}`;
  const dest = path.join(OUTPUT_DIR, model);
  
  https.get(url, (response) => {
    const file = fs.createWriteStream(dest);
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      downloaded++;
      console.log(`Downloaded: ${model} (${downloaded}/${models.length})`);
      
      if (downloaded === models.length) {
        console.log('All models downloaded successfully!');
      }
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading ${model}:`, err.message);
  });
});

const mongoose = require('mongoose');

// Schéma pour les objets annotés
const objectSchema = new mongoose.Schema({
  label: { type: String, required: true },
  polygon: { type: [[Number]], required: true },
});

// Schéma principal pour les images
const imageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  image: { type: String, required: true },
  metadata: {
    imgHeight: { type: Number, required: true },
    imgWidth: { type: Number, required: true },
    objects: [objectSchema],
  },
});

module.exports = mongoose.model('Image', imageSchema);

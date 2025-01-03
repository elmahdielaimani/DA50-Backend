const mongoose = require('mongoose');

// Schéma pour les objets annotés
const objectSchema = new mongoose.Schema({
  label: { type: String, required: true },
  polygon: { type: [[Number]], required: true },
  comment: { type: String, default: '' }, // Champ pour les commentaires
  importanceLevel: { type: String, default: '' }, // Champ pour la priorité
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

  // Champ pour stocker l'identifiant de l'utilisateur associé (peut être null)
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Champ pour vérifier si l'image est annotée
  isAnnotated: { type: Boolean, default: false },
});

module.exports = mongoose.model('Image', imageSchema);

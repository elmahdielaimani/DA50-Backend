const express = require('express');
const router = express.Router();
const Image = require('../src/Image/imageModel.js');
const User = require('../src/User/userModel.js');

const fs = require('fs');
const path = require('path');


var userController = require('../src/User/userController.js');

// Route GET avec pagination et filtrage par rôle
router.get('/image', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page demandée, par défaut 1
    const limit = parseInt(req.query.limit) || 10; // Limite par page, par défaut 10
    const skip = (page - 1) * limit; // Calculer le décalage

    const role = req.headers['role']; // Le rôle est récupéré depuis les headers

    if (!role) {
      return res.status(400).send({ error: 'Role is required in the headers' });
    }

    // Filtrer les images en fonction du rôle
    const filter = role === 'administrator'
      ? { isAnnotated: true }
      : role === 'user'
      ? { isAnnotated: false }
      : {}; // Aucun filtre si le rôle n'est pas valide

    const total = await Image.countDocuments(filter); // Nombre total d'images correspondant au filtre
    const images = await Image.find(filter).skip(skip).limit(limit); // Récupérer les images filtrées avec pagination

    res.status(200).json({
      images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des images avec pagination:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des images: ' + error.message });
  }
});



// Route pour récupérer une image spécifique
router.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: `Image with id ${req.params.id} not found` });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image: ' + error.message });
  }
});

router.post('/image/annotations', async (req, res) => {
  try {
    const { imageId, userId, objects } = req.body; // Récupération des données envoyées

    // Vérifier les champs requis
    if (!imageId || !userId || !objects) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Récupérer l'image par son ID
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Vérifier si l'image n'a jamais été annotée
    if (!image.isAnnotated) {
      // Marquer l'image comme annotée pour la première fois
      image.isAnnotated = true;
      image.id_utilisateur = userId;

      // Incrémenter le nombre d'images annotées pour l'utilisateur
      const user = await User.findById(userId);
      if (user) {
        user.numberOfAnnotatedImages = (user.numberOfAnnotatedImages || 0) + 1; // Initialiser si non défini et incrémenter
        await user.save(); // Sauvegarder les modifications sur l'utilisateur
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    // Mettre à jour les annotations de l'image
    image.metadata.objects = objects.map((obj) => ({
      label: obj.label,
      polygon: obj.polygon,
      importanceLevel: obj.importanceLevel || '',
      comment: obj.comment || '',
    }));

    // Sauvegarder les modifications sur l'image
    await image.save();

    res.status(200).json({ message: 'Annotations saved successfully' });
  } catch (error) {
    console.error('Error saving annotations:', error);
    res.status(500).json({ error: 'Failed to save annotations: ' + error.message });
  }
});



// Routes utilisateur
router.route('/user/login').post(userController.loginUserControllerFn);
router.route('/user/create').post(userController.createUserControllerFn);
router.route('/user/list').get(userController.getAllUsersControllerFn); // Affiche tous les utilisateurs
router.route('/user/user-info/:email').get(userController.getUserControllerFn1); // Affiche les infos utilisateur par email
router.route('/user/update-role').post(userController.updateUserRoleControllerFn);
router.route('/user/delete-user').post(userController.deleteUserControllerFn);
router.route('/user/update/:id').patch(userController.updateUserControllerFn);
router.route('/user/getUser/:id').get(userController.getUserControllerFn);

module.exports = router;

var express = require('express');
const router = express.Router();
var Image = require('../src/Image/imageModel.js');
var userController = require('../src/User/userController.js');


// Route GET avec pagination
router.get('/image', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page demandée, par défaut 1
    const limit = parseInt(req.query.limit) || 10; // Limite par page, par défaut 10

    const skip = (page - 1) * limit; // Calculer le décalage
    const total = await Image.countDocuments(); // Nombre total d'images
    const images = await Image.find().skip(skip).limit(limit); // Récupérer les images avec pagination

    res.status(200).json({
      images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des images avec pagination:', error);
    res.status(500).send({ error: 'Erreur lors de la récupération des images' });
  }
});


// Route pour récupérer une image spécifique
router.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id); // Récupère l'image par ID
    if (!image) {
      return res.status(404).json({ error: `Image with id ${req.params.id} not found` });
    }
    res.status(200).json(image); // Envoie l'image comme réponse JSON
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
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

var express = require('express');

var userController=require('../src/User/userController.js');
const router=express.Router();


const objectId = require('mongoose').Types.ObjectId;

var Image =require('../src/Image/imageModel.js');
const fs = require('fs');
const multer = require('multer');
//multer 
const directory = './images/'
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req ,file , cb) => {
        cb(null , directory)
    },
    filename: (req , file ,cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        cb(null , filename)
    },
});

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
      if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    },
  });



 // Route POST pour uploader l'image
router.post('/image/create', upload.single('image'), async (req, res) => {
  try {
    // Vérifiez si le fichier est présent
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded or invalid file format' });
    }

    // Vérifiez si le champ "nom" est fourni
    if (!req.body.nom) {
      return res.status(400).send({ error: 'Nom is required' });
    }

    const url = req.protocol + '://' + req.get('host');
    const image = new Image({
      nom: req.body.nom, // Nom envoyé depuis le corps de la requête
      image: url + '/images/' + req.file.filename, // URL de l'image
    });

    // Enregistrer l'image dans la base de données (async/await)
    const savedImage = await image.save();
    res.status(201).send(savedImage); // Envoyer l'image sauvegardée comme réponse
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).send({ error: 'Failed to upload image' });
  }
});





router.get('/image/get', async (req, res) => {
  try {
    const images = await Image.find(); // Récupère toutes les images
    res.status(200).send(images); // Envoie les images comme réponse
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send({ error: 'Failed to fetch images' });
  }
});


router.get('/image/:id', async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send(`No record found with id ${req.params.id}`);
  }

  try {
    const image = await Image.findById(req.params.id); // Utilisation de async/await
    if (!image) {
      return res.status(404).send(`Image with id ${req.params.id} not found`);
    }
    res.status(200).send(image); // Envoie les données de l'image
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});


    

const path = require('path');

router.delete('/image/:id', async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send(`No record found with id ${req.params.id}`);
  }

  try {
    // Trouver l'image avant de la supprimer
    const imageToDelete = await Image.findById(req.params.id);
    if (!imageToDelete) {
      return res.status(404).send(`Image with id ${req.params.id} not found`);
    }

    // Supprimer le fichier associé
    const imagePath = path.join(__dirname, '../images', path.basename(imageToDelete.image));
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log(`File deleted: ${imagePath}`);
      }
    });

    // Supprimer l'entrée de la base de données
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Image deleted successfully', deletedImage });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send({ error: 'Error deleting image' });
  }
});

    
router.put('/image/update/:id', upload.single('image'), async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send(`No record found with id ${req.params.id}`);
  }

  try {
    const existingImage = await Image.findById(req.params.id);

    if (!existingImage) {
      return res.status(404).send(`Image with id ${req.params.id} not found`);
    }

    const url = req.protocol + '://' + req.get('host');
    const updatedData = {
      nom: req.body.nom || existingImage.nom,
      image: existingImage.image, // Garder l'ancienne image si aucun fichier n'est envoyé
    };

    // Mettre à jour le fichier image si un nouveau fichier est envoyé
    if (req.file) {
      const imagePath = path.join(__dirname, '../images', path.basename(existingImage.image));
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting old file:', err);
      });

      updatedData.image = url + '/images/' + req.file.filename;
    }

    const updatedImage = await Image.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).send(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).send({ error: 'Failed to update image' });
  }
});

    

router.route('/user/login').post(userController.loginUserControllerFn);
router.route('/user/create').post(userController.createUserControllerFn);
router.route('/user/update/:id').patch(userController.updateUserControllerFn);
router.route('/user/getUser/:id').get(userController.getUserControllerFn);

module.exports=router;
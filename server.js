const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const routes = require('./route/routes');
const Image = require('./src/Image/imageModel'); // Assurez-vous que le chemin est correct

const app = express();
const PORT = 9992;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:4200", // Autoriser les requêtes depuis Angular frontend
}));
app.use('/images', express.static(path.join(__dirname, 'assets/images'))); // Servir les images comme ressources statiques
app.use(routes); // Routes principales

// Connexion à la base de données
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/DA50-Database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Script pour importer les données
async function seedDatabase() {
  const imagesDirectory = path.join(__dirname, 'assets/images'); // Chemin vers les images
  const jsonDirectory = path.join(__dirname, 'assets/json'); // Chemin vers les JSON

  try {
    const imageFiles = fs.readdirSync(imagesDirectory);
    const jsonFiles = fs.readdirSync(jsonDirectory);

    const bulkOperations = []; // Tableau pour stocker les opérations en bulk

    for (const jsonFile of jsonFiles) {
      const jsonFilePath = path.join(jsonDirectory, jsonFile);
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

      // Extraire le préfixe du nom
      const baseName = jsonFile.split('_gtFine_')[0]; // Préfixe commun
      const matchingImage = imageFiles.find((image) =>
        image.startsWith(baseName) && image.endsWith('.png')
      );

      if (matchingImage) {
        const imageUrl = `http://localhost:${PORT}/images/${matchingImage}`;

        // Ajouter une opération bulk pour une nouvelle image
        bulkOperations.push({
          updateOne: {
            filter: { nom: baseName }, // Vérifier si l'image existe déjà
            update: {
              $setOnInsert: {
                nom: baseName,
                image: imageUrl,
                metadata: {
                  imgHeight: jsonData.imgHeight,
                  imgWidth: jsonData.imgWidth,
                  objects: jsonData.objects,
                },
              },
            },
            upsert: true, // Insérer uniquement si l'image n'existe pas
          },
        });
      } else {
        console.error(`No matching image found for JSON: ${jsonFile}`);
      }
    }

    // Effectuer toutes les opérations en bulk
    if (bulkOperations.length > 0) {
      
      const result = await Image.collection.bulkWrite(bulkOperations);
      console.log(`Bulk operation completed: ${result.insertedCount || 0} images inserted, ${result.modifiedCount || 0} images updated.`);

    } else {
      console.log('No data to insert.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}


// Appel de la fonction au démarrage
connectToDatabase().then(() => {
  seedDatabase();
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

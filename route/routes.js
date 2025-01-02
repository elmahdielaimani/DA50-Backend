const express = require('express');
const router = express.Router();
const Image = require('../src/Image/imageModel.js');
const fs = require('fs');
const path = require('path');

// Route GET avec pagination
router.get('/image', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const total = await Image.countDocuments();
    const images = await Image.find().skip(skip).limit(limit);

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

// Save annotations
router.post('/image/annotations', async (req, res) => {
  try {
    const { imageId, objects } = req.body;

    if (!imageId || !objects) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Update the image document with new annotations
    image.metadata.objects = objects.map(obj => ({
      label: obj.label,
      polygon: obj.polygon,
      importanceLevel: obj.importanceLevel || 'medium',
      comment: obj.comment || ''
    }));

    // Save the updated image document
    await image.save();

    res.status(200).json({ message: 'Annotations saved successfully' });
  } catch (error) {
    console.error('Error saving annotations:', error);
    res.status(500).json({ error: 'Failed to save annotations: ' + error.message });
  }
});
module.exports = router;

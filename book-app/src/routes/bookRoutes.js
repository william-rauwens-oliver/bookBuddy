// routes/bookRoutes.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Ajouter un livre aux favoris
router.post('/', async (req, res) => {
  try {
    const { title, authors, categories, pageCount, maturityRating } = req.body;
    const book = new Book({ title, authors, categories, pageCount, maturityRating });
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'ajout du livre aux favoris');
  }
});

// Récupérer tous les favoris
router.get('/', async (req, res) => {
  try {
    const favorites = await Book.find();
    res.status(200).send(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des favoris');
  }
});

module.exports = router;

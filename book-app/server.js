// Import des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Book = require('./src/models/Book'); // Assurez-vous que le chemin vers votre modèle Book est correct
const Auth = require('./src/routes/Auth');

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ["GET", "POST"],
  credentials: true
}), bodyParser.json(), Auth);

// Port d'écoute du serveur
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/bookApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Gestion des erreurs de connexion MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

app.get('/toto', async (req, res) => {
  res.status(200).json({ message: 'plop' });
});

// Route pour ajouter un livre aux favoris
app.post('/api/favorites', async (req, res) => {
  console.log(req.body, 'toto');
  try {
    // Récupération des données du livre à ajouter aux favoris depuis le corps de la requête
    let { title, author, pages, published } = req.body;
    
    // Vérification de la valeur de pages
    if (!pages) {
      pages = 1;
    }

    // Création d'une nouvelle instance de livre
    const newBook = new Book({
      title,
      author,
      pages,
      published
    });

    // Enregistrement du livre dans la base de données MongoDB
    await newBook.save();

    // Réponse réussie
    res.status(201).json({ message: 'Livre ajouté aux favoris avec succès' });
  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur lors de l\'ajout du livre aux favoris', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour récupérer tous les livres en favoris
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await Book.find({});
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

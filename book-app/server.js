// Import des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Book = require('./src/models/Book'); // Assurez-vous que le chemin vers votre modèle Book est correct
const Auth = require('./src/routes/Auth')
// Initialisation de l'application Express
const app = express();
// app.use(bodyParser.json(),Auth);

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ["GET","POST"],
  credentials: true
}),bodyParser.json(),Auth);

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

app.get('/toto', async (req,res) => {
  res.status(200).json({ message: 'plop' });
})

// Route pour ajouter un livre aux favoris
app.post('/api/favorites', async (req, res) => {
  console.log(req.body,'toto')
  // try {
    // Récupération des données du livre à ajouter aux favoris depuis le corps de la requête
    const { title,author,
      pages,
      published } = req.body;
      if(pages === null) {pages = 1}
    // Création d'une nouvelle instance de livre
    const newBook = new Book({
      title,
      author,
      pages,
      published
    });

    // const newBook = new Book({
    //   title: title,
    //   author: authors,
    //   // categories,
    //   // pageCount,
    //   pages: pageCount,
    //   published : maturityRating
    // });

    // Enregistrement du livre dans la base de données MongoDB
    await newBook.save(newBook);
    // console.log(toto,'titi')
    // Réponse réussie
    res.status(201).json({ message: 'Livre ajouté aux favoris avec succès' });
  // } catch (error) {
    // Gestion des erreurs
    // console.error('Erreur lors de l\'ajout du livre aux favoris', error);
    // res.status(500).json({ message: 'Erreur du serveur' });
    // res.status(200).json({ message: 'plop ' });
  // }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

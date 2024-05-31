// Import des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Book = require('./src/models/Book');
const Favoris = require('./src/models/Favoris'); // Assurez-vous que le chemin vers votre modèle Book est correct

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
app.use(bodyParser.json());

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

// Définition du modèle pour la collection 'status'
const statusSchema = new mongoose.Schema({
  bookId: String,
  status: String,
  currentPage: Number
});

// Création du modèle pour la collection 'status'
const Status = mongoose.model('Status', statusSchema);

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour mettre à jour le statut de lecture et la page actuelle de lecture d'un livre
app.put('/api/statut/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status, currentPage } = req.body;

    // Vérifiez que la valeur de currentPage est un nombre valide
    const pageNumber = parseInt(currentPage);
    if (isNaN(pageNumber)) {
      throw new Error('currentPage doit être un nombre valide');
    }

    // Vérifiez si une entrée de statut existe déjà pour ce livre
    let existingStatus = await Status.findOne({ bookId });

    // Si aucune entrée de statut n'existe, créez-en une
    if (!existingStatus) {
      existingStatus = new Status({
        bookId,
        status,
        currentPage: pageNumber
      });
    } else {
      // Sinon, mettez à jour l'entrée de statut existante
      existingStatus.status = status;
      existingStatus.currentPage = pageNumber;
    }

    // Enregistrez ou mettez à jour l'entrée de statut dans la base de données MongoDB
    await existingStatus.save();

    res.status(200).json({ message: 'Statut de lecture mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de lecture', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour ajouter un livre aux favoris
app.post('/api/favorites', async (req, res) => {
  console.log(req.body,'toto')
  // Récupération des données du livre à ajouter aux favoris depuis le corps de la requête
  let { title, author, pages, published } = req.body;
  
  // Vérification de la valeur de pages
  if (!pages) {
    pages = 1;
  }
  
  // Création d'une nouvelle instance de livre
  const newFavoris = new Favoris({
    title,
    author,
    pages,
    published
  });
  
  try {
    // Enregistrement du livre dans la base de données MongoDB
    const toto = await newFavoris.save(newFavoris);
    console.log(toto,'titi')
    // Réponse réussie
    res.status(201).json({ message: 'Livre ajouté aux favoris avec succès', book: toto });
  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur lors de l\'ajout du livre aux favoris', error);
    res.status(403).json({ message: 'Erreur du serveur' });
  }
});

// Route pour récupérer tous les livres en favoris
app.get('/api/favoris', async (req, res) => {
  try {
    const favorites = await Favoris.find({});
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour ajouter un nouveau livre
app.post('/api/books', async (req, res) => {
  try {
    // Récupération des données du livre à partir du corps de la requête
    const { title, author, pages } = req.body;

    // Création d'une nouvelle instance de livre
    const newBook = new Book({
      title,
      author,
      pages,
    });

    // Enregistrement du livre dans la base de données MongoDB
    await newBook.save();

    // Réponse réussie
    res.status(201).json({ message: 'Livre ajouté avec succès' });
  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur lors de l\'ajout du livre', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});
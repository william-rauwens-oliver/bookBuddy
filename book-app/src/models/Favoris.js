const mongoose = require('mongoose');

const Favorischema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true },
  published: { type: String, required: true }
});

const Favoris = mongoose.model('Favoris', Favorischema);

module.exports = Favoris;

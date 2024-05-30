const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  categories: [String],
  pageCount: Number,
  maturityRating: String,
  status: String,
  pagesRead: Number,
  badgesEarned: [String]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

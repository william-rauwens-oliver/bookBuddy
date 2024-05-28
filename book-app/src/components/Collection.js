import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Collection.css';

const Collection = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'fiction', // Termes de recherche par défaut
            key: '' // Remplacez par votre clé API Google Books
          }
        });
        setBooks(response.data.items || []);
      } catch (error) {
        console.error('Error fetching books', error);
      }
    };
    fetchBooks();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchBookById = async (id) => {
    try {
      const response = await axios.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book by ID', error);
      throw error;
    }
  };

  const handleBookDetails = async (bookId) => {
    try {
      const book = await fetchBookById(bookId);
      console.log('Book details:', book);
      // Faites quelque chose avec les détails du livre, par exemple, affichez-les dans une modale
    } catch (error) {
      console.error('Error fetching book details', error);
      // Gérer les erreurs
    }
  };

  const filteredBooks = books.filter(book => {
    const title = book.volumeInfo?.title?.toLowerCase() || '';
    const authors = book.volumeInfo?.authors?.map(author => author.toLowerCase()).join(', ') || '';
    return title.includes(searchTerm.toLowerCase()) || authors.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Barre de recherche */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher par titre ou auteur" 
          value={searchTerm} 
          onChange={handleSearch} 
          className="search-input"
        />
      </div>
      
      {/* Liste des livres */}
      <div className="book-grid">
        {filteredBooks.map(book => (
          <div className="book-card" key={book.id}>
            <img 
              src={book.volumeInfo?.imageLinks?.thumbnail || 'default-image-url.jpg'} 
              className="book-image" 
              alt={book.volumeInfo?.title || 'No title available'} 
            />
            <div className="book-details">
              <h5 className="book-title">{book.volumeInfo?.title || 'No title available'}</h5>
              <p className="book-author">{book.volumeInfo?.authors?.join(', ') || 'No author available'}</p>
              <p className="book-category"><small>{book.volumeInfo?.categories?.join(', ') || 'No category available'}</small></p>
              <p className="book-pages">{book.volumeInfo?.pageCount ? `${book.volumeInfo.pageCount} pages` : 'No page count available'}</p>
              <p className="book-status"><strong>Status:</strong> {book.volumeInfo?.maturityRating || 'No status available'}</p>
              <button onClick={() => handleBookDetails(book.id)} className="btn btn-primary">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;

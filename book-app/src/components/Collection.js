import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Collection.css';

const Collection = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [readingStatus, setReadingStatus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [badgesEarned, setBadgesEarned] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'fiction', // Termes de recherche par défaut
            key: '' // Remplacez par votre clé API Google Books
          }
        });
        console.log(response, "toto")
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

  const getBadgeForPages = (totalPagesRead) => {
    const badgesEarnedCount = Math.floor(totalPagesRead / 20);
    return `Badge ${badgesEarnedCount}`;
  };

  const filteredBooks = books.filter(book => {
    const title = book.volumeInfo?.title?.toLowerCase() || '';
    const authors = book.volumeInfo?.authors?.map(author => author.toLowerCase()).join(', ') || '';
    return title.includes(searchTerm.toLowerCase()) || authors.includes(searchTerm.toLowerCase());
  });

  const updateReadingStatus = (bookId, page) => {
    setReadingStatus(prevStatus => ({
      ...prevStatus,
      [bookId]: parseInt(page)
    }));

    const totalPagesRead = Object.values(readingStatus).reduce((total, page) => total + page, 0);
    const badge = getBadgeForPages(totalPagesRead);
    if (!badgesEarned.includes(badge)) {
      setBadgesEarned(prevBadges => [...prevBadges, badge]);
    }
  };

  const markAsFavorite = async (bookId) => {
    try {
      const bookToAdd = filteredBooks.find(book => book.id === bookId);
      await axios.post('http://localhost:5000/api/favorites', {
        title: bookToAdd.volumeInfo.title,
        author: JSON.stringify(bookToAdd.volumeInfo.authors),
        // categories: bookToAdd.volumeInfo.categories,
        pages: parseInt(bookToAdd.volumeInfo.pageCount),
        published: bookToAdd.volumeInfo.maturityRating
      });
      setFavorites(prevFavorites => [...prevFavorites, bookId]);
    } catch (error) {
      console.error('Error marking as favorite', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="collection-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher par titre ou auteur" 
          value={searchTerm} 
          onChange={handleSearch} 
          className="search-input"
        />
      </div>
      
      <div className="book-grid">
        {filteredBooks.map(book => (
          <div className="book-card" key={book.id}>
            <img 
              src={book.volumeInfo?.imageLinks?.thumbnail || 'default-image-url.jpg'} 
              className="book-image" 
              alt={book.volumeInfo?.title || 'No title available'} 
            />
            <div className="book-details">
              <h3 className="book-title">{book.volumeInfo?.title || 'No title available'}</h3>
              <p className="book-author">{book.volumeInfo?.authors?.join(', ') || 'No author available'}</p>
              <p className="book-category">{book.volumeInfo?.categories?.join(', ') || 'No category available'}</p>
              <p className="book-pages">{book.volumeInfo?.pageCount ? `${book.volumeInfo.pageCount} pages` : 'No page count available'}</p>
              <p className="book-status"><strong>Status:</strong> {book.volumeInfo?.maturityRating || 'No status available'}</p>
              <p className="book-badge">{readingStatus[book.id] ? getBadgeForPages(readingStatus[book.id]) : 'No badge earned yet'}</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newPage = e.target.elements.page.value;
                updateReadingStatus(book.id, newPage);
              }}>
                <input type="number" name="page" placeholder="Dernière page lue" />
                <button type="submit">Mettre à jour</button>
              </form>
              <button onClick={() => handleBookDetails(book.id)} className="btn btn-primary">Details</button>
              <button onClick={() => markAsFavorite(book.id)} className="btn btn-secondary">Favori</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;

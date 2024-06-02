import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Collection.css';

const Collection = () => {
  const [googleBooks, setGoogleBooks] = useState([]);
  const [localBooks, setLocalBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [readingStatus, setReadingStatus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [badgesEarned, setBadgesEarned] = useState([]);

  useEffect(() => {
    const fetchGoogleBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'fiction',
            key: ''  // Insérez votre clé API Google ici
          }
        });
        setGoogleBooks(response.data.items || []);
      } catch (error) {
        console.error('Error fetching Google Books', error);
      }
    };
    fetchGoogleBooks();
  }, []);

  useEffect(() => {
    const fetchLocalBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books'); // Modifier l'URL selon votre configuration
        setLocalBooks(response.data || []);
      } catch (error) {
        console.error('Error fetching local books', error);
      }
    };
    fetchLocalBooks();
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
    } catch (error) {
      console.error('Error fetching book details', error);
    }
  };

  const getBadgeForPages = (totalPagesRead) => {
    const badgesEarnedCount = Math.floor(totalPagesRead / 20);
    return `Badge ${badgesEarnedCount}`;
  };

  const mergedBooks = [...googleBooks, ...localBooks];

  const filteredBooks = mergedBooks.filter(book => {
    const title = book.volumeInfo?.title?.toLowerCase() || book.title?.toLowerCase() || '';
    const authors = (book.volumeInfo?.authors || [book.author]).map(author => author.toLowerCase()).join(', ');
    return title.includes(searchTerm.toLowerCase()) || authors.includes(searchTerm.toLowerCase());
  });

  const updateReadingStatus = async (bookId, page) => {
    try {
      await axios.put(`http://localhost:5000/api/statut/${bookId}`, {
        status: readingStatus[bookId]?.status || 'à lire plus tard',
        currentPage: page
      });
      setReadingStatus(prevStatus => ({
        ...prevStatus,
        [bookId]: { ...prevStatus[bookId], page }
      }));
      const totalPagesRead = Object.values(readingStatus).reduce((total, book) => total + (book.page || 0), 0);
      const badge = getBadgeForPages(totalPagesRead);
      if (!badgesEarned.includes(badge)) {
        setBadgesEarned(prevBadges => [...prevBadges, badge]);
      }
    } catch (error) {
      console.error('Error updating reading status', error.response ? error.response.data : error.message);
    }
  };

  const markAsFavorite = async (bookId) => {
    const bookToAdd = filteredBooks.find(book => book.id === bookId);
    try {
      await axios.post('http://localhost:5000/api/favorites', {
        title: bookToAdd.volumeInfo?.title || bookToAdd.title,
        author: JSON.stringify(bookToAdd.volumeInfo?.authors || [bookToAdd.author]),
        pages: bookToAdd.volumeInfo?.pageCount || bookToAdd.pages,
        published: bookToAdd.volumeInfo?.maturityRating
      });
      setFavorites(prevFavorites => [...prevFavorites, bookId]);
    } catch (error) {
      console.error('Error marking as favorite', error.response ? error.response.data : error.message);
    }
  };

  const handleStatusChange = (bookId, status) => {
    setReadingStatus(prevStatus => ({
      ...prevStatus,
      [bookId]: { ...prevStatus[bookId], status }
    }));
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
        {filteredBooks.map(book => {
          const bookId = book.id;
          const bookStatus = readingStatus[bookId]?.status || 'à lire plus tard';
          const pagesRead = readingStatus[bookId]?.page || 0;
          const totalPages = book.volumeInfo?.pageCount || book.pages || 1;
          const progressPercentage = (pagesRead / totalPages) * 100;

          return (
            <div className="book-card" key={bookId}>
              <img 
                src={book.volumeInfo?.imageLinks?.thumbnail || 'default-image-url.jpg'} 
                className="book-image" 
                alt={book.volumeInfo?.title || book.title || 'No title available'} 
              />
              <div className="book-details">
                <h3 className="book-title">{book.volumeInfo?.title || book.title || 'No title available'}</h3>
                <p className="book-author">{book.volumeInfo?.authors?.join(', ') || book.author || 'No author available'}</p>
                <p className="book-category">{book.volumeInfo?.categories?.join(', ') || 'No category available'}</p>
                <p className="book-pages">{totalPages ? `${totalPages} pages` : 'No page count available'}</p>
                <p className="book-status">
                  <strong>Status:</strong>
                  <select value={bookStatus} onChange={(e) => handleStatusChange(bookId, e.target.value)}>
                    <option value="à lire plus tard">À lire plus tard</option>
                    <option value="en cours de lecture">En cours de lecture</option>
                    <option value="lecture finie">Lecture finie</option>
                  </select>
                </p>
                {bookStatus === 'en cours de lecture' && (
                  <div>
                    <p className="book-badge">{pagesRead ? getBadgeForPages(pagesRead) : 'No badge earned yet'}</p>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const newPage = e.target.elements.page.value;
                      updateReadingStatus(bookId, newPage);
                    }}>
                      <input type="number" name="page" placeholder="Dernière page lue" />
                      <button type="submit">Mettre à jour</button>
                    </form>
                  </div>
                )}
                <button onClick={() => markAsFavorite(bookId)} className="btn btn-secondary">Favori</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;

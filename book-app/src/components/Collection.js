import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Collection.css';

const Collection = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Book Collection</h2>
      <div className="row">
        {books.map(book => (
          <div className="col-md-4 mb-4" key={book._id}>
            <div className="card h-100">
              <img src={book.image} className="card-img-top" alt={book.title} />
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">{book.author}</p>
                <p className="card-text"><small className="text-muted">{book.category}</small></p>
                <p className="card-text">{book.pages} pages</p>
                <p className="card-text"><strong>Status:</strong> {book.status}</p>
                <button className="btn btn-primary">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;

// Formulaire.js
import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pages: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/books', formData);
      onBookAdded(response.data);
      setFormData({
        title: '',
        author: '',
        pages: '',
      });
    } catch (error) {
      console.error('Error adding book', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titre" required />
      <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Auteur" required />
      <input type="number" name="pages" value={formData.pageCount} onChange={handleChange} placeholder="Nombre de pages" required />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddBookForm;
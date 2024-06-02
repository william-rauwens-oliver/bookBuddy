import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <TextField
        label="Titre"
        variant="outlined"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Auteur"
        variant="outlined"
        name="author"
        value={formData.author}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Nombre de pages"
        variant="outlined"
        type="number"
        name="pages"
        value={formData.pages}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Ajouter
      </Button>
    </form>
  );
};

export default AddBookForm;

// Formulaire.js
import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image: '',
    status: 'à lire',
    pageCount: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoyer les données du formulaire au backend pour enregistrement
      const response = await axios.post('http://localhost:5000/api/books', formData);
      // Mettre à jour l'état local avec le nouveau livre ajouté
      onBookAdded(response.data);
      // Réinitialiser le formulaire après soumission
      setFormData({
        title: '',
        author: '',
        image: '',
        status: 'à lire',
        pageCount: '',
        category: ''
      });
    } catch (error) {
      console.error('Error adding book', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titre" required />
      <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Auteur" required />
      <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="URL de l'image" required />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="à lire">À lire</option>
        <option value="en cours de lecture">En cours de lecture</option>
        <option value="fini">Fini</option>
      </select>
      <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} placeholder="Nombre de pages" required />
      <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Catégorie" required />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddBookForm;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      const response = await axios.post('http://localhost:5000/api/auth/register', { username: name, email, password, confirmPassword });
      console.log('Registration successful', response.data);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Requête effectuée, mais le serveur a répondu avec un code d'erreur
        console.error('Server responded with error data:', error.response.data);
        console.error('Server responded with error status:', error.response.status);
        setError(error.response.data.message); // Afficher le message d'erreur renvoyé par le serveur
      } else if (error.request) {
        // La requête a été effectuée, mais aucune réponse n'a été reçue
        console.error('No response received from server:', error.request);
        setError('No response received from server');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Error setting up request:', error.message);
        setError('Error setting up request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container register">
        <form onSubmit={handleSubmit}>
          <h1>Inscription</h1>
          <div className="social-icons">
            <a><i className="fa-brands fa-facebook"></i></a>
            <a><i className="fa-brands fa-linkedin"></i></a>
            <a><i className="fa-brands fa-google"></i></a>
            <a><i className="fa-brands fa-github"></i></a>
          </div>
          <span>Inscription avec Email et Mots de passe</span>
          <input
            className="form-input"
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Mots de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Confirmé le mots de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          <Link to="/login" className="login-link">Vous avez un compte ? Connectez-vous</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;

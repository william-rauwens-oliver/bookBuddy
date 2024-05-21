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
      const response = await axios.post('/api/auth/register', { name, email, password });
      console.log('Registration successful', response.data);
    } catch (error) {
      console.error('Registration error', error);
      setError('Registration failed. Please try again.');
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

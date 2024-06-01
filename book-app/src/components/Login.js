import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate(); // Créer une instance de useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Connexion réussie', response.data);
      navigate('/Collection'); // Rediriger vers la page Collection après une connexion réussie
    } catch (error) {
      console.error('Erreur de connexion:', error);
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('Password reset request for:', resetEmail);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegister = () => {
    const container = document.getElementById('container');
    container.classList.add("active");
  };

  const handleToggleLogin = () => {
    const container = document.getElementById('container');
    container.classList.remove("active");
  };

  return (
    <div className="container" id="container">
      <div className={`form-container ${forgotPassword ? 'forgot-password' : 'login'}`}>
        {!forgotPassword ? (
          <form onSubmit={handleSubmit}>
            <h1>Connexion</h1>
            <div className="social-icons">
              <a><i className="fa-brands fa-facebook"></i></a>
              <a><i className="fa-brands fa-linkedin"></i></a>
              <a><i className="fa-brands fa-google"></i></a>
              <a><i className="fa-brands fa-github"></i></a>
            </div>
            <span>Connexion avec email et mots de passe</span>
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
            {error && <div className="error-message">{error}</div>}
            <div className="action-links">
              <a href="#" onClick={() => setForgotPassword(true)} className="forgot-password-link">Mots de passe oublié</a>
              <Link to="/Register" className="signup-link" onClick={handleToggleRegister}>Inscription</Link>
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Connexion en cours...' : 'Connexion'}</button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <h1>Mots de passe oublié</h1>
            <span>Entrez votre email pour réinitialiser votre mot de passe</span>
            <input
              className="form-input"
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <a href="#" onClick={() => setForgotPassword(false)} className="back-to-login-link" onClick={handleToggleLogin}>Retour à la connexion</a>
            <button type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Connexion Réussi', response.data);
    } catch (error) {
      console.error('Erreur de Connexion', error);
      setError('Login failed. Please check your credentials.');
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
      console.error('Forgot password error', error);
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
          <form>
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
            <button type="submit" disabled={loading} onClick={handleSubmit}>{loading ? 'Logging in...' : 'Connexion'}</button>
          </form>
        ) : (
          <form>
            <h1>Mots de passe oublié</h1>
            <span>Enter your email to reset your password</span>
            <input
              className="form-input"
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <a href="#" onClick={() => setForgotPassword(false)} className="back-to-login-link" onClick={handleToggleLogin}>Go back to login</a>
            <button type="submit" disabled={loading} onClick={handleForgotPassword}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

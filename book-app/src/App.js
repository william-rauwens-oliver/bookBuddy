import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import Login from './components/Login';
import Register from './components/Register';
import Collection from './components/Collection';
import HomePage from './components/HomePage';
import FavoritesPage from './components/Favoris';
import Formulaire from './components/Formulaire';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">Home</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/collection">Collection</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/favorites">Favorites</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/formulaire">Formulaire</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/formulaire" element={<Formulaire />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

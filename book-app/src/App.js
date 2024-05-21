import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Collection from './components/Collection';

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">Book Tracker</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/login">Login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/register">Register</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mt-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

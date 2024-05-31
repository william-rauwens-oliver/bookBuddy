import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import './custom.css'; 

const Favoris = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/favoris');
        setFavorites(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <Container className="text-center">
      <h1 className="my-4 text-right">Mes Favoris</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row>
            {favorites.map((book) => (
              <Col key={book._id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                      <strong>Auteur:</strong> {book.author}<br />
                      <strong>Pages:</strong> {book.pages}<br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Favoris;

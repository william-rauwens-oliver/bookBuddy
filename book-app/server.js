const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3001'],
  credentials: true // Si vous utilisez des cookies ou des sessions
}));


const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/bookApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/auth', require('./src/routes/Auth'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

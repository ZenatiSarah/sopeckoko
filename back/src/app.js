require('dotenv').config();
const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const hpp = require('hpp')

const saucesRoute =  require('../routes/sauces');
const authRoute = require('../routes/auth');

//Connexion à la base de donnée
mongoose.connect('mongodb+srv://sopekockoUser:user12345@cluster0.88wfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,

  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée ! '+ error));

//Ajout du middleware Général CORS 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/api/sauces', saucesRoute);
app.use('/api/auth', authRoute);

app.use(helmet());
app.use(hpp());


module.exports = app;
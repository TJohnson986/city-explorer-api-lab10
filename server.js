'use strict';

const express = require('express');
const app = express();


require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());

const weather = require('./modules/weather.js');

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}  

app.listen(PORT, () => console.log(`Server up on ${process.env.PORT}`));

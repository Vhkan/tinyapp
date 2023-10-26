const express = require('express');
const app = express();
const PORT = 8080; //Default port

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send('Hello User!')
});

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}!`);
});
const express = require('express');
const app = express();
const PORT = 8081; //Default port

app.set('view engine', 'ejs');

//Adding the body-parser library
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send('Hello User!')
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello',(req, res) => {
  res.send('<html><body>Hello<b>World</b></body></html>\n');
});

//Rendering the urls_index
app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase}
  res.render('urls_index',templateVars);
});

//Rendering the  /url/new
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//Rendering the urls_show
app.get('/urls/:id', (req, res) => {
  const templateVars = {id:req.params.id, longURL: urlDatabase[req.params.id]}; 
  res.render('urls_show', templateVars);
});


//A function to generate random a string of 6 alphanumeric characters

let characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let strLen = 6;

 const generateRandomString = function(strLen, characterSet) {
  //stringLeng = defines number of symbols in our string
  let randomString = '';
  for(let i = 0; i < strLen; i++) {
    let randomPosit = Math.floor(Math.random() * characterSet.length);
    randomString += characterSet.substring(randomPosit, randomPosit + 1);
  }
  return randomString;
};
// console.log("Here is the random short string:", generateRandomString(strLen, characterSet));

//Adding a post method to handle the urls route
app.post('/urls', (req, res) => {
 
  let newId = generateRandomString(strLen, characterSet);
  let newLongURL = req.body.longURL;
  console.log("The random string is:", newId);
  console.log("Entered link is:", newLongURL);

//Saving a page link to our DB
urlDatabase[newId] = newLongURL;

//Redireting to a recently created short new URL
  res.redirect(`/urls`);
});

//Adding another route handler for short URLs
app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});



app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}!`);
});

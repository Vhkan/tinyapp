const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
const PORT = 8090; //Default port

app.set('view engine', 'ejs');

//Adding the body-parser library
app.use(express.urlencoded({ extended: true }));

//"DB" for storing links
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

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello<b>World</b></body></html>\n');
});

//Rendering the urls_index
app.get('/urls', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]      
  }
  res.render('urls_index', templateVars);
});

//Rendering the  /url/new
app.get('/urls/new', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]      
  };
  res.render('urls_new', templateVars);
});

//Rendering the urls_show
app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404);
    res.send("No link with this ID found!");
    return;
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render('urls_show', templateVars);
});

//A function to generate random a string of 6 alphanumeric characters

let characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let strLen = 6;

const generateRandomString = function(strLen, characterSet) {
  //stringLeng = defines number of symbols in our string
  let randomString = '';
  for (let i = 0; i < strLen; i++) {
    let randomPosit = Math.floor(Math.random() * characterSet.length);
    randomString += characterSet.substring(randomPosit, randomPosit + 1);
  }
  return randomString;
};

//Adding a post method to handle the urls route
app.post('/urls', (req, res) => {

  const newId = generateRandomString(strLen, characterSet);
  const newLongURL = req.body.longURL;

  //Saving a page links short/long URLs to our "DB"
  urlDatabase[newId] = newLongURL;

  res.redirect(`/urls/${newId}`);
});

//Adding another route handler from short to long URLs
app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//Deleting a link
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//Adding urls_show route handler
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect('/urls');
});

//Adign user login handler
app.post('/login', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username);
  res.redirect('/urls');
});

//Passing in the username to the page header
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_index', templateVars);
});

//Adign user logout handler
app.post('/logout', (req, res) => {
  const { username } = req.body;
  res.clearCookie('username', username);
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}!`);
});

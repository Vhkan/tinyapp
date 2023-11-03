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

//User "DB" from Compass
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  test1: {
    id: "test1",
    email: "test1@test.com",
    password: "123"
  }
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
  const {user_id} = req.cookies;
  if (!user_id) {
    return res.redirect('/login');
  };
  const templateVars = {
    urls: urlDatabase,
    user: users[user_id]
  }
  res.render('urls_index', templateVars);
});

//Rendering the /url/new
app.get('/urls/new', (req, res) => {
  const {user_id} = req.cookies;
  if (!user_id) {
    return res.redirect('/login');
  };
  const templateVars = {
    user: users[user_id]
  };
  res.render('urls_new', templateVars);
});

//Rendering the urls_show
app.get('/urls/:id', (req, res) => {
  const {user_id} = req.cookies;
  if (!user_id) {
    return res.redirect('/login');
  };

  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    return res.status(404).send("No link with this ID found!");
  }
  const templateVars = {
    id: req.params.id,
    longURL,
    user: users[user_id]
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

//A function that checks emails in our "DB"
const getUserByEmail = function(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
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
    //accessing obj values using dynamic keys 
    const longURL = urlDatabase[req.params.id];    
  res.redirect(longURL);
});

//Deleting a link
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//urls_show route handler
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect('/urls');
});

//login handler
app.get('/login', (req, res) => {
  const {user_id} = req.cookies;
  if (user_id) {
    return res.redirect('/urls');
  };
  const templateVars = {
    user: null,
  };
  res.render('login', templateVars);
});


//user login handler
app.post('/login', (req, res) => {
  //adding new login page functionality
  const { email } = req.body;
  const { password } = req.body;
  //Using our functions: to checks emails in or "DB"
  const user = getUserByEmail(email);
  //Checking users credentials
  if (email === "" || password === "") {
    return res.status(400).send("Email and password fields cannot be blanc!");
  };
  if (user === null) {
    return res.status(403).send('User with such email is not found!');
  };
  if (user.email === email && user.password === password) {
    res.cookie('user_id', user.id);
    return res.redirect('/urls');
  };
  return res.redirect('/login');
});

//Passing in the username to the page header
app.get('/urls', (req, res) => {
  const {user_id} = req.cookies;
  if (!user_id) {
    return res.status(400).send('User is not logged in!');
  };

  const templateVars = {
    urls: urlDatabase,
    user: users[user_id],
  };

  res.render('urls_index', templateVars);
});

//Adding user logout handler
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

//User registration page
app.get('/register', (req, res) => {

  const {user_id} = req.cookies;
  if (user_id) {
    return res.redirect('/urls');
  };
  
  const templateVars = {
    user: null
  };
  res.render('user_registration', templateVars);
});

//Creating a users registration handler
app.post('/register', (req, res) => {
  const userId = generateRandomString(strLen, characterSet);
  //Creating new vars email/password and assigning values to them 
  //by taking their values from the body
  const { email } = req.body;
  const { password } = req.body;
  if (email === "" || password === "") {
    return res.status(400).send("Email and password cannot be blanc!");
  };
  const user = getUserByEmail(email);
  if (user) {
    return res.send('User with this email already exists.');
  };
  //Accessing the "DB" and passing it input entered values
  users[userId] = { id: userId, email: email, password: password };
  //Setting the user_id cookies
  res.cookie('user_id', userId);
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}!`);
});

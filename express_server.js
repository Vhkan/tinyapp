const express = require('express');
// const cookieParser = require('cookie-parser')
const app = express();
// app.use(cookieParser());
const PORT = 8090; //Default port
const {generateRandomString, getUserByEmail, urlsForUser} = require('./functions');
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');

app.set('view engine', 'ejs');
//Adding the body-parser library
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['edmntn']
}));

let characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let strLen = 6;

//"DB" for storing links

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

//Rendering the 'My URLs' urls_index
app.get('/urls', (req, res) => {
  const {user_id} = req.session;
  if (!user_id) {
    return res.redirect('/login');
  }; //now everyone can see myurls page
  const usersUrls = urlsForUser(urlDatabase, user_id);
  const templateVars = {
    urls: usersUrls,
    user: users[user_id]
  }
  res.render('urls_index', templateVars);
});

//Rendering the /url/new
app.get('/urls/new', (req, res) => {
  const {user_id} = req.session;
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
  const {user_id} = req.session;
  console.log("User_id", user_id);
  console.log("URL DB", urlDatabase[req.params.id]);
  if (user_id !== urlDatabase[req.params.id]?.userID) {
    return res.redirect('/login');
  };
  const longURL = urlDatabase[req.params.id]?.longURL;
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

//Adding a post method to handle the urls route
app.post('/urls', (req, res) => {
  const newId = generateRandomString(strLen, characterSet);
  const newLongURL = req.body.longURL;
  const {user_id} = req.session;
  //Saving a page links short/long URLs to our "DB"
  urlDatabase[newId] = {longURL: newLongURL, userID: user_id};
console.log(urlDatabase);
  res.redirect(`/urls/${newId}`);
});

//Adding another route handler from short to long URLs
app.get('/u/:id', (req, res) => {
    //accessing obj values using dynamic keys 
    const longURL = urlDatabase[req.params.id].longURL;  
    // if (!longURL) {
    //   res.status(401).send('There is no such short URL in a DB')
    // };
  res.redirect(longURL);
});

//Deleting a link
app.post('/urls/:id/delete', (req, res) => {
  const {user_id} = req.session;
  if (!user_id) {
    res.send("Log in to the page to make any changes!")
   };
   delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//POST urls_show route handler
app.post('/urls/:id', (req, res) => {
  const newLongURL = req.body.newURL;
  const {user_id} = req.session;
  if (!user_id) {
    res.send("Log in to the page to make any changes!")
   }
   urlDatabase[req.params.id] = {
    longURL: newLongURL,
    userID: user_id
   };
  res.redirect('/urls');
});

//login handler
app.get('/login', (req, res) => {
  const {user_id} = req.session;
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
  const user = getUserByEmail(email, users);
  //Checking users credentials
  if (email === "" || password === "") {
    return res.status(400).send("Email and password fields cannot be blanc!");
  };
  if (user === null) {
    return res.status(403).send('User with such email is not found!');
  };
  if (user.email === email && bcrypt.compareSync(password, user.password )) {
    // res.cookie('user_id', user.id);
    req.session.user_id = user.id;
    return res.redirect('/urls');
  };
  return res.redirect('/login');
});

//Passing in the username to the page header
app.get('/urls', (req, res) => {
  const {user_id} = req.session;
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
  // res.clearCookie('user_id');
  req.session = null;
  res.redirect('/login');
});

//User registration page
app.get('/register', (req, res) => {
  const {user_id} = req.session;
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
  const userID = generateRandomString(strLen, characterSet);
  //Creating new vars email/password and assigning values to them 
  //by taking their values from the body
  const { email } = req.body;
  const { password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || password === "") {
    return res.status(400).send("Email and password cannot be blanc!");
  };
  const user = getUserByEmail(email, users);
  if (user) {
    return res.send('User with this email already exists.');
  };
  //Accessing the "DB" and passing it input entered values
  users[userID] = { id: userID, email: email, password: hashedPassword };
  //Setting the user_id cookies
  // res.cookie('user_id', userID);
  req.session.user_id = userID;

  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}!`);
});

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

//A function that checks emails in our users "DB"
const getUserByEmail = function(email, users) {
  for (const userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
  return null;
};

//Function for urls filtering based on userID
const urlsForUser = function(urlDatabase, id) {
  const newDB = {};
  for(let URL in urlDatabase) {
    if (urlDatabase[URL].userID === id) {
      newDB[URL] = urlDatabase[URL];
    }
  }
  return newDB;
};

module.exports = {generateRandomString, getUserByEmail, urlsForUser}; 
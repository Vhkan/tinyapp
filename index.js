//Our app functionality goes here=>

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
console.log("Here is the random short string:", generateRandomString(strLen, characterSet));


//module.exports = generateRandomString;
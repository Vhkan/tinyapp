const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//Links storage "DB"
const testUrlDatabase = {
  b6UUxQ: {
    longURL: "https://www.epl.ca",
    userID: "aJ45lW",
  },
  i3LLGr: {
    longURL: "https://www.ufa.ca",
    userID: "aJ55lW",
  },
};

//Chararters for generateRandomString function
let characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let strLen = 6;


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  }); 
});

describe('generateRandomString', function() {
  it('should generate an 6 digit alpanumeric low + capital letters string', function() {
    const alphaNumStr = generateRandomString(strLen,characterSet);
    assert.strictEqual(alphaNumStr.length, 6);
  });
});

describe('urlsForUser', function() {
  it('Should return an empty object if there is no user id in the DB', function() {
    const randomUserId = 'aJ10lW"';
    const userUrls = urlsForUser(testUrlDatabase, randomUserId);
    assert.deepEqual(userUrls, {});
  });
});
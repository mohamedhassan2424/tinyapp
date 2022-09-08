const { assert } = require('chai');

const { getUserByEmail } = require('./helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    assert.equal(user,testUsers.xyz)
    //const expectedUserID = "userRandomID";
    
  });
  it('should return undefined when their not equal to each other', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    assert.equal(user,undefined)
});
it('non-existentent email is saved on the database as they are not equal to each other', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    assert.notEqual(user,undefined)
});
}); 
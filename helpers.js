const getUserByEmail = (email, database) => {
  for (let userId in database) {
    if (database[userId].email.toLowerCase() === email.toLowerCase()) {
      return database[userId];
    }
  }
  return false;
};

const urlsForUser = function (id, database) {
  let userURLS = {};
  for (let keys in database) {
    const value = database[keys];
    console.log("value", value);
    if (value.userID === id) {
      userURLS[keys] = value;
    }
  }
  return userURLS;
} ;
const shortUrl = function generateRandomString(stringSize) {
  let optionalChracters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let inputString = "";
  for (let i = 0; i < stringSize; i++) {
    inputString += optionalChracters.charAt(
      Math.floor(Math.random() * optionalChracters.length)
    );
    console.log(inputString) ;
  }
  //console.log(inputString)
  return inputString;
};

module.exports = { getUserByEmail, urlsForUser, shortUrl };

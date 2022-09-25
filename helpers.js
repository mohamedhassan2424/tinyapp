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


module.exports = { getUserByEmail, urlsForUser, shortUrl };

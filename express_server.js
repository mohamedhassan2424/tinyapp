const bcrypt = require("bcryptjs");
const express = require("express");
//const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080; // default port 8080
const { getUserByEmail, urlsForUser } = require("./helpers");
// all the required functionnality for our webiste are added here including the port number

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
} ;
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
};
//user and the URLDatabase are found above

const id = Math.random().toString(36).substring(2, 8);
// here is our generated 6 string letter and number
//app.use(cookieParser());
app.use(
  cookieSession({
    name: "cookieName",
    keys: ["secretKey1", "secretKey2"],
  })
);
// using the cookies session instead of the parser for encryption purposes
app.set("view engine", "ejs"); // set it for all the path to be accessbily
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  // sending a get request to our urls
  const storedUserID = req.session.user_id;

  if (!storedUserID) {
    // chekcing to see if we are logged in. checkin our cookie
    return res.send("Suggest user to log in or register first");
  }

  const longUrlOfUserId = urlsForUser(storedUserID,urlDatabase); // get the approaite URL for the approaite user
  console.log("longURL" ,longUrlOfUserId )
  const templateVars = {
    urls: longUrlOfUserId,
    users: users[storedUserID],
  };
  return res.render("urls_index", templateVars) ;
});
app.post("/urls", (req, res) => {
  // after the get request is a post is needed to configure the data on the webpage and send the approaite messages
  //console.log(req.body);
  //console.log(req.params.id
  //console.log(longUrlValue)
  //res.send("Okay Recieved");
  const storedUserID = req.session.user_id;
  if (!storedUserID) {
    res.send("User Cannot shorten the URL");
  }
  if (storedUserID) {
    // checking to see if user is signed if it is than it will continue on
    //const id = Math.random().toString(36).substring(2, 8);
    const longUrlValue = req.body.longURL ;
    urlDatabase[id] = {
        id : id,
        longURL : longUrlValue,
        userID: storedUserID
    };

    res.redirect(`/urls/${id}`);
  }
});
app.get("/urls/new", (req, res) => {
  // redirect to new page if this page url is met
  const storedUserID = req.session.user_id; // saving the cookie session here which is know encrpted
  const templateVars = {
    urls: urlDatabase[id],
    users: users[storedUserID],
  };
  if (!storedUserID) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars); // rendering to the page for style and it can be seen in our templatevars ejs file
  }
});

app.post("/urls/:id/delete", (req, res) => {
  // the delete url, which will delete certain url if need be so, if the id maches
  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect("/urls"); // redirecting to urls once complete
});
app.get("/u/:id", (req, res) => {
  const { id } = req.params;
  const longUrl = urlDatabase[id].longURL;
  if (!longUrl) {
    res.send("The Short URL is not defined");
  } else {
    res.redirect(longUrl);
  }
});
app.get("/urls/:id", (req, res) => {
  const storedUserID = req.session.user_id;

  if (!storedUserID) {
    return res.send("User is not Loged in");
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    users: users[storedUserID],
  };
  const existingURL = urlDatabase[storedUserID].longURL;
  if (templateVars.longURL !== existingURL) {
    return res.send("User does not own that URL");
  } else {
    return res.render("urls_show", templateVars);
  }
});
app.post("/urls/:id", (req, res) => {
  const storedUserID = req.session.user_id;
  if (!storedUserID) {
    res.send("User Cannot shorten the URL");
  } else {
    const { id } = req.params;
    const { newUrl } = req.body;
    //console.log(req.body);
    urlDatabase[id].longURL = newUrl;
    res.redirect("/urls");
  }
});
app.get("/login", (req, res) => {
  // the login in page is know created
  const storedUserID = req.session.user_id; // storing our cookie session
  const templateVars = { users: users[storedUserID] }; //storing items in our object inroder to locate and track them
  if (storedUserID) {
    //checking to if the session exists
    res.redirect("/urls");
  } else {
    res.render("logInForm", templateVars); // renders the page to the log in form if not already registered
  }
});
app.post("/login", (req, res) => {
  // this is the part where the inputs for the login are stored and compared
  const { email, password } = req.body;
  //const userId= req.cookies["user_id"]
  //console.log(userId)
  //const hashedPasswordSaved =users[req.cookies["user_id"]].password

  if (email.length === 0) {
    //checks these edge cases to see if it meets the criteria their are several more edge cases below
    return res.send("400 Status Code");
  }
  if (password.length === 0) {
    return res.send("400 Status Code");
  }
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.send("Staus Code 403. Email cannot be Found");
  }
  /*if (user) {
    if (
        hashedPassword !== getUserByEmail(email).hashedPassword
    ) {
      return res.send("Staus Code 403. Password doesn't match");
    }
  }*/

  //console.log(email);
  //console.log(password)

  const checkingPassword = bcrypt.compareSync(password, user.password); // compares the password to the encription key if true than save the cookie and than redirect to the urls
  console.log(checkingPassword);
  if (checkingPassword) {
    req.session.user_id = id;
    //res.cookie("user_id", id);
    res.redirect("/urls");
  }
  //console.log(req.cookies["name"])
});
app.post("/logout", (req, res) => {
  // the logout form, where it clears the cookies and in this case setting our user_id value to null basically like deleteing it

  req.session.user_id = null;
  res.redirect("/urls");
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  // creating the register and rendering it to the registration page we created
  const storedUserID = req.session.user_id;
  const templateVars = { users: users[storedUserID] };

  //const userVar = req.cookies["id"]
  //console.log("userVar", userVar)
  //console.log(req.cookies["user_id"])
  if (storedUserID) {
    res.redirect("/urls");
  } else {
    res.render("registrationPage", templateVars); // saving the page here
  }
});

app.post("/register", (req, res) => {
  // collecting and storing the information for the registation and as well encrpteding it
  //const id = Math.random().toString(36).substring(2, 8);
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // encrypting it here
  console.log(hashedPassword);
  if (email.length === 0) {
    return res.send("400 Status Code");
  }
  if (hashedPassword.length === 0) {
    return res.send("400 Status Code");
  }
  if (getUserByEmail(email, users)) {
    return res.send("Staus Code 400. Email already exist");
  }
  users[id] = {
    // saving our keys and values in the users object, this is considered our database
    id: id,
    email: email,
    password: hashedPassword,
  };
  req.session.user_id = id;
  //res.cookie("user_id", id);
  //console.log(res.cookie("user_id", id))
  console.log(users);

  res.redirect("/urls"); // after registering we redirect it back to the urls
});

app.listen(PORT, () => {
  // we always need to listen on the port value we assign above
  console.log(`Example app listening on port ${PORT}!`);
});

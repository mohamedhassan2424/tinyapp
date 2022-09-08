const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080

const shortUrl = function generateRandomString(stringSize) {
  let optionalChracters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let inputString = "";
  for (let i = 0; i < stringSize; i++) {
    inputString += optionalChracters.charAt(
      Math.floor(Math.random() * optionalChracters.length)
    );
    console.log(inputString);
  }
  //console.log(inputString)
  return inputString;
};
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
const getUserByEmail = (newEmail) => {
  for (let userId in users) {
    if (users[userId].email.toLowerCase() === newEmail.toLowerCase()) {
      return users[userId];
    }
  }
  return false;
};
 const id = Math.random().toString(36).substring(2, 8);
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello!");
});
const urlsForUser = function (id){
    for(let keys in urlDatabase){
        const value= urlDatabase[keys]
        if(value.userID === id)
        return value.longURL ;
    }
};
app.get("/urls", (req, res) => {
 
    
      if(!req.cookies["user_id"]){
      return res.send("Suggest user to log in or register first")
      } 
        const longUrlOfUserId = urlsForUser(req.cookies["user_id"])
        
        const templateVars = {
            urls: longUrlOfUserId,
            users: users[req.cookies["user_id"]],
          };
     return res.render("urls_index", templateVars);

});
app.post("/urls", (req, res) => {
    //console.log(req.body);
    //console.log(req.params.id
    //console.log(longUrlValue)
    //res.send("Okay Recieved");
    if (!req.cookies["user_id"]) {
      res.send("User Cannot shorten the URL");
    }
    if (req.cookies["user_id"]) {
      //const id = Math.random().toString(36).substring(2, 8);
      const longUrlValue = req.body.longURL;
      urlDatabase[id].longURL = longUrlValue;
      res.redirect(`/urls/${id}`);
    }
  });
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase[id],
    users: users[req.cookies["user_id"]],
  };
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});


app.post("/urls/:id/delete", (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id] ;
  res.redirect("/urls");
});
app.get("/u/:id", (req, res) => {
  const {id} = req.params
  const longUrl = urlDatabase[id].longURL;
    if(!longUrl){
        res.send("The Short URL is not defined")
  }else {
    res.redirect(longUrl);
  }
});
app.get("/urls/:id", (req, res) => {
  
 
  if(!req.cookies["user_id"]){
    return res.send("User is not Loged in")
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    users: users[req.cookies["user_id"]],
  };
  const existingURL= urlDatabase[req.cookies["user_id"]].longURL
  if (templateVars.longURL !== existingURL){
    return res.send("User does not own that URL")
  } else {
   return res.render("urls_show", templateVars) ;
}
});
app.post("/urls/:id", (req, res) => {
  if (!req.cookies["user_id"]) {
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
  const templateVars = { users: users[req.cookies["user_id"]] };
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  } else {
    res.render("logInForm", templateVars);
  }
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email.length === 0) {
    return res.send("400 Status Code");
  }
  if (password.length === 0) {
    return res.send("400 Status Code");
  }
  const user = getUserByEmail(email);
  if (!user) {
    return res.send("Staus Code 403. Email cannot be Found");
  }
  if (user) {
    if (
      password.toLowerCase() !== getUserByEmail(email).password.toLowerCase()
    ) {
      return res.send("Staus Code 403. Password doesn't match");
    }
  }

  //console.log(email);
  //console.log(password)
  res.cookie("user_id", id);
  //console.log(req.cookies["name"]);
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  const templateVars = { users: users[req.cookies["user_id"]] };

  //const userVar = req.cookies["id"]
  //console.log("userVar", userVar)
  //console.log(req.cookies["user_id"])
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  } else {
    res.render("registrationPage", templateVars);
  }
});

app.post("/register", (req, res) => {
  //const id = Math.random().toString(36).substring(2, 8);
  const { email, password } = req.body;
  if (email.length === 0) {
    return res.send("400 Status Code");
  }
  if (password.length === 0) {
    return res.send("400 Status Code");
  }
  if (getUserByEmail(email)) {
    return res.send("Staus Code 400. Email already exist");
  }
  users[id] = {
    id,
    email,
    password,
  };
  res.cookie("user_id", id);
  //console.log(users);
  //console.log(password)

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

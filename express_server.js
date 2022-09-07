const express = require("express");
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8080; // default port 8080

const shortUrl = function generateRandomString(stringSize ){

    let optionalChracters='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let inputString="";
    for(let i=0 ; i < stringSize ; i++){
        inputString += optionalChracters.charAt(Math.floor(Math.random()*optionalChracters.length));
        console.log(inputString)
    }
    //console.log(inputString)
    return inputString;

};
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  

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
    for(let userId in users){
        if(users[userId].email.toLowerCase() === newEmail.toLowerCase()){
        return users[userId];
        }
    }
    return false;
    };
app.use(cookieParser());
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true}));
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls" , (req,res) => {
    const templateVars= {urls : urlDatabase, users : users[req.cookies["user_id"]]};
    res.render("urls_index", templateVars)
});
app.get("/urls/new" , (req,res) => {
    const templateVars= {urls : urlDatabase, users : users[req.cookies["user_id"]]};
    res.render("urls_new",templateVars)
});
app.post("/urls" , (req,res) => {
    const id= Math.random().toString(36).substring(2,8)
    console.log(req.body);
    console.log(req.params.id)
    const longUrlValue  = req.body.longURL
    console.log(longUrlValue);
    
    urlDatabase[id] = longUrlValue;
    //res.send("Okay Recieved");
    res.redirect(`/urls/${id}`)

});

app.get("/urls/:id" , (req,res) => {
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] , users:users[req.cookies["user_id"]] };
    res.render("urls_show",templateVars)
});
app.get("/u/:id", (req, res) => {
    const id = req.params.id
    const longUrl = urlDatabase[id]
    
    res.redirect(longUrl);
  });
app.post("/urls/:id/delete" , (req,res) => {
const { id } = req.params;
delete urlDatabase[id];
res.redirect("/urls")
})
app.post("/urls/:id" , (req,res) => {
    const {id}= req.params
    const {newUrl}= req.body
    console.log(req.body);
    urlDatabase[id] = newUrl;
    res.redirect("/urls");
})
app.get("/login", (req,res) => {
    const templateVars = {users : users[req.cookies["user_id"]]};
    res.render("logInForm", templateVars)
})
app.post("/login" , (req,res) => {
const { email, password}=req.body
if(email.length === 0 ){
    return res.send("400 Status Code")
};
if(password.length ===0 ){
    return res.send("400 Status Code")
};
const user = getUserByEmail(email)
if(!user){
    return res.send("Staus Code 403. Email cannot be Found");
}
if(user){
    if(password.toLowerCase() !== getUserByEmail(email).password.toLowerCase()){
        return res.send("Staus Code 403. Password doesn't match")
    }
}

console.log(email);
console.log(password)
res.cookie("user_id", user.id);
console.log(req.cookies["name"]);
res.redirect("/urls")
})
app.post("/logout", (req,res) =>{
    
    res.clearCookie("user_id");
    res.redirect("/urls");
})
app.get("/hello", (req,res) => {
res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json",(req,res)=>{
    res.json(urlDatabase)
});

app.get("/register", (req,res)=>{
    const templateVars = {users : users[req.cookies["user_id"]]};
    res.render("registrationPage", templateVars)
});

app.post("/register", (req,res) => {
    const user_id= Math.random().toString(36).substring(2,8)
    const {email, password} = req.body;
    if(email.length === 0 ){
        return res.send("400 Status Code")
    };
    if(password.length ===0 ){
        return res.send("400 Status Code")
    };
    if(getUserByEmail(email)){
        return res.send("Staus Code 400. Email already exist");
    }
    users[user_id]={
        id: user_id,
        email,
        password,
    }
    res.cookie("user_id", user_id);
    console.log(users);
    //console.log(password)
    console.log()
    res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
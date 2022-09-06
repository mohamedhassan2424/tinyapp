const express = require("express");
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

app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true}));
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls" , (req,res) => {
    const templateVars= {urls : urlDatabase};
    res.render("urls_index", templateVars)
});
app.get("/urls/new" , (req,res) => {
    res.render("urls_new")

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
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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
app.get("/hello", (req,res) => {
res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json",(req,res)=>{
    res.json(urlDatabase)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
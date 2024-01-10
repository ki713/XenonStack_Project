if(process.env.NODE_ENV != "production")
{
    require("dotenv").config()
}

//importing Libraries that we installed using npm
const express = require("express");
const path = require("path")
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport")
const intializePassport = require("./passport-config");
const flash = require("express-flash")
const session = require("express-session")
const methodoverride = require("method-override");
const collection = require("./mongodb");
intializePassport(
    passport,
    email=>users.find(user=>user.email === email),
    id => users.find(user => (user.id === id))
)

const users = []

app.use(express.urlencoded({extended:false}))

app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

//const templatePath = path.join(__dirname,'../')

app.use(passport.initialize())
app.use(passport.session())
app.use(methodoverride("_method"))
app.use(express.json())
//app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))


//configuring the register post functionality
app.post("/login",checkNotAuthenticated,passport.authenticate("local",{
    
    successRedirect:"/",
    failureRedirect:"/register",
    failureFlash:true
}))

// app.post("/login",async(req,res) =>{
//     res.redirect("/");
//     // try{
//     //     const check = await collection.findOne({name:req.body.name})

//     //     if(check)
//     //     {
//     //         res.render("/")
//     //     }
//     //     else{
//     //         res.send("wrong password")
//     //     }
//     // }

//     // catch{
//     //     res.send("wrong details")
//     // }
// })
app.post("/register",checkNotAuthenticated,async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
       users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
        })
         console.log(users); //display newly registered in the form
       await collection.insertMany([users])
         res.redirect("/login")

    }
    catch(e){
      console.log(e);
      res.redirect("/register")
    }
})

//Routes
app.get('/',checkAuthenticated,(req,res)=>{
    res.render("index.ejs",{name:req.user.name})
})

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render("login.ejs")
})

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render("register.ejs")
})
//End Routes

app.delete("logout",(req,res) => {
    req.logout();
    res.redirect("/login")
})

app.delete("/logout",(req,res) => {
    req.logout(req.user,err => {
        if(err) return next(err)
        res.redirect("/")
    })
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        res.redirect("/login") 
    }
    next();
} 

app.listen(3000,() =>{
    console.log("Server is running on port 3000")
})
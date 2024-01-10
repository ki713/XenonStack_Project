const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://Kiranpreet:kiran13@cluster0.wzcakcy.mongodb.net/")
.then(()=>{
    console.log("mongodb connected");
})
.catch(() =>{
    console.log("failed to connect");
})

const LogInSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        //unique:true
    },
    password:{
        type:String,
        required:true
    }

})

const collection = new mongoose.model("Collection1",LogInSchema)

module.exports = collection
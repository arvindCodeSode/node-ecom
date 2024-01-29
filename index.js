const express = require("express");
require('./db/config');
const User = require("./db/User");
const cors = require("cors");
const app =  express();

app.use(express.json());
app.use(cors());

app.get('/get',  (req, res) =>{
    res.send('app is working');
});

app.post('/register', async (req, res) =>{
    let user = new User(req.body);
    let data = await user.save();
    data = data.toObject();
    delete data.password;
    res.send(JSON.stringify(data));
});
app.post("/login", async (req,res) =>{
    if(req.body.email && req.body.password){
        let result = await User.findOne(req.body).select("-password");
        console.log(result);
        if(result){
            res.send(result);
        }else{
        res.send(JSON.stringify({status:"Invalid email and password"}));

        }
    }else{
        res.send(JSON.stringify({status:"Email And Passwor required"}));
    }
});


app.listen(4500);

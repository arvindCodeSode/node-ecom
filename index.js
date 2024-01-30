const express = require("express");
require('./db/config');
const User = require("./db/User");
const Product = require("./db/Product");
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

app.post("/product", async (req, res ) =>{
    let product = new Product(req.body);
    product = await product.save();
    res.send(JSON.stringify(product));
});
app.get("/product", async (req,resp) =>{
    let product = await Product.find();
    if(product){
        resp.send(JSON.stringify(product));
    }else{
        resp.send(JSON.stringify({status:'Data Not Found'}));
    }
});
app.get("/product/:id", async(req,resp)=>{
    if(req.params.id){
        let product = await Product.findOne({_id:req.params.id});
        if(product){
            resp.send(product);
        }else{
        resp.send({status:"Invalid Product Id"});

        }
    }else{
        resp.send({status:"Invalid Product Id"});

    }
});
app.put("/product/:id", async (req, res ) =>{
    // res.send('worming');
    if(req.params.id){
        let product =await Product.updateOne(
            { _id:req.params.id },
        
            {
                $set:req.body
            })
            if(product){
                res.send(product);
            }else{
                res.send(JSON.stringify({status:"Invalid"}));
            }
    }else{
        res.send(JSON.stringify({status:"Invalid details"}));
    }
});

app.delete("/product/:id", async (req,resp ) =>{
    if(req.params.id){
        let product = await Product.deleteOne({_id:req.params.id});
        if(product){
            resp.send(product);
        }
        // resp.send(JSON.stringify({id:req.params.id}));
    }else{
        resp.send({status:"Invalid Product Id"});
    }    
})


app.listen(4500);

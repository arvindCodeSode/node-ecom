const express = require("express");
require('./db/config');
const User = require("./db/User");
const Product = require("./db/Product");
const cors = require("cors");
const app =  express();
const JWT = require("jsonwebtoken");
const JWTkey = 'e-comm';

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
    JWT.sign({data}, JWTkey, (err,token)=>{
        if(err){
            res.send({status:'Something went wrong, Please try again'})
        }else{
            res.send({user:data,auth:token});
        }
    });
    // res.send(JSON.stringify(data));
});
app.post("/login", async (req,res) =>{
    // console.lo(req.body.email);
    if(req.body.email && req.body.password){
        let result = await User.findOne(req.body).select("-password");
        console.log(result);
        if(result){
            JWT.sign({result}, JWTkey,{expiresIn:"2h"}, (err,token)=>{
                if(err){
                    res.send({status:'Something went wrong, Please try again'})
                }else{
                    res.send({user:result,auth:token});
                }
            });
        }else{
        res.send(JSON.stringify({status:"Invalid email and password"}));

        }
    }else{
        res.send(JSON.stringify({status:"Email And Passwor required",body:req.body}));
    }
});

app.post("/product", async (req, res ) =>{
    let product = new Product(req.body);
    product = await product.save();
    res.send(JSON.stringify(product));
});
app.get("/product",verifyToken, async (req,resp) =>{
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
app.get("/search/:key", async (req, rep) =>{
    let product = await Product.find({
        "$or":[
            { productTitle: { $regex:req.params.key } },
            { category: { $regex:req.params.key } },
            { companyName: { $regex:req.params.key } },
        ]
    });
    rep.send(product);
})

function verifyToken(req,res,next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(" ")[1];
        if(token){
            JWT.verify(token,JWTkey,(err,valid)  =>{
                if(err){
                    res.send({status:"Invalid JWT token1"});
                }else{
                    next();
                }
            })
        }else{
            res.send({status:"Invalid JWT token"});

        }
    }else{
        res.send({status:"Please provide token"});
    }
}

app.listen(4500);

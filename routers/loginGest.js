const express = require("express");
require("dotenv").config();
const db=require("mssql/msnodesqlv8")
const cors = require('cors');
const { DateTime } = require("mssql/msnodesqlv8");
const app = express();
const dbu=require("../services/services");
var jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { compareSync, genSaltSync, hashSync, genSalt, hash, compare } = require("bcrypt");
const router=express.Router();
app.use(cors());
var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

 router.post('/register', async(req, res) =>{
    //const [name,email,phone,address]=req.body
    console.log("je suis la");
    
    try{
        const {user_name,role,email,password}=req.body;
        if (!user_name || !email || !password ||!role) {
            console.log("end point===========================")
            return res.sendStatus(400);

         }
         console.log("end point----------------------")
         //const salt = genSaltSync(10);
         genSalt(10, async function(err, salt) {
            if(err){
                console.log(err);
            }else{
                hash(password, salt, async function(err, hash) {
                    // Store hash in your password DB.
                    if(err){
                        console.log(err);
                    }else{
                        const user=await dbu.addUser(user_name,role,email,hash);
         
         user.password=undefined;
         console.log(user);
         const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
         res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
  
         res.json({token: jsontoken});
                    }
                });
            }
            
        });
         
         //password = hashSync(password, salt);
        
         
    }catch(err){
        res.send(err)
        //res.sendStatus(400);
    }
    
    });
router.get('/userEmail',async(req,res)=>{
    const email=req.body.email;
    try{
        const result=await dbu.getUserByImail(email);
        res.send(result);
    }catch(err){
        res.sendStatus(400);
    }
})
router.post('/login',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    try{
        const user=await dbu.getUserByImail(email);
        if(!user){
            return res.json({
                message: "Invalid email or password11"
            })
        }
        const isValidPassword=compare(password, user.password, function(err, result){
            if(result){
                user.password = undefined;
                const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
                res.cookie('token', jsontoken, { httpOnly: true, secure: false, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
         
                res.json({token: jsontoken});
               //return res.redirect('/mainpage') ;
         
            }  else{
                return res.json({
                    message: "Invalid email or password"
                });
            } 
        });
        console.log(isValidPassword)
        
        
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
})
router.get('/',verifyToken,async(req,res)=>{
    try{
        const result=await dbu.getusers();
        res.send(result);
    }catch(err){
        res.sendStatus(400);
    }
    

})
async function  verifyToken  (req, res, next){
    console.log(req.cookies);
    const token=req.cookies.token;
     console.log(token);
      
     if(token === undefined  ){
          
             return res.json({
                 message: "Access Denied! Unauthorized User"
               });
     } else{
  
         jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, authData)=>{
             if(err){
                 res.json({
                     message: "Invalid Token..."
                   });
  
             } else{
                 
                 
                const role = authData.user.role;
                if(role === "admin"){
  
                 next();
                } else{
                    return res.json({
                        message: "Access Denied! you are not an Admin"
                      });
  
                }
             }
         })
     } 
 }
    // request.query("CREATE TABLE Users (" +
    // "id int NOT NULL IDENTITY(1, 1)," +
    // "user_name varchar(255) NOT NULL," +
    // "role varchar(255) default 'employee'," +
    // "email varchar(255) NOT NULL," +
    // "password varchar(255) NOT NULL," +
    // "PRIMARY KEY (id),"+
    // "UNIQUE (email)," +
    // "UNIQUE (password))",function(err,recordset){
    //     if(err){
    //         console.log(err);
    //         res.send(err.message);
    //     }else{
            
    //         res.send(recordset);

    //     }
    // });
   

 module.exports=router
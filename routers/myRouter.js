const express = require("express");
const qrcode=require("qrcode");
require("dotenv").config();
const db=require("mssql/msnodesqlv8")
const cors = require('cors');
const { DateTime } = require("mssql/msnodesqlv8");
const app = express();
const router=express.Router();
app.use(cors());
var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  router.get('/gernerateCodeqr',cors(corsOptions), function (req, res) {
    let json=JSON.stringify({'nom':'youssou cisse','email':'youphacisse@gmail.com','site':'you.com'});
    qrcode.toDataURL("http://example.com?nom=youssou&email=you@gmail.com", function (err, url) {
        console.log(url)
        res.send(url);
      })
  });
router.get('/',cors(corsOptions), function (req, res) {
    var request=new db.Request();
    request.query("select * from clients",function(err,recordset){
        if(err){
            console.log(err);
            res.send(err.message);
        }else{
            //console.log(recordset.recordsets);
            res.send(recordset.recordsets[0]);

        }
    });
   
 })
 router.post('/', function (req, res) {
    //const [name,email,phone,address]=req.body
    console.log("je suis la");
    const {nom,email,phone,address}=req.body;
    console.log(req.body);
    var normalizedDate = new Date(Date.now()).toISOString();
    var request=new db.Request();
    request.query("insert into clients values ('"+nom+"','"+email+"','"+phone+"','"+address+"','"+normalizedDate+"')",function(err,recordset){
        if(err){
            console.log(err);
            res.send(err.message);
        }else{
            
            res.send(recordset);

        }
    });
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
   
 })
 module.exports=router
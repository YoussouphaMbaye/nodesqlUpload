const db=require("mssql/msnodesqlv8")
const express = require('express');
const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require('cors')
const app = express();
const config=require('./config');
const cliensts=require('./routers/myRouter');
const usersR=require('./routers/loginGest');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// parse request data content type application/x-www-form-rulencoded
app.get("/fileUpload", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.use(bodyParser.urlencoded({extended: false}));

// parse request data content type application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use('/clients',cliensts);
app.use('/users',usersR);
app.post('/upload',
    fileUpload({ createParentPath: true }),
                filesPayloadExists,
                fileExtLimiter(['.png', '.jpg', '.jpeg']),
                fileSizeLimiter,
                (req,res)=>{
                    console.log(req.files)
                    const files=req.files;
                    Object.keys(files).forEach(key => {
                        const filepath = path.join(__dirname, 'files', files[key].name)
                        files[key].mv(filepath, (err) => {
                            if (err) return res.status(500).json({ status: "error", message: err })
                        })
                        return res.json({ status: 'success', message: Object.keys(files).toString() })
                    })
                }
                )
 app.listen(3200, function () {
    
    // var host = config.server.address().address
    // var port = server.address().port
    console.log("Example app listening at http://localhost:3200", );
    db.connect(config,function(err){
        if(err){
            console.log(err);
        }else{
            console.log('serveur connecter');
            //console.log(app._router.stack);
        }
        
    })
    
    
 })
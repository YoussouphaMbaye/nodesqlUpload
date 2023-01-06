const res = require("express/lib/response");
const db=require("mssql/msnodesqlv8");
const dbu={};
dbu.getusers=()=>{
    var request=new db.Request();
    
    return new Promise((resolve, reject)=>{ 
    request.query("select * from users",function(err,recordset){
        if(err){
            console.log(err);
            return reject(err.message);
        }else{
            console.log(recordset.recordsets[0]);
            return resolve(recordset.recordsets[0]);

        }
        
    });
});
    
}
dbu.getUserByImail=(email)=>{
    console.log(email);
    var request=new db.Request();
    return new Promise((resolve, reject)=>{ 
    request.query("select * from users where email='"+email+"'",function(err,recordset){
        if(err){
            console.log(err);
            return reject(err.message);
        }else{
            //console.log(recordset.recordsets);
            return resolve(recordset.recordsets[0][0]);

        }
    });
});

}
dbu.addUser=(user_name,role,email,password)=>{
    console.log("add add");
    var request=new db.Request();
    return new Promise((resolve, reject)=>{ 
    request.query("insert into users values('"+user_name+"','"+role+"','"+email+"','"+password+"');SELECT SCOPE_IDENTITY() AS id;",function(err,recordset){
        if(err){
            console.log(err);
            //res.send(err);
            return reject(err);
        }else{
            //console.log(recordset.recordsets);
            //return resolve(recordset);
            request.query("select * from users where id="+recordset.recordset[0].id+"",function(err,recordset){
                if(err){
                    console.log(err);
                    return reject(err.message);
                }else{
                    //console.log(recordset.recordsets);
                    return resolve(recordset.recordsets[0][0]);
        
                }});

        }
    });
});

}
module.exports=dbu
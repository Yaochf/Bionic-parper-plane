const express = require("express");
const router = express.Router();//引入路由
const {db,genid} = require("../db/DbUtils"); 

// router.get("/test", async function(req,res){
//     db.all("select * from `admin`",[],(err,rows)=>{
//         console.log(rows)
//     })
//     let out = await db.async.all("select * from `admin`",[])
//     res.send({
//         id:genid.NextId(),
//         out
//     });


// })

module.exports = router;
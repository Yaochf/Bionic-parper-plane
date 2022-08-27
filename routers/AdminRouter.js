const express = require("express");
const router = express.Router();//引入路由
const {db,genid} = require("../db/DbUtils"); 
const {v4:uuidv4} = require("uuid")
const {query} = require("../db/blogMysql");
// router.post("/login",async (req,res)=>{
//     let{account,password} = req.body;
//     let {err,rows} = await db.async.all("select * from `admin` where `account` = ? AND `password` = ?",[account,password]);
//     if(err == null && rows.length >0){
//         //传入生成的独一无二的token
//         let login_token = uuidv4();
//         let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"
//         await db.async.run(update_token_sql,[login_token,rows[0].id]);
        
//         let admin_info = rows[0]
//         admin_info.token = login_token;
//         admin_info.password = "";
//         res.send({
//             code:200,
//             msg:"登陆成功",
//             data:admin_info
//         })
//     }else{
//         res.send({
//             code:500,
//             msg:"登陆失败"
//         })
//     }
// })

router.post("/login",async (req,res)=>{
    let{account,password} = req.body;
    let {err,rows} = await query("select * from `admin` where `account` = ? AND `password` = ?",[account,password]);
    if(err == null && rows.length >0){
        //传入生成的独一无二的token
        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"
        await query(update_token_sql,[login_token,rows[0].id]);
        let {err,rows1} = await query("select * from `admin` where `id` = ?",[rows[0].id]);
        console.log(rows1)
        let admin_info = rows[0]
        admin_info.token = login_token;
        admin_info.password = "";
        res.send({
            code:200,
            msg:"登陆成功",
            data:admin_info
        })
    }else{
        res.send({
            code:500,
            msg:"登陆失败"
        })
    }
})

module.exports = router;
const express = require("express");
const router = express.Router();//引入路由
const {db,genid} = require("../db/DbUtils"); 
const {query} = require("../db/blogMysql");
//列表接口
router.get("/list", async function(req,res){
    const search_seq = "SELECT * FROM `category`";
    //let {err,rows} = await db.async.all(search_seq,[]);
    let {err,rows} = await query(search_seq,[]);
    if(err == null){ 
        res.send({
            code:200,
            msg:"查询成功",
            rows
        })
    }else{
        res.send({
            code:500,
            msg:"查询失败"
        })
    }
})
//删除接口
router.delete("/_token/delete", async function(req,res){
    let id = req.query.id;// /category/delete?id=xxx
    const delete_seq = "DELETE FROM `category` WHERE `id` = ?";
    // let {err,rows} = await db.async.run(delete_seq,[id]);
    let {err,rows} = await query(delete_seq,[id]);
    if(err == null){ 
        res.send({
            code:200,
            msg:"删除成功"
        })
    }else{
        res.send({
            code:500,
            msg:"删除失败"
        })
    }
})
//修改接口
router.put("/_token/update", async function(req,res){
    let {id,name} = req.body;
    const update_seq = "UPDATE `category` SET `name` = ? WHERE `id` = ?";
    // let {err,rows} = await db.async.run(update_seq,[name,id]);
    let {err,rows} = await query(update_seq,[name,id]);
    if(err == null){ 
        res.send({
            code:200,
            msg:"修改成功"
        })
    }else{
        res.send({
            code:500,
            msg:"修改失败"
        })
    }
})
//添加接口
router.post("/_token/add", async function(req,res){
    let {name} = req.body;
    const insert_seq = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)";
    // let {err,rows} = await db.async.run(insert_seq,[genid.NextId(),name]);
    let {err,rows} = await query(insert_seq,[genid.NextId(),name]);
    if(err == null){
        res.send({
            code:200,
            msg:"添加成功"
        })
    }else{
        res.send({
            code:500,
            msg:"添加失败"
        })
    }
})


module.exports = router
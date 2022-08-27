const express = require("express");
const router = express.Router();//引入路由
const {db,genid} = require("../db/DbUtils"); 
const {query} = require("../db/blogMysql");
//查询单篇
router.get('/detail', async function(req, res){
    let {id} = req.query;
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ?";
    // let {err,rows} = await db.async.all(detail_sql,[id]);
    let {err,rows} = await query(detail_sql,[id]);
    if(err == null){
        res.send({
            code:200,
            msg:"获取成功",
            rows
        })
    }else{
        res.send({
            code:500,
            msg:"获取失败"
        })
    }
})

//查询博客
router.get("/search", async function(req,res){
    let{keyword,categoryId,page,pageSize} = req.query;
    page  = page  == null? 1 :page;
    pageSize = pageSize == null ? 10 : Number(pageSize);
    categoryId = categoryId == null ? 0 : categoryId;
    keyword = keyword == null ? "" : keyword; 
    let parmers = []
    let whereSqls = []
    if (categoryId != 0){
        whereSqls.push("`category_id` = ?")
        parmers.push(categoryId)
    }
    if(keyword!=""){
        whereSqls.push("(`title` LIKE ? OR `content` LIKE ?)")
        parmers.push("%"+keyword+"%")
        parmers.push("%"+keyword+"%")
    }
    let whereSqlStr = ""
    if(whereSqls.length>0){
        whereSqlStr = "WHERE "+whereSqls.join(" AND ")
    }
    //查询分页数据
    // let searchSql = "SELECT `id`, `title`,`create_time`, SUBSTR(`content`,0,200) AS`content` FROM `blog` "+whereSqlStr+"ORDER BY `create_time` DESC LIMIT ?,? "
    let searchSql = "SELECT `id`, `title`,`create_time`, substr(`content`,1,100) AS `content` FROM `blog` "+whereSqlStr+"ORDER BY `create_time` DESC LIMIT ?,? "
    let searchSqlParmers = parmers.concat([(page-1)*pageSize,pageSize])
    //查询数据总数
    let searchCountSql = "SELECT count(*) FROM `blog` "+whereSqlStr;
    let searchCountParmers = parmers
    //分页数据
    // let searchResult = await db.async.all(searchSql,searchSqlParmers)
    // let countResult = await db.async.all(searchCountSql,searchCountParmers)
    let searchResult = await query(searchSql,searchSqlParmers)
    let countResult = await query(searchCountSql,searchCountParmers)
    
    if(searchResult.err == null && countResult.err == null){ 
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,
                categoryId,
                page,
                pageSize,
                rows:searchResult.rows,
                count:countResult.rows[0]['count(*)']//或修改SELECT count(*) FROM改为SELECT count(*) AS `count` FROM
            }
        })
    }else{
        res.send({
            code:500,
            msg:"查询失败"
        })
    }
})
//删除博客
router.delete("/_token/delete", async function(req,res){
    let id = req.query.id;// /delete?id=xxx
    const delete_seq = "DELETE FROM `blog` WHERE `id` = ?";
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
//修改博客
router.put("/_token/update", async function(req,res){
    let {id,title,categoryId,content} = req.body;
    const update_seq = "UPDATE `blog` SET `title`= ?,`content` = ?,`category_id` = ? WHERE `id` = ?";
    let params = [title,content,categoryId,id];
    // let {err,rows} = await db.async.run(update_seq,params);
    let {err,rows} = await query(update_seq,params);
    if(err == null){
        res.send({
            code:200,
            msg:"修改成功",
        })
    }else{
        res.send({
            code:500,
            msg:"修改失败"
        })
    }
})
//添加博客
router.post("/_token/add", async function(req,res){
    let {title,categoryId,content} = req.body;
    let id = genid.NextId()
    let create_time = new Date().getTime();
    const insert_seq = "INSERT INTO `blog` (`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)";
    let parmers = [id,title,categoryId,content,create_time]
    // let {err,rows} = await db.async.run(insert_seq,parmers);
    let {err,rows} = await query(insert_seq,parmers);
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

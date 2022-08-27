//jshint esversion:6
const express = require("express");
const app = express();
const multer = require("multer");//node.js 处理的中间件，主要用于上传文件
const path = require("path")
const {db,genid} = require("./db/DbUtils"); 
const {query} = require("./db/blogMysql");
const port = process.env.PORT || 3000;
//跨域请求开放
app.use(function(req,res,next){
    //设置允许跨域的域名，*代表任意域名
    res.header("Access-control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-control-Allow-Headers","*")
    //跨域允许的请求方式
    res.header("Access-control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if(req.method == "OPTIONS") res.sendStatus(200);//让options尝试请求快速结束
    else next();
});

app.use(express.json())
const update = multer({
    dest:"./public/upload/temp"
})
app.use(update.any());//允许所有接口上传
app.use(express.static(path.join(__dirname,"public")))//指定静态资源路径

const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req,res,next)=>{
    if(req.path.indexOf(ADMIN_TOKEN_PATH)>-1){
        let {token} = req.headers;
        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        // let adminResult = await db.async.all(admin_token_sql,[token])
        let adminResult = await query(admin_token_sql,[token])
        if(adminResult.err!=null || adminResult.rows.length == 0){
            res.send({
                code:403,
                msg:"请先登录"
            })
            return
        }else{
            next();
        }
    }else{
        next();
    }

})
app.use("/test",require("./routers/TextRouter"));
app.use("/admin",require("./routers/AdminRouter"));
app.use("/category",require("./routers/CategoryRouter"));
app.use("/blog",require("./routers/BlogRouter"));
app.use("/upload",require("./routers/UploadRouter"));
app.get("/",function(req,res){
res.send("hhh")
})
app.listen(port,function(){
    console.log("server started on port 3000");
})
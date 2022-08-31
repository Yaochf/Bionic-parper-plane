<template>
    <div class="main-panel">
        <div class="menus">
            <div @click="toHomePage"><img class="logo" src="../../common/bionicParper.jpg"></div>
            <div  v-for="(menu,index) in menus" @click="toPage(menu)">
                {{menu.name}}
            </div>
        </div>
        <div style="padding:20px; width:80%; position: absolute; right:0;left: 17%;" >
            <router-view></router-view>
        </div>
    </div>
    <div class="title">后台管理系统</div>
</template>

<script setup>
import {ref,reactive,inject} from "vue"
import {AdminStore} from "../../stores/AdminStore"
import {useRouter,useRoute} from "vue-router"

const axios = inject("axios")//获取axios
const message = inject("message")
const adminStore = AdminStore()
const router = useRouter()
const route = useRoute()

let menus = [
    {name: "文章管理",href: "/dashboard/article"},
    {name: "分类管理",href: "/dashboard/category"},
    {name: "退出",href: "logout"},

]
const toPage = (menu) => {
    if(menu.href == "logout"){
        router.push("/login")
    }else{
        router.push(menu.href)
    }
}
const toHomePage = ()=>{
    router.push("/")
}
</script>
<style lang = "scss" scoped>
.logo{
    position: fixed;
    width: 5rem;
    height: 5rem;
    top:0;
    left: 1%;
}
.main-panel{
    display: flex;
    color: #63676a;
    max-width: 1500px;
    margin: 0 auto;
}
.menus{
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    position: fixed;
    left: 0;
    top: 10%;
    width: 17%;
    height: 95vh;
    border-right: 1px solid #dadada;
    div{
        cursor: pointer;
        &:hover{
            color: #fd760e;
        }
    }
    z-index: 1;
}
.title{
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0,0,0,20%);
    right: calc((120vw - 1500px)/2);
    bottom: 20px;
}
</style>
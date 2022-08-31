<template>
  <div class="container">
    <div class="title">
        <div @click="homePage"><img class="logo" src="../common/bionicParper.jpg"></div>
        <div class="nav">
        <div @click="homePage">首页</div>
        <n-popselect @update:value="searchByCategory" v-model:value="selectCategory" :options="categoryOptions" trigger="click">
         <div>分类<span>{{categoryName}}</span></div>
        </n-popselect>
        <div @click="dashboard">登录</div>
        </div>
    </div>
    <n-divider/>
    <n-space class="search">
        <n-input v-model:value="pageInfo.keyword" :style="{width:'500px'}" placeholder="请输入关键词" />
        <n-button type="primary" ghost @click="loadBlogs()"> 搜索 </n-button>
    </n-space>
        <div v-for="(blog,index) in blogListInfo" style="margin-bottom: 10px;cursor: pointer">
          <n-card :title="blog.title" @click="toDetail(blog)">
            {{blog.content}}
            <template #footer>
              <n-space align="center">
                <div>发布时间：{{blog.create_time}}</div>
              </n-space>
            </template>
          </n-card>
        </div>
        <n-space >
          <!-- <div @click="toPage((pageInfo.page-1)==0?1:(pageInfo.page-1))">
            <div style="cursor: pointer">上一页</div>
          </div> -->
          <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
            <div style="cursor: pointer; margin:auto 4px;" :style="'color:'+(pageNum == pageInfo.page?'red':'')">{{pageNum}}</div>
          </div>
          <!-- <div @click="toPage((pageInfo.page+1)>pageInfo.pageCount?(pageInfo.page):(pageInfo.page+1))">
            <div style="cursor: pointer">下一页</div>
          </div> -->
         </n-space>
        <!-- <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" /> -->
    <n-divider/>
    <div class="footer">
        <div>Power by XXXX</div>
        <div>XICP备XXXX号-1</div>
    </div>
  </div>
 
</template>

<script setup>
import {ref,reactive,inject,onMounted} from "vue"
import {useRouter,useRoute} from "vue-router"
import { computed } from "@vue/reactivity";

const axios = inject("axios")//获取axios
const message = inject("message")
const dialog = inject("dialog")
const router = useRouter()
const route = useRoute()

const selectCategory = ref(0)
const categoryOptions= ref([])
const blogListInfo = ref([])
onMounted(()=>{
    loadCategorys();
    loadBlogs();
})
const pageInfo = reactive({
  page: 1,
  pageSize:5,
  pageCount:0,
  count:0,
  keyword:"",
  categoryId:0
})
const categoryName = computed(()=>{
    let selectedOption = categoryOptions.value.find((option)=>{return option.value == selectCategory.value})//寻找符合条件的对象返回
    return selectedOption ? selectedOption.label : ""
})
const loadCategorys = async ()=>{
  let res = await axios.get("/category/list")
  categoryOptions.value = res.data.rows.map((item)=>{
    return {
      label: item.name,
      value: item.id
    }
  })
}
const homePage = ()=>{
    router.push("/")
}
const dashboard = ()=>{
    router.push("/login")
}
  // const loadBlogs = async(page=0)=>{
  //   if(page !== 0){
  //       pageInfo.page = page;
  //   }
const toPage = async (pageNum)=>{
  pageInfo.page = pageNum;
  loadBlogs()
}
  const loadBlogs = async()=>{
  let res = await axios.get(`/blog/search/?keyword=${pageInfo.keyword}&categoryId=${pageInfo.categoryId}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  let temp_rows = res.data.data.rows;
  const removeHTML = (description)=>{
    description = description.replace(/(\n)/g, "");
    description = description.replace(/(\t)/g, "");
    description = description.replace(/(\r)/g, "");
    description = description.replace(/<\/?[^>]*>/g, "");
    description = description.replace(/\s*/g, "");
    return description;
    }
    
  for(let row of temp_rows){
    let short_content = removeHTML(row.content);
    row.content = short_content + "..."
    // row.content += "..."
    let d = new Date(row.create_time)
    row.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
  }
  blogListInfo.value = temp_rows;
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount = parseInt(pageInfo.count/pageInfo.pageSize) + (pageInfo.count%pageInfo.pageSize > 0 ? 1: 0); 
}
const toDetail = (blog)=>{
    router.push({path:'/detail',query:{id:blog.id}})
}
const searchByCategory = (categoryId)=>{
    pageInfo.categoryId = categoryId;
    loadBlogs()
}
</script>
<style lang = "scss" scoped>
.logo{
    width: 5rem;
    height: 5rem;
    top:0;
    left: 1%;
}
.container {
    width: 1200px;
    margin: 0 auto;
}
.nav{
    left: 15%;
    display: flex;
    font-size: 20px;
    padding-top: 25px;
    margin-left: 30px;
    color: #64676a;
    div{
        cursor: pointer;
        margin-right: 15px;
        &:hover{
            color:#fd0;
        }
        span{
            font-size: 12px;
            margin-left: 3px;
        }
    }
}
.title{
    display: flex;
}
.footer{
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
.search{
    margin-bottom: 15px;
}
</style>
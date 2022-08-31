<template>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        <n-tab-pane name="list" tab="文章列表">
         <div v-for="(blog,index) in blogListInfo" style="margin-bottom: 10px">
          <n-card :title="blog.title" >
            {{blog.content}}
            <template #footer>
              <n-space align="center">
                <div>发布时间：{{blog.create_time}}</div>
                <n-button @click="toUpdate(blog)">修改</n-button>
                <n-button @click="toDelete(blog)">删除</n-button>
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
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
          <n-form-item path = "age" label="标题">
            <n-input v-model:value="addArtical.title" placeholder="请输入标题" />
            </n-form-item>
          <n-form-item path = "age"  label="分类">
            <n-select v-model:value="addArtical.categoryId" :options="categoryOptions" placeholder="请选择分类" />
          </n-form-item>
          <n-form-item path = "age"  label="内容">
            <rich-text-editor v-model="addArtical.content"></rich-text-editor>
          </n-form-item>
          {{addArtical.content}}
           <n-form-item path = "age"  label="">
            <n-button @click="add">提交</n-button>
          </n-form-item>
          
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改">
          <n-form-item path = "age" label="标题">
              <n-input v-model:value="updateArtical.title" placeholder="请输入标题" />
              </n-form-item>
            <n-form-item path = "age"  label="分类">
              <n-select v-model:value="updateArtical.categoryId" :options="categoryOptions" placeholder="请选择分类" />
            </n-form-item>
            <n-form-item path = "age"  label="内容">
              <rich-text-editor v-model="updateArtical.content"></rich-text-editor>
            </n-form-item>
            <n-form-item path = "age"  label="">
              <n-button @click="update">提交</n-button>
            </n-form-item>
         </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import {ref,reactive,inject,onMounted} from "vue"
import {AdminStore} from "../../stores/AdminStore"
import {useRouter,useRoute} from "vue-router"
import RichTextEditor from "../../components/RichTextEditor.vue"


const axios = inject("axios")//获取axios
const message = inject("message")
const dialog = inject("dialog")
const adminStore = AdminStore()
const router = useRouter()
const route = useRoute()

const addArtical = reactive({
  title: "",
  content:"",
  // categoryId:0,
})
const updateArtical = reactive({
  id:0,
  title: "",
  content:"",
  // categoryId:0,
})

const pageInfo = reactive({
  page: 1,
  pageSize: 5,
  pageCount:0,
  count:0
})
const categoryOptions = ref([])
const blogListInfo = ref([])
const tabValue = ref("list")
onMounted (()=>{
  loadBlogs()
  loadCategorys()
})
const loadBlogs = async()=>{
  let res = await axios.get(`/blog/search/?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
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
const loadCategorys = async ()=>{
  let res = await axios.get("/category/list")
  categoryOptions.value = res.data.rows.map((item)=>{
    return {
      label: item.name,
      value: item.id
    }
  })
}

const add = async ()=>{
  let res = await axios.post("/blog/_token/add",addArtical)
    if (res.data.code == 200) {
        message.info(res.data.msg);
        addArtical.title= "";
        addArtical.content="";
        addArtical.categoryId=null;
        loadBlogs()
        tabValue.value = "list"
    }else{
        message.error(res.data.msg)
    }
};
const toPage = async (pageNum)=>{
  pageInfo.page = pageNum;
  loadBlogs()
}
const toUpdate = async (blog)=>{
  tabValue.value = "update"
  let res = await axios.get(`/blog/detail?id=${blog.id}`)
  updateArtical.id = blog.id;
  updateArtical.title = res.data.rows[0].title;
  updateArtical.content = res.data.rows[0].content;
  updateArtical.categoryId = res.data.rows[0].category_id;
}
const update = async()=>{
  let res = await axios.put("/blog/_token/update",updateArtical)
    if (res.data.code == 200) {
        message.info(res.data.msg);
        updateArtical.id = null;
        updateArtical.title = "";
        updateArtical.content = "";
        updateArtical.categoryId = null;
        loadBlogs()
        tabValue.value = "list"
    }else{
        message.error(res.data.msg)
    }
}
const toDelete = async (blog)=>{
  dialog.warning({
          title: '警告',
          content: '是否确定删除？',
          positiveText: '确定',
          negativeText: '取消', 
          onPositiveClick: async () => {
            let res = await axios.delete(`/blog/_token/delete?id=${blog.id}`)
                if(res.data.code == 200) {
                    loadBlogs()
                    message.info(res.data.msg)
                }else{
                    message.error(res.data.msg)
                } 
          },
          onNegativeClick: () => {
          }
    })
}
</script>
<style lang = "scss" scoped>
</style>
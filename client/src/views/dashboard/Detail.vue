<template>
  <div class="container">
    <n-button @click="back">返回</n-button>
    <n-h1>{{blogInfo.title}}</n-h1>
    <div class="blog-content">
        <div v-html="blogInfo.content"></div>
    </div>
  </div>
</template>

<script setup>

import {ref,reactive,inject,onMounted} from "vue"
import {useRouter,useRoute} from "vue-router"
const axios = inject("axios")
const router = useRouter()
const route = useRoute()
const blogInfo = ref([])
onMounted(()=>{
    loadBlog();
})
const loadBlog= async ()=>{
    let res = await axios.get(`/blog/detail?id=${route.query.id}`)
    blogInfo.value = res.data.rows[0]
}
const back = ()=>{
    router.go(-1)
}
</script>
<style>
.blog-content img{
    max-width:50% !important;
}</style>
<style lang = "scss" scoped>
.container {
    width: 80%;
    margin: 0 auto;
}
div{
    WORD-WRAP:break-word;
    TABLE-LAYOUT:fixed;
    word-break:break-all;
}
</style>
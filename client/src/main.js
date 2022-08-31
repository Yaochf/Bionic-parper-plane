import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createPinia } from "pinia"//Pinia 是 Vue 的存储库,允许跨组件/页面共享状态
import {router} from "./common/router"
import axios from "axios"
import {createDiscreteApi} from "naive-ui";
import {AdminStore} from "./stores/AdminStore"


axios.defaults.baseURL = "http://43.143.22.76"//服务端地址
// axios.defaults.baseURL = "http://localhost:3000"
const app = createApp(App)
const { message, notification, dialog } = createDiscreteApi(
    ["message", "dialog", "notification"]
  );
app.provide("axios",axios)//将axios提供到全局
app.provide("message",message)
app.provide("dialog",dialog)
app.provide("notification",notification)
app.provide("server_url",axios.defaults.baseURL)
app.use(naive)
app.use(createPinia())
app.use(router)
const adminstore = AdminStore()
axios.interceptors.request.use((config)=>{
  config.headers.token = adminstore.token
  return config
})
app.mount('#app')

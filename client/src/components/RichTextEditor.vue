<template>
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
        <Editor  :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden" 
        @onCreated="handleCreated" @onChange="handleChange"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' 
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive,inject} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
const server_url = inject('server_url');
const editorRef = shallowRef();// 编辑器实例，必须用 shallowRef，重要！
const toolbarConfig = {excludeKeys:"uploadVideo"}
const mode = ref("default")
const editorConfig = { placeholder: '请输入内容...' }
editorConfig.MENU_CONF={}
editorConfig.MENU_CONF['uploadImage'] = {
    server: server_url+'/upload/rich_editor_upload',
    // server: 'http://43.143.22.76/upload/rich_editor_upload',
    base64LimitSize: 10 * 1024, // 5kb
}

editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc:(src)=> {
        if(src.indexOf("http") !== 0){
            return `${server_url}${src}`
        }
        return src
    }
}
const valueHtml = ref("")

const props = defineProps({
    modelValue:{
        type:String,
        default:""
    }
})
const emit = defineEmits(["update:model-value"])
let initFinished = false

onMounted(()=>{
    setTimeout(()=>{
        valueHtml.value = props.modelValue;
        initFinished = true;
    },1);
})
onBeforeUnmount(() => {
        const editor = editorRef.value;
        if (editor == null) return;
        editor.destroy();
    })

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
    // console.log('change:', editor.getHtml());
    if(initFinished){
        emit("update:model-value",valueHtml.value)
    }
    
};


</script>
<style lang = "scss" scoped>
div{
    WORD-WRAP:break-word;
    TABLE-LAYOUT:fixed;
    word-break:break-all;
}
</style>
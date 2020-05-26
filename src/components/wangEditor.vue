<template>
    <div class="wang-editor">
        <div ref="editor" style="text-align:left"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
        name: 'editor',
        props:{
            content:{
                default:'',
            }
        },
        data() {
            return {
                editor:null
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init(){
                this.editor = new E(this.$refs.editor);
                // editor.customConfig.uploadImgServer = 'http://img.10000rc.com'  // 上传图片到服务器
                // editor.customConfig.qiniu = true
                this.editor.customConfig.uploadImgShowBase64 = true
                this.editor.customConfig.showLinkImg = false;
                this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
                this.editor.customConfig.onchange = (html) => {
                    setTimeout(() => {
                        this.$emit('getEditor', html)
                    })
                };
                this.editor.create()
            },
            setHtml(str){
                this.editor.txt.html(str)
            }
        }
    }
</script>

<style lang="scss">
    .wang-editor{
        img{
            display: block;
            width:100%;
        }
    }
</style>
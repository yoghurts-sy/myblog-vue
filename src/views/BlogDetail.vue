<template>
    <div>
        <Header></Header>
        <div class="m-markdown-body">
            <h2>{{ blog.title }}</h2>
            <el-link icon="el-icon-edit" v-show="validateUser" href="">
                <router-link :to="{name:'BlogEdit', params:{blogId: blog.blogId}}">
                    编辑
                </router-link>
            </el-link>
            <el-link icon="el-icon-download" style="margin-left:10px" @click="downloadMd" v-show="validateUser">
                 导出Markdown
            </el-link>
            <el-divider></el-divider>
            <div class="markdown-body" v-html="blog.content"></div>
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    import 'github-markdown-css/github-markdown.css';

    export default {
        name: "BlogDetail",
        components: {Header},
        data() {
            return {
                blog: {
                    userId:null,
                    title:'',
                    description:'',
                    content:'',
                    blogId: null
                },
                validateUser:false
            }
        },
        created() {
            const _this = this
            const blogId = this.$route.params.blogId
            this.blog.blogId = blogId

            this.$axios.get('/blog/' + blogId).then(res => {
                let blog = res.data.data
                _this.blog.userId = blog.userId
                _this.blog.title = blog.title
                _this.blog.description = blog.description

                let MarkdownIt = require("markdown-it")
                let md = new MarkdownIt()
                let result = md.render(blog.content);
                _this.blog.content = result

                if (_this.$store.state.userInfo.id) {
                    if (_this.$store.state.userInfo.id === _this.blog.userId) {
                        _this.validateUser = true
                    } else {
                        _this.validateUser = false
                    }
                }
            })
        },
        methods: {
            downloadMd() {
                let _this = this
                console.log(_this.blog.title)
                let URL = "/api/md/download?id="+_this.blog.blogId +"&title="+_this.blog.title
                this.$axios.get(URL,{
                        headers:{
                            "Authorization": _this.$store.state.token
                        },
                        responseType:'blob',
                }
                ).then(res =>{
                    let blob = new Blob([res.data], {type: res.data.type})
                    let href = window.URL.createObjectURL(blob);
                    const a = document.createElement('a')
                    a.setAttribute('href', href)
                    a.setAttribute('download', _this.blog.title+".md")
                   /* a.setAttribute('target', '_blank')*/

                    document.body.appendChild(a);
                    a.click(); //点击下载
                    document.body.removeChild(a); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放blob
                })
            }
        }
    }
</script>

<style scoped>
    .m-markdown-body {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width: 100%;
        padding: 20px 15px;
    }
</style>
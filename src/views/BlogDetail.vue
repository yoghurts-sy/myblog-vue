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
                    title:'123123',
                    description:'1231',
                    content:'## 123',
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
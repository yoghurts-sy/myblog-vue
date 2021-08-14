<template>
    <div>
        <Header></Header>
        <div class="block">
            <el-timeline>
                <el-timeline-item v-bind:timestamp="blog.created" placement="top" v-for="(blog,index) in blogs" :key="index">
                    <el-card>
                        <h4><router-link :to="{name:'BlogDetail', params:{blogId:blog.id}}">{{ blog.title }}</router-link></h4>
                        <p>{{ blog.description }}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div class="block">
            <el-pagination class="mPage"
                    layout="prev, pager, next"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    @current-change="Page"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    export default {
        name: "Blogs",
        components: {Header},
        data() {
            return{
                blogs:{},
                currentPage: 1,
                total: 0,
                pageSize: 5
            }
        },
        methods:{
            Page(currentPage) {
                const _this = this
                this.$axios.get('blogs?currentPage='+currentPage).then(res => {
                    console.log(res.data)
                    _this.blogs = res.data.data.records
                    _this.currentPage = res.data.data.current
                    _this.total = res.data.data.total
                    _this.pageSize = res.data.data.size
                })
            }
        },
        mounted() {
            this.Page(1)
        }
    }
</script>

<style scoped>
    .mPage {
        margin: 0 auto;
        text-align: center;
    }
</style>
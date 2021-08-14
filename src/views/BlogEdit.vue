<template>
    <div>
        <Header></Header>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="Title" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="Content" prop="content">
                <mavon-editor v-model="ruleForm.content"></mavon-editor>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="submitForm('ruleForm')" :disabled="validateUser">commit</el-button>
                <el-button @click="resetForm('ruleForm')" :disabled="validateUser">reset</el-button>
                <span v-show="validateUser" style="margin-left: 35px; color: red">It's not your blogs. You don't have right to edit it.</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Header from "../components/Header";
    export default {
        name: "BlogEdit",
        components: {Header},
        data(){
            return {
                userId:null,
                validateUser:false,
                ruleForm: {
                    id:null,
                    title: '',
                    description: '',
                    content:''
                },
                rules: {
                    title: [
                        { required: true, message: 'Please enter title.', trigger: 'blur' },
                        { min: 5, message: 'Title length should be  3 to 35 bytes', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Please enter description.', trigger: 'blur' },
                        { min: 5, message: 'Description two short!! At least 5 bytes.', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: 'Please enter content.', trigger: 'blur' },
                        { min: 5, message: 'Content two short!!At least 5 bytes.', trigger: 'blur' }
                    ],
            }
        }
    },  methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this = this
                        this.$axios.post('/blog/edit', _this.ruleForm, {

                            headers:{
                                "Authorization":_this.$store.state.token
                            }


                        }).then(res => {
                            this.$alert('commited', 'Callback', {
                                confirmButtonText: 'OK',
                                callback: action => {
                                    _this.$router.push("/blogs")
                                }
                            });
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {
            const _this = this
            const blogId = this.$route.params.blogId
            console.log("blogId:"+blogId)
            if (blogId) {
                this.$axios.get('/blog/'+blogId).then(res => {
                    const blog = res.data.data
                    _this.ruleForm.id = blogId
                    _this.ruleForm.title = blog.title
                    _this.ruleForm.description = blog.description
                    _this.ruleForm.content = blog.content
                    _this.userId = blog.userId
                    if (_this.userId) {
                        if (this.$store.state.userInfo.id === this.userId) {
                            this.validateUser = false;
                        } else {
                            this.validateUser = true;
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
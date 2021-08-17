<template>
    <div>
        <Header></Header>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                    <el-upload
                        class="upload-demo"
                        action="http://localhost:8090/api/md/convert2String"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="uploadMdSuccess"
                        :auto-upload="true">
                    <el-link icon="el-icon-document"
                             :disabled="validateUser"
                             slot="trigger"
                    >上传本地Markdown</el-link>
                        <el-link
                                type="success" class="save-successful" v-loading="saving" element-loading-spinner="el-icon-loading"
                                icon="el-icon-success"
                        >已自动保存</el-link>
                </el-upload>

                <mavon-editor ref=md v-model="ruleForm.content" @imgAdd="imgAdd" @imgDel="imgDel"
                    @change="changeContent"
                ></mavon-editor>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="submitForm('ruleForm')" :disabled="validateUser">保存</el-button>
                <el-button @click="resetForm('ruleForm')" :disabled="validateUser">重置</el-button>
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
                saving:true,
                preContent:'',
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
                            this.$alert('保存成功！', '提示', {
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
            },
            imgAdd(pos, $file){
                // 第一步.将图片上传到服务器.
                var formdata = new FormData()
                formdata.append('file', $file)
                let _this = this
                this.$axios({
                    url: 'api/md/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((res) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    console.log("res:"+res.data)
                    let url = res.data.data
                    _this.$refs.md.$imglst2Url([[pos, url]])
                })
                this.updateContent()
            },
            imgDel(pos) {

            },
            changeContent(value, render) {
                this.saving = true;
                let _this = this;
                if (value !== this.preContent) {
                    this.preContent = value
                    this.updateContent()
                }
                //自动保存
            },
            uploadMdSuccess(res) {
                this.preContent = this.ruleForm.content
                this.ruleForm.content = res.data
            },
            handlePreview() {

            },
            handleRemove() {
                this.ruleForm.content = this.preContent
            },
            updateContent() {
                let _this = this
                this.$axios.post('/blog/edit', _this.ruleForm, {
                    headers:{
                        "Authorization":_this.$store.state.token
                    }
                }).then(res => {
                    _this.saving = false
                })
            }
        },
        created() {
            const _this = this
            const blogId = this.$route.params.blogId
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
    .upload-demo {
    }
    .save-successful {
        margin-left: 15px;
        margin-top: 2px;
    }

</style>
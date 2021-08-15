<template>
    <div>
        <el-container>
            <el-header>
                <img src="../assets/login-head.png" class="login-head">
            </el-header>
            <el-main class="m-container">
                <div class="login-header">
                    <el-avatar icon="el-icon-user-solid" :size="50" :src='ruleForm.avatar'></el-avatar>
                    <!--<div class="login-head-div">Sign up to Yoghurt.</div>-->
                    <span class="login-head-div">Sign up to Yoghurt.</span>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="Email" prop="email">
                        <el-input type="email" v-model="ruleForm.email" placeholder="Email will be your AccountID"></el-input>
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="ruleForm.password" placeholder="Please enter password"></el-input>
                    </el-form-item>
                    <el-form-item label="RePassword" prop="rePassword">
                        <el-input type="password" v-model="ruleForm.rePassword" placeholder="Please enter password again"></el-input>
                    </el-form-item>
                    <el-form-item label="Username" prop="username">
                        <el-input v-model="ruleForm.username" placeholder="Please enter username"></el-input>
                    </el-form-item>
                    <div class="warning" v-show="!isUploadAvatar">please upload avatar!</div>
                    <el-form-item class="el-form-item-button">
                        <el-upload
                                class="upload-demo"
                                ref="upload"
                                action="http://localhost:8090/upload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleAvatarSuccess"
                                :auto-upload="true"
                                :click="submitUpload"
                        ><el-button slot="trigger" size="small" type="primary">select avatar</el-button></el-upload>
                        <!--<el-button @click="uploadAvatar">uploadAvatar</el-button>-->
                        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="!isUploadAvatar">Sign up</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            var validatePass2 = (rule, value, callback) => {
                console.log(value)
                console.log(this.ruleForm.password)
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                isUploadAvatar:false,
                ruleForm: {
                    username: '',
                    password: '',
                    rePassword:'',
                    email: '',
                    avatar: ''
                },
                rules: {
                    username: [
                        { required: true, message: 'Please enter Username', trigger: 'blur' },
                        { min: 3, max: 15, message: 'Length should be 3 to 15 bytes', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please enter Password', trigger: 'blur' },
                        /*{ min: 6, max: 15, message: 'Length should be 3 to 15 bytes', trigger: 'blur' }*/
                        { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字、大小写字母和特殊符号至少包含三种，长度为8-30位' }
                    ],
                    email: [
                        { required: true, message: 'Please enter Email', trigger: 'blur' },
                        { pattern:/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: 'email wrong pattern'}
                    ],
                    rePassword: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ]
                },
                fileList: [
                    {
                        name: '',
                        url: ''
                    }
                ]
            }
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        this.$axios.post('/register', this.ruleForm).then(res => {

                            const jwt = res.headers['authorization']
                            const userInfo = res.data.data;

                            _this.$store.commit("SET_TOKEN", jwt)
                            _this.$store.commit("SET_USERINFO", userInfo)
                            _this.$router.push("/blogs")

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitUpload() {
                console.log("submit!")
            },
            handleRemove(file, fileList) {
                this.ruleForm.avatar = ''
                this.isUploadAvatar = false
            },
            handlePreview(file) {
                console.log(file);
            },
            handleAvatarSuccess(res) {
                this.ruleForm.avatar = res.data
                this.isUploadAvatar = true
            }
        }

    }
</script>

<style scoped>
    .m-container {
        text-align: center;
        max-width: 960px;
    }

    .el-header {
        background-color: white;
        color: white;
        text-align: center;
        line-height: 60px;
        height: 200px;
    }
    .el-main {
        background-color: white;
        color: #333;
        text-align: center;
        width: 500px;
        margin: 0 auto;
        /*line-height: 160px;*/
    }

    demo-ruleForm > el-form-item-button {
        margin-left: -10px;
    }


    .login-head {
        height: 100%;
    }

    .login-header {
        color: black;
        height: 50px;
        margin-bottom: 10px;
    }
    .login-head-div {
        height: 100%;
        font-size: large;
        font-weight: bold;
        font-style:oblique;
        margin-left: 20px;
    }
    .warning {
        color: red;
        font-size: medium;
        font-style: oblique;
        margin-top: -10px;
        margin-bottom: 10px;
        margin-left: 70px;
    }
</style>
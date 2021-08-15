<template>
    <div >
        <el-container>
            <el-header>
                <img src="../assets/login-head.png" class="login-head">
            </el-header>
            <el-main class="m-container">
                <div class="login-header">
                    <div class="login-head-div">Sign in to Yoghurt.</div>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item class="el-form-item-button">
                        <el-button type="primary" @click="submitForm('ruleForm')">Sign in</el-button>
                        <el-button @click="resetForm('ruleForm')">Reset</el-button>
                        <el-button @click="signUp">Sign up</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    email: '',
                    password: '',
                },
                rules: {
                    email: [
                        { required: true, message: 'Please enter Email', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: 'Please enter Password', trigger: 'blur' },
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;

                        this.$axios.post('/login', this.ruleForm).then(res => {

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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            signUp() {
                this.$router.push("/register")
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
        padding-top: 10px;
    }
</style>
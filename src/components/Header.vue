<template>
    <div class="m-content">
        <h3 style="font-style:oblique;">Welcome to
            <span v-show="hasLogin">{{ user.username }}’s</span>
            <span v-show="!hasLogin">Yoghurt</span>
             Blogs
        </h3>
        <div>
            <el-avatar icon="el-icon-user-solid" :size="50" :src='user.avatar'></el-avatar>
            <div>{{ user.username }}</div>
        </div>
        <div class="maction">
            <span><el-link href="/blogs" >home</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span><el-link type="success" href="/blog/add" :disabled="!hasLogin">new blog</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span v-show="!hasLogin"><el-link type="primary" href="/login">sign in</el-link></span>
            <span v-show="hasLogin"><el-link type="danger" @click="signOut">sign out</el-link></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                user:{
                    username:'Please sign in',
                    avatar:''
                },
                hasLogin:false
            }
        },
        methods:{
            signOut() {
                const _this = this

                this.$axios.post('',)

                this.$axios.get('/logout', {
                    headers:{
                        "Authorization":_this.$store.state.token
                    }
                }

                ).then(res => {
                    _this.$store.commit("REMOVE_INFO")
                    _this.$router.push("/login")
                }
                )
            }
        },
        created() {
            if (localStorage.getItem("token") !== '') {
                this.$store.commit("SET_TOKEN", localStorage.getItem("token"))
                console.log("localStorage token:"+localStorage.getItem("token"))
            }
            if (sessionStorage.getItem("userInfo") !== '') {
                console.log(sessionStorage.getItem("userInfo"));
                this.$store.commit("SET_USERINFO", JSON.parse(sessionStorage.getItem("userInfo")))
                console.log("sessionStorage userInfo:"+JSON.parse(sessionStorage.getItem("userInfo")).username)
            }

            if (this.$store.state.userInfo.username) {
                console.log("-------store-------")
                this.user.username = this.$store.state.userInfo.username
                this.user.avatar = this.$store.state.userInfo.avatar
                this.hasLogin = true
            }
        }
    }
</script>

<style scoped>
    .m-content {
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
    }
    .maction {
        margin: 10px;
    }
</style>
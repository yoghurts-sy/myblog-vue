<template>
    <div class="m-header">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 text-color="#8CC4FD" active-text-color="#409EFF" router>
            <el-menu-item class="logo-container" :style="logoMargin">
                <img class="logo" src="../assets/login-head.png" />
            </el-menu-item>
            <el-menu-item
                    :key="key"
                    v-for="(item,key) in leftNavItems"
                    v-if="Object.keys(leftNavItems).length === 0?false:true"
                    :index="item.index"
                    :route="item.indexPath">{{item.name}}</el-menu-item>
            <el-submenu
                style="float: right"
                class="right-item"
                index="4"
                v-if="Object.keys(rightNavItems).length === 0?false:true">

                <template slot="title">
                    <i class="el-icon-s-fold" style="font-size:28px;color:#2d2d2d;"></i>
                </template>
                <el-menu-item
                    :key="key"
                    v-for="(item,key) in rightNavItems"
                    :index="item.index"
                    :route="item.indexPath">{{item.name}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Header2",
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1',
                navItems:[
                    {name:"我的博客", indexPath:"/blogs", index:"1"},
                    {name:"新建博客", indexPath:"/blog/add", index:"2"},
                    {name:"退出", indexPath:"/logout", index:"3"}
                ],
                screenWidth:document.body.clientWidth,
                logoMargin:''
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        mounted() {
            window.onresize = () => {
                this.screenWidth = document.body.clientWidth
                if (this.screenWidth < 600) {
                    this.logoMargin = 'margin-right: 0px!important;'
                }
            }
        },
        watch:{
            screenWidth(newValue) {
                // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
                if (!this.timer) {
                    // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
                    this.screenWidth = newValue;
                    this.timer = true;
                    setTimeout(() => {
                        //console.log(this.screenWidth);
                        this.timer = false;
                    }, 400);
                }
            }
        },
        computed:{
            leftNavItems() {
               return this.screenWidth >= 600 ? this.navItems : {};
            },
            rightNavItems() {
                return this.screenWidth < 600 ? this.navItems : {};
            }
        }
    }
</script>

<style scoped>
    .m-header {
        height: 50px;
        max-width: 1200px;
        position: sticky;
        top: 0;
        z-index: 1000;
    }
    .el-menu-demo {

    }
    .logo-container {
        margin-right: 100px!important;
    }
    .logo {
        width: 200px;
        height: 50px;
    }
    .right-item {
        width: 50px;
        margin-right: 30px;
    }
</style>
<style>
    .el-menu--horizontal >.el-submenu .el-submenu__title{
        border-bottom: none!important;
    }
</style>
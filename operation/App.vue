<template>
    <div class="main" v-show="$store.state.myDetail.rights">
        <el-row class="top">
            <el-col :span="6" class="name">
                <img src="../assets/images/logo@2x.png" class="logo"/>
                趣乡野运营系统
            </el-col>
            <el-col :span="12">
                <el-menu :default-active="topActiveIndex" mode="horizontal" router
                         background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item v-for="(topMenu,index) in menus" :index="'/'+index" :key="index"
                                  v-show="!topMenu.hidden">{{topMenu.label}}
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="6" class="user-info">
                欢迎你：
                <el-button type="text" @click="goToMine">{{myDetail.name}}</el-button>
                <el-button type="text" @click="logOut">退出</el-button>
            </el-col>
        </el-row>
        <el-row class="level_two_menu">
            <el-col :span="4">
                <el-menu :default-active="activeIndex" router>
                    <el-menu-item v-for="item in subs" :index="'/'+item.right" :key="item.right"
                                  v-if="rights.includes(item.right)">
                        {{item.label}}
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20" class="right">
                <router-view></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                menus: [
                    {
                        label: '用户管理',
                        subs: [
                            {
                                right: 'operator',
                                label: '运营人员'
                            },
                            {
                                right: 'customer',
                                label: '用户'
                            },
                            {
                                right: 'message',
                                label: '用户留言'
                            }
                        ]
                    },
                    {
                        label: '商品管理',
                        subs: [
                            {
                                right: 'product',
                                label: '商品'
                            },
                            {
                                right: 'merchant',
                                label: '商户'
                            },
                            {
                                right: 'tipOff',
                                label: '商户举报'
                            }
                        ]
                    },
                    {
                        label: '订单管理',
                        subs: [
                            {
                                right: 'order',
                                label: '订单'
                            },
                            {
                                right: 'comment',
                                label: '评价'
                            }
                        ]
                    },
                    {
                        label: '我的',
                        hidden: true,
                        subs: [
                            {
                                right: 'basic',
                                label: '基本信息'
                            },
                            {
                                right: 'resetPwd',
                                label: '修改密码'
                            }
                        ]
                    }
                ],
                topActiveIndex: "",
                activeIndex: ""
            };
        },
        computed: {
            myDetail: function () {
                return this.$store.state.myDetail;
            },
            rights: function () {
                return ['basic', 'resetPwd'].concat(this.$store.state.rights);
            },
            subs: function () {
                let right = this.topActiveIndex.split('/')[1];
                let topMenu = this.menus[right] || {};
                return topMenu.subs || [];
            }
        },
        watch: {
            "$route.path": function () {
                this.activeMenu();
            }
        },
        methods: {
            activeMenu() {
                let path = this.$route.path;
                // 定位到顶级菜单
                if (/^\/[0-9]+$/.test(path)) {
                    this.topActiveIndex = path;
                    this.activeIndex = "";
                }
                else {
                    let topMenu = this.findTopBySub(path);
                    if (topMenu) {
                        this.topActiveIndex = '/' + this.menus.indexOf(topMenu);
                        this.activeIndex = path;
                    }
                }
            },
            findTopBySub(path) {
                return this.menus.find((top) => {
                    return top.subs.find((sub) => {
                        return path == '/' + sub.right;
                    });
                });
            },
            goToMine() {
                this.$router.push({path: '/basic'});
            },
            logOut() {
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/logout",
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        window.location.href = 'login.html';
                    }
                }).catch((error) => {
                });
            },
            fetchDetail() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/user/detail",
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.$store.state.myDetail = response.data;
                        this.$store.state.rights = response.data.rights;
                        this.$store.commit("change");  // 调用commit才能发出改变通知
                        this.activeMenu();
                    }
                }).catch((error) => {
                });
            }
        },
        mounted: function () {
            // 请求拦截器
            this.$axios.interceptors.request.use(function (config) {
                config.withCredentials = true;  // 跨域请求允许带上cookie
                return config;
            }, null);
            // 响应拦截器
            this.$axios.interceptors.response.use((response) => {
                if (response.data.code == '-4') {
                    window.location.href = "login.html";
                }
                else if (response.data.code != 0) {
                    this.$message({
                        message: response.data.devMsg || response.data.msg,
                        type: 'warning'
                    });
                }
                return response;
            }, (error) => {
                if (error.request.status) {
                    this.$message({
                        message: '网络错误，请稍后重试',
                        type: 'warning'
                    });
                }
                return Promise.reject(error);
            });
            this.fetchDetail();
        }
    }
</script>

<style scoped lang="less">
    .top {
        color: #fff;
        line-height: 60px;
        .logo {
            height: 40px;
            vertical-align: middle;
        }
        .name {
            font-size: 24px;
            padding-left: 25px;
            background: #545c64;
        }
        .user-info {
            background: #545c64;
            .el-button--text {
                font-size: 16px;
            }
        }
    }

    .level_two_menu .el-menu {
        border-right: 0;
    }

    .right {
        min-height: 700px;
        border-left: 1px solid #DCDFE6;
    }
</style>

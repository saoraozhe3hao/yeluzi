<template>
    <div class="login">
        <el-card class="login-box">
            <img src="../assets/images/logo@3x.png" class="logo"/>
            <div class="sys-name">趣乡野运营系统</div>
            <el-form ref="form" :model="form" :rules="validate" class="form">
                <el-form-item label="" prop="j_username">
                    <el-input v-model="form.j_username" maxlength="11" placeholder="手机号" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="" prop="j_password">
                    <el-input type="password" v-model="form.j_password" maxlength="16" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="" prop="j_captcha">
                    <el-input type="captcha" v-model="form.j_captcha" maxlength="4" placeholder="验证码" class="captcha-input"></el-input>
                    <img :src="$basePath + '/admin/captcha?' + form.captchaNum" class="captcha-img" @click="fetchCaptcha"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="validateForm" class="login-btn">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import Md5 from 'md5'
    export default {
        data() {
            return {
                form: {
                    captchaNum: 1,
                    j_username: '',
                    j_password: '',
                    j_captcha: ''
                },
                validate: {
                    j_username: this.$validation.mobile,
                    j_password: this.$validation.password,
                    j_captcha: this.$validation.captcha
                }
            };
        },
        computed: {    },
        methods: {
            fetchCaptcha(){
                this.form.captchaNum ++;
            },
            validateForm(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submit();
                    }
                });
            },
            submit() {
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/login",
                    data: this.$qs.stringify({
                        j_username: this.form.j_username,
                        j_password: Md5(this.form.j_password),
                        j_captcha: this.form.j_captcha
                    })
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        window.location.href = "/index.html";
                    }
                    else{
                        this.fetchCaptcha();
                        this.form.j_captcha = "";
                    }
                }).catch(() => {
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
            this.$axios.interceptors.response.use((response)=>{
                if (response.data.code != 0) {
                    this.$message({
                        message: response.data.devMsg || response.data.msg,
                        type: 'warning'
                    });
                }
                return response;
            },(error) => {
                if(error.request.status){
                    this.$message({
                        message: '网络错误，请稍后重试',
                        type: 'warning'
                    });
                }
                return Promise.reject(error);
            });
        }
    }
</script>

<style scoped lang="less">
    .login {
        background-image: url("../assets/images/supplier-background.jpeg");
        background-size: cover;
        height: 100%;
        position: relative;
    }
    .login-box {
        position: absolute;
        height: 470px;
        width: 400px;
        left: 50%;
        top: 50%;
        margin: -235px 0 0 -200px;
        .logo {
            margin: 0 auto;
            display: block;
        }
        .sys-name {
            text-align: center;
            color: #FFB204;
            font-size: 30px;
        }
    }
    .form {
        margin: 30px 0 0;
        .captcha-input {
            width: 229px;
            vertical-align: middle;
        }
        .captcha-img {
            cursor: pointer;
            height: 46px;
            vertical-align: middle;
        }
        .login-btn {
            width: 358px;
        }
    }
</style>
<style lang="less">
    html,body {
        height: 100%;
    }
    .login .form .el-input input{
        height: 46px;
    }
</style>
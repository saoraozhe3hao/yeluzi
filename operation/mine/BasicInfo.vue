<template>
    <div class="basic-information" v-loading="loading">
        <div class="add-top">
            基本信息
        </div>
        <div class="add-form">
            <el-form :label-position="'left'" label-width="130px">
                <el-form-item label="姓名：">
                    {{myDetail.name}}
                </el-form-item>
                <el-form-item label="身份证号：">
                    {{myDetail.idNumber}}
                </el-form-item>
                <el-form-item label="手机号：">
                    {{myDetail.username}}
                </el-form-item>
                <el-form-item label="角色：">
                    {{roles}}
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false
            }
        },
        computed: {
            myDetail: function () {
                return this.$store.state.myDetail || {};
            },
            roles: function () {
                let roles = this.myDetail.roles || [];
                let roleNames = roles.map((item) => {
                    return item.name;
                });
                return roleNames.join(',');
            }
        },
        watch: {},
        methods: {},
        mounted: function () {
        }
    }
</script>

<style scoped lang="less">
</style>
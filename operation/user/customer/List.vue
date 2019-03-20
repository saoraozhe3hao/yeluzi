<template>
    <div class="customer-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">客户</span>
        </div>
        <div class="list-table">
            <el-table :data="table.data">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="enable(scope.row)" v-if="scope.row.status == '禁用'">启用</el-button>
                        <el-button type="text" @click="disable(scope.row)" v-if="scope.row.status == '正常'">禁用
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                loading: false,
                filter: {},
                table: {
                    data: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                }
            }
        },
        watch: {},
        computed: {},
        methods: {
            search() {
                this.page.currentPage = 1;
                this.fetchList();
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/customer",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {}
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response) {
                        this.table.data = response.data || [];
                        this.page.totalCount = response.recordsTotal;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            enable(row) {
                this.$confirm('确认启用该用户?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/customer/" + row.id);
                }).catch(() => {
                });
            },
            disable(row) {
                this.$confirm('确认禁用该用户?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/customer/" + row.id);
                }).catch(() => {
                });
            },
            operateAjax(url) {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + url
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.fetchList();
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        mounted: function () {
            this.fetchList();
        }
    }
</script>

<style scoped lang="less">
</style>
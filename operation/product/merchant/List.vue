<template>
    <div class="merchant-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">商户</span>
            <el-input placeholder="按商户名称、实名查询" v-model="filter.query" class="input-with-select" clearable
                      @clear="search" @keyup.enter.native="search">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-filter">
            <el-select v-model="filter.status" placeholder="所有状态" clearable filterable @change="filterChange">
                <el-option v-for="item in filter.statusList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="list-table">
            <el-table :data="table.data">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="merchantName" label="商户名称"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="realName" label="实名"></el-table-column>
                <el-table-column prop="idNumber" label="身份证号"></el-table-column>
                <el-table-column prop="score" label="评分"></el-table-column>
                <el-table-column prop="balance" label="余额"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{displayStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="enable(scope.row)" v-if="scope.row.status == 'forbidden'">允许发布
                        </el-button>
                        <el-button type="text" @click="disable(scope.row)" v-if="scope.row.status == 'normal'">禁止发布
                        </el-button>
                        <el-button type="text" @click="deduct(scope.row)" v-if="scope.row.score>0">降分</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="降分" :visible.sync="deductDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="deductDialog.model" ref="deductForm" :rules="rules" label-width="100px">
                <el-form-item label="降分：" prop="deductScore">
                    <el-input-number v-model="deductDialog.model.deductScore" :precision="1" :step="0.5"
                                     :max="deductDialog.maxDeduct" :min="0.1" placeholder="请输入"></el-input-number>
                </el-form-item>
                <el-form-item label="剩余分：">
                    {{deductDialog.maxDeduct - deductDialog.model.deductScore}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deductDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="deductConfirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                loading: false,
                filter: {
                    query: '',
                    status: 'normal',
                    statusList: [
                        {
                            value: 'normal',
                            label: '正常'
                        },
                        {
                            value: 'forbidden',
                            label: '禁止发布'
                        }
                    ]
                },
                table: {
                    data: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                deductDialog: {
                    visible: false,
                    maxDeduct: 5,
                    model: {
                        id: '',
                        deductScore: 0.5
                    }
                },
                rules: {
                    deductScore: this.$validation.score
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
            filterChange() {
                this.page.currentPage = 1;
                this.filter.query = "";
                this.fetchList();
            },
            displayStatus(status) {
                let item = this.filter.statusList.find((item) => {
                    return item.value === status;
                });
                return item && item.label;
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/merchant",
                    params: {
                        pageSize: 10,
                        pageNum: this.page.currentPage,
                        search: this.filter.query,
                        status: this.filter.status
                    },
                    data: {}
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response) {
                        this.table.data = response.data.list || [];
                        this.page.totalCount = response.data.total;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            deduct() {
                this.$confirm('确认降分该用户?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/customer/" + row.id);
                }).catch(() => {
                });
            },
            enable(row) {
                this.$confirm('确认允许该用户发布?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/merchant/enable", [row.id]);
                }).catch(() => {
                });
            },
            disable(row) {
                this.$confirm('确认禁止该用户发布?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/merchant/forbid", [row.id]);
                }).catch(() => {
                });
            },
            operateAjax(url, ids) {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + url,
                    data: ids
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
            },
            /*******  降分 对话框  *******/
            deduct(row) {
                this.deductDialog.model.id = row.id;
                this.deductDialog.model.deductScore = row.score > 0.5 ? 0.5 : row.score;
                this.deductDialog.maxDeduct = row.score;
                this.deductDialog.visible = true;
            },
            deductConfirm() {
                this.$refs.deductForm.validate((valid) => {
                    if (valid) {
                        this.deductSubmit();
                    } else {
                        return false;
                    }
                });
            },
            deductSubmit() {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/merchant/" + this.deductDialog.model.id + '/deduct',
                    data: {
                        deductScore: this.deductDialog.model.deductScore
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.deductDialog.visible = false;
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
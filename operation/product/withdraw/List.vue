<template>
    <div class="withdraw-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">提现申请</span>
            <el-input placeholder="按商户名或操作人查询" v-model="filter.query" class="input-with-select" clearable
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
                <el-table-column prop="merchantId" label="商户ID"></el-table-column>
                <el-table-column prop="merchant.merchantName" label="商户"></el-table-column>
                <el-table-column prop="merchant.realName" label="姓名"></el-table-column>
                <el-table-column prop="merchant.bankNumber" label="银行卡号"></el-table-column>
                <el-table-column prop="merchant.openingBank" label="开户行"></el-table-column>
                <el-table-column prop="amount" label="提现金额"></el-table-column>
                <el-table-column prop="time" label="申请时间"></el-table-column>
                <el-table-column prop="operator" label="操作人"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{displayStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="paying(scope.row)" v-if="scope.row.status == 'pending'">改为支付中
                        </el-button>
                        <el-button type="text" @click="paid(scope.row)" v-if="scope.row.status == 'handling'">改为已支付
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
                filter: {
                    query: '',
                    status: '',
                    statusList: [
                        {
                            value: 'pending',
                            label: '待支付'
                        },
                        {
                            value: 'handling',
                            label: '支付中'
                        },
                        {
                            value: 'paid',
                            label: '已支付'
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
                rules: {}
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
                    url: this.$basePath + "/admin/withdraw",
                    params: {
                        pageSize: 10,
                        pageNum: this.page.currentPage,
                        search: this.filter.query,
                        status: this.filter.status
                    }
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
            paying(row) {
                this.operateAjax("/admin/withdraw/" + row.id + "/handling");
            },
            /** 已支付 对话框 **/
            paid(row) {
                this.$confirm('确认已支付?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/withdraw/" + row.id + "/paid");
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
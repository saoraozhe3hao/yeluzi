<template>
    <div class="comment-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">订单</span>
            <el-input placeholder="订单/客户/商品/商户ID" v-model="filter.query" class="input-with-select" clearable
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
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="id" label="ID" width="100px"></el-table-column>
                <el-table-column prop="customerId" label="客户ID" width="100px"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="merchantId" label="商户ID" width="100px"></el-table-column>
                <el-table-column prop="merchantName" label="商户名称"></el-table-column>
                <el-table-column prop="productId" label="商品ID" width="100px"></el-table-column>
                <el-table-column prop="productName" label="商品名称"></el-table-column>
                <el-table-column prop="payTime" label="支付时间"></el-table-column>
                <el-table-column prop="orderTime" label="预约时间"></el-table-column>
                <el-table-column prop="useTime" label="使用时间"></el-table-column>
                <el-table-column label="数量" width="100px">
                    <template slot-scope="scope">
                        <span>{{scope.row.customerNum}} 人</span>
                        <span>，{{scope.row.roomNum}} 房间</span>
                        <span>，{{scope.row.bedNum}} 床位</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="总价"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{displayStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column prop="refunderName" label="退款人"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="refund(scope.row)" v-if="showRefund(scope.row)">退款</el-button>
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
                            value: 'unused',
                            label: '待使用'
                        },
                        {
                            value: 'used',
                            label: '已使用'
                        },
                        {
                            value: 'overdue',
                            label: '已过期'
                        },
                        {
                            value: 'refunded',
                            label: '已退款'
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
        computed: {},
        watch: {},
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
            showRefund(row){
                switch (row.status) {
                    case 'unused':
                        return true;
                    case 'refunded':
                        return false;
                    case 'used':
                    case 'overdue':
                        let orderDay = this.$moment(row.orderTime);
                        let days = this.$moment().diff(orderDay, 'days');
                        return days <= 7;
                }
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/order",
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
            /** 退款 对话框 **/
            refund(row) {
                this.$confirm('确认退款吗?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax(`/admin/order/${row.id}/refund`);
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
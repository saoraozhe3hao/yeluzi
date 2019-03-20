<template>
    <div class="order-management-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">订单管理</span>
            <el-input placeholder="按油站名称或订单ID查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="orderId" label="订单ID" fixed width="130"></el-table-column>
                <el-table-column prop="inquiryId" label="询盘单ID" fixed width="130"></el-table-column>
                <el-table-column prop="stationName" label="油站名称" fixed></el-table-column>
                <el-table-column prop="stationAddress" label="油站地址"></el-table-column>
                <el-table-column prop="stationContacts" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" width="100"></el-table-column>
                <el-table-column prop="oilNo" label="油号" width="60"></el-table-column>
                <el-table-column prop="level" label="级别" width="50"></el-table-column>
                <el-table-column prop="source" label="品牌" width="70"></el-table-column>
                <el-table-column prop="amount" label="数量"></el-table-column>
                <el-table-column prop="unit" label="单位" width="50"></el-table-column>
                <el-table-column prop="priceType" label="价格类型" width="100"></el-table-column>
                <el-table-column label="供应商采购单价">
                    <template slot-scope="scope">
                        {{'¥ ' + (scope.row.companyPrice / 100)}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商采购合计">
                    <template slot-scope="scope">
                        {{'¥ ' + (scope.row.companyOrderMoney / 100)}}
                    </template>
                </el-table-column>
                <el-table-column prop="payType" label="支付方式" width="80"></el-table-column>
                <el-table-column prop="oilDepotId" label="油库ID" width="70"></el-table-column>
                <el-table-column prop="oilDepotName" label="油库名称"></el-table-column>
                <el-table-column prop="oilDepotAddress" label="油库地址"></el-table-column>
                <el-table-column prop="oilDepotContacts" label="油库联系人"></el-table-column>
                <el-table-column prop="oilDepotPhone" label="油库联系人电话" width="120"></el-table-column>
                <el-table-column prop="createdTime" label="下单时间" width="140"></el-table-column>
                <el-table-column prop="state" label="状态" width="80"></el-table-column>
                <el-table-column label="订单确认时间" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" plain round v-if="['未确认'].includes(scope.row.state)"
                                   @click="confirmOrder(scope.row)">确认订单
                        </el-button>
                        <div v-else>{{scope.row.orderConfirmTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderConfirmName" label="订单确认人"></el-table-column>
                <el-table-column label="财务确认时间" width="140">
                    <template slot-scope="scope">
                        <div v-if="['已支付','已完成'].includes(scope.row.state)">{{scope.row.financeConfirmTime}}</div>
                        <el-button type="primary" plain round @click="confirmGather(scope.row)" v-if="scope.row.state == '未支付'">
                            确认收款
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="financeConfirmName" label="财务确认人"></el-table-column>
                <el-table-column label="操作" width="130">
                    <template slot-scope="scope">
                        <el-button type="primary" plain round @click="cancel(scope.row)"
                                   v-if="!['已取消','已支付','已完成'].includes(scope.row.state)">取消
                        </el-button>
                        <el-button type="primary" plain round @click="complete(scope.row)" v-if="scope.row.state == '已支付'">确认完成
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
                    searchKey: "",
                },
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
        methods: {
            search() {
                this.page.currentPage = 1;
                this.fetchList();
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/orders",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {
                        searchKey: this.filter.searchKey
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == 0) {
                        this.table.data = response.data || [];
                        this.page.totalCount = response.recordsTotal;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            /** 确认该订单 **/
            confirmOrder(row) {
                this.$confirm('确认该订单?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/order/" + row.orderId + "/confirm");
                }).catch(() => {
                });
            },
            /** 确认已收款 **/
            confirmGather(row) {
                this.$confirm('请确认已收到款?', '确认', {
                    confirmButtonText: '已收到',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/order/" + row.orderId + "/finance/confirm");
                }).catch(() => {
                });
            },
            /** 取消订单 **/
            cancel(row) {
                this.$confirm('取消该订单后，订单状态将变为“已取消”且无法恢复，请确认是否取消？', '风险提示', {
                    confirmButtonText: '确定取消',
                    cancelButtonText: '关闭',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/order/" + row.orderId + "/cancel");
                }).catch(() => {
                });
            },
            /** 完成订单 **/
            complete(row) {
                this.$confirm('请确认订单已完成？', '确认', {
                    confirmButtonText: '完成',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/order/" + row.orderId + "/close");
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
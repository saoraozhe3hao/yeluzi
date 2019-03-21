<template>
    <div class="comment-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">评价</span>
            <el-input placeholder="按商品名称或ID查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="id" label="ID" width="100px"></el-table-column>
                <el-table-column prop="score" label="评分" width="100px"></el-table-column>
                <el-table-column label="评论">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>{{scope.row.comment}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="商家回应">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>{{scope.row.response}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="customerId" label="客户ID" width="100px"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="merchantId" label="商户ID" width="100px"></el-table-column>
                <el-table-column prop="merchantName" label="商户名称"></el-table-column>
                <el-table-column prop="productId" label="商品ID" width="100px"></el-table-column>
                <el-table-column prop="productName" label="商品名称"></el-table-column>
                <el-table-column prop="orderId" label="订单ID" width="100px"></el-table-column>
                <el-table-column prop="payTime" label="支付时间"></el-table-column>
                <el-table-column prop="useTime" label="使用时间"></el-table-column>
                <el-table-column prop="commentTime" label="评价时间"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="remove(scope.row)">删除</el-button>
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
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/comment",
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
                    if (response) {
                        this.table.data = response.data || [];
                        this.page.totalCount = response.recordsTotal;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            /** 删除 对话框 **/
            remove(row) {
                this.$confirm('确认删除该评论?', '确认', {
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
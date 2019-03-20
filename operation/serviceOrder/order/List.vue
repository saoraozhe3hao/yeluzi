<template>
    <div class="service-commodity-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">订单查询</span>
            <el-input placeholder="按油站名称或订单ID查询" v-model="filter.queryString" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-filter">
            <el-form :inline="true">
                <el-form-item label="订单状态：">
                    <el-select v-model="filter.orderState" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="item in filter.states" :key="item.value" :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="种类：">
                    <el-select v-model="filter.oilType" clearable placeholder="全部" @change="typeChange">
                        <el-option v-for="item in filter.oilTypes" :key="item.typeId" :value="item.typeName"
                                   :label="item.typeName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="油号：">
                    <el-select v-model="filter.oilNo" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="(item,index) in filter.oilNos" :key="index" :value="item" :label="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="级别：">
                    <el-select v-model="filter.level" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="(item,index) in filter.levels" :key="index" :value="item" :label="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌：">
                    <el-select v-model="filter.source" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="(item,index) in filter.sources" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="list-table">
            <el-table :data="table.data">
                <el-table-column prop="orderId" label="订单ID" fixed width="130"></el-table-column>
                <el-table-column prop="inquiryId" label="询盘单ID" fixed width="130"></el-table-column>
                <el-table-column prop="supplyId" label="供应商ID" fixed width="100"></el-table-column>
                <el-table-column prop="supplyName" label="供应商名称" width="90"></el-table-column>
                <el-table-column prop="stationName" label="油站名称"></el-table-column>
                <el-table-column prop="stationAddress" label="油站地址"></el-table-column>
                <el-table-column prop="contacts" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" width="100"></el-table-column>
                <el-table-column prop="oilNo" label="油号" width="60"></el-table-column>
                <el-table-column prop="level" label="级别" width="50"></el-table-column>
                <el-table-column prop="source" label="品牌" width="70"></el-table-column>
                <el-table-column prop="amount" label="数量"></el-table-column>
                <el-table-column prop="unit" label="单位" width="50"></el-table-column>
                <el-table-column prop="priceType" label="价格类型" width="100"></el-table-column>
                <el-table-column prop="payType" label="支付方式" width="80"></el-table-column>
                <el-table-column label="客户销售单价" width="110">
                    <template slot-scope="scope">
                        {{'¥ ' + scope.row.memberPrice / 100}}
                    </template>
                </el-table-column>
                <el-table-column label="客户销售合计" width="110">
                    <template slot-scope="scope">
                        {{'¥ ' + scope.row.memberOrderMoney / 100}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商采购单价" width="120">
                    <template slot-scope="scope">
                        {{'¥ ' + scope.row.companyPrice / 100}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商采购合计" width="120">
                    <template slot-scope="scope">
                        {{'¥ ' + scope.row.companyOrderMoney / 100}}
                    </template>
                </el-table-column>
                <el-table-column label="聚油网采购差价" width="120">
                    <template slot-scope="scope">
                        {{'¥ ' + scope.row.balanceMoney / 100}}
                    </template>
                </el-table-column>
                <el-table-column prop="oilDepotId" label="油库ID" width="70"></el-table-column>
                <el-table-column prop="oilDepotName" label="油库名称"></el-table-column>
                <el-table-column prop="oilDepotAddress" label="油库地址"></el-table-column>
                <el-table-column prop="oilDepotContacts" label="油库联系人"></el-table-column>
                <el-table-column prop="oilDepotPhone" label="油库联系人电话" width="120"></el-table-column>
                <el-table-column prop="orderCreatedTime" label="下单时间" width="160"></el-table-column>
                <el-table-column prop="payStateStr" label="状态" width="70"></el-table-column>
                <el-table-column prop="financeConfirmTime" label="财务确认时间" width="160"></el-table-column>
                <el-table-column prop="financeConfirmName" label="财务确认人"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="cancel(scope.row)" v-if="scope.row.state == '未支付'">取消</el-button>
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
                    queryString: "",
                    states: [
                        {
                            value: 1,
                            label: '未确认'
                        },
                        {
                            value: 2,
                            label: '未支付'
                        },
                        {
                            value: 3,
                            label: '已支付'
                        },
                        {
                            value: 4,
                            label: '已取消'
                        },
                        {
                            value: 5,
                            label: '已完成'
                        }
                    ],
                    orderState: '',
                    oilType: '',
                    oilTypes: [],
                    oilNo: '',
                    oilNos: [],
                    level: '',
                    levels: [],
                    source: '',
                    sources: []
                },
                table: {
                    data: [],
                    selection: []
                },
                batch: {

                    targets: []
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
            typeChange() {
                this.filter.oilNo = '';
                this.filter.oilNos = [];
                this.fetchOilNos();
                this.fetchList();
            },
            filterChange() {
                this.page.currentPage = 1;
                this.filter.queryString = "";  // 过滤时不带关键字搜索，让页面显示与实际参数一致
                this.fetchList();
            },
            fetchTypes() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/types"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.filter.oilTypes = response.data || [];
                    }
                }).catch(() => {
                });
            },
            findTypeId(typeName){
                let type = this.filter.oilTypes.find((item)=>{
                    return item.typeName == typeName;
                });
                return type.typeId;
            },
            fetchOilNos() {
                if (!this.filter.oilType) {
                    return;
                }
                let typeId = this.findTypeId(this.filter.oilType);
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/codes",
                    params: {
                        typeId: typeId
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.filter.oilNos = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchLevels(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/levels"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.filter.levels = response.data || [];
                    }
                }).catch(()=>{});
            },
            fetchSources(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/allsources"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.filter.sources = response.data || [];
                    }
                }).catch(()=>{});
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/orders",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {
                        queryString: this.filter.queryString,
                        orderState: this.filter.orderState,
                        oilType: this.filter.oilType,
                        oilNo: this.filter.oilNo,
                        level: this.filter.level,
                        source: this.filter.source
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == 0) {
                        this.table.data = response.data.resultList || [];
                        this.page.totalCount = response.data.totalCount;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            cancel(row) {
                this.$confirm('取消该订单后，订单状态将变为“已取消”且无法恢复，请确认是否取消？', '风险提示', {
                    confirmButtonText: '确定取消',
                    cancelButtonText: '关闭',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/custom/order/" + row.orderId + "/cancel");
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
            this.fetchTypes();
            this.fetchLevels();
            this.fetchSources();
        }
    }
</script>

<style scoped lang="less">
    .service-commodity-list .list-filter .el-select{
        width: 100px;
    }
</style>
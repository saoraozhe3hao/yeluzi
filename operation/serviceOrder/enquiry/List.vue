<template>
    <div class="service-enquiry-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">询价单查询</span>
            <el-input placeholder="按油站名称查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-filter">
            <el-form :inline="true">
                <el-form-item label="下单时间：">
                    <el-date-picker v-model="filter.createdTime" align="right" type="date" placeholder="选择日期"
                                    :picker-options="filter.pickerOptions" @change="filterChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="filter.state" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="item in filter.states" :key="item.value" :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="省份与城市：">
                    <el-select v-model="filter.province" clearable placeholder="全部" @change="provinceChange">
                        <el-option v-for="item in filter.provinces" :key="item.cityId" :value="item.cityId"
                                   :label="item.cityName">
                        </el-option>
                    </el-select>
                    <el-select v-model="filter.city" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="item in filter.cities" :key="item.cityId" :value="item.cityId"
                                   :label="item.cityName">
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
            <el-table ref="multipleTable" :data="table.data" @selection-change="selectionChange">
                <el-table-column type="selection" width="50" fixed :selectable="selectable"></el-table-column>
                <el-table-column prop="id" label="询盘单ID" fixed width="130"></el-table-column>
                <el-table-column prop="companyId" label="供应商ID" fixed width="130"></el-table-column>
                <el-table-column prop="companyName" label="供应商名称" fixed width="130"></el-table-column>
                <el-table-column prop="province" label="省份" width="130"></el-table-column>
                <el-table-column prop="city" label="城市" width="130"></el-table-column>
                <el-table-column prop="stationName" label="油站名称" fixed></el-table-column>
                <el-table-column prop="stationAddress" label="油站地址"></el-table-column>
                <el-table-column prop="contacts" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" width="100"></el-table-column>
                <el-table-column prop="oilNo" label="油号" width="60"></el-table-column>
                <el-table-column prop="level" label="级别" width="50"></el-table-column>
                <el-table-column prop="source" label="品牌" width="70"></el-table-column>
                <el-table-column prop="amount" label="数量"></el-table-column>
                <el-table-column prop="unit" label="单位" width="50"></el-table-column>
                <el-table-column prop="goodsSalesRuleId" label="价格方案ID" width="130"></el-table-column>
                <el-table-column prop="priceType" label="价格类型" width="100"></el-table-column>
                <el-table-column label="单价" width="90">
                    <template slot-scope="scope">
                        {{getPrice(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column prop="oilDepotAddressId" label="油库ID" width="70"></el-table-column>
                <el-table-column prop="oilDepotName" label="油库名称"></el-table-column>
                <el-table-column prop="oilDepotAddress" label="油库地址"></el-table-column>
                <el-table-column prop="oilDepotContacts" label="油库联系人"></el-table-column>
                <el-table-column prop="oilDepotPhone" label="油库联系人电话" width="120"></el-table-column>
                <el-table-column prop="invoiceAddress" label="发票邮寄地址"></el-table-column>
                <el-table-column prop="createdTime" label="询盘时间" width="140"></el-table-column>
                <el-table-column prop="state" label="状态" width="80"></el-table-column>
                <el-table-column prop="updateTime" label="最后更新时间" width="140"></el-table-column>
                <el-table-column prop="updateUserName" label="最后更新人" width="90"></el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="scope">
                        <el-button type="text" @click="addRecord(scope.row.id)">添加跟进记录</el-button>
                        <el-button type="text" @click="seeRecord(scope.row)">查看跟进记录</el-button>
                        <el-button type="text" @click="turnToOrder(scope.row)"
                                   v-if="['已跟进','未跟进'].includes(scope.row.state)">转为订单
                        </el-button>
                        <el-button type="text" @click="reject(scope.row)"
                                   v-if="['已跟进','未跟进'].includes(scope.row.state)">回绝
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <batch-operation :operations="batch.operations" :targets="batch.targets"
                             @batchDone="fetchList"></batch-operation>
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="添加跟进记录" :visible.sync="addDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="addDialog.model" ref="addForm" :rules="validate" label-width="0">
                <el-form-item label="" prop="record">
                    <el-input type="textarea" :rows="4" placeholder="请输入本次电话沟通的结果，如最终报价、支付时间、提货方式等"
                              v-model="addDialog.model.record" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看跟进记录" :visible.sync="seeDialog.visible" width="500px" :close-on-click-modal="false">
            <div class="records">
                <div v-for="item in seeDialog.records" class="record">
                    {{item.time}}
                    <span>{{item.userName}}</span>
                    {{item.operation}}
                    <span>{{item.content}}</span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="seeDialog.visible = false">关 闭</el-button>
                <el-button type="primary" @click="addRecord(seeDialog.id)">添加新记录</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import BatchOperation from "../../../components/BatchOperation"

    export default {
        components: {
            'batch-operation': BatchOperation,
        },
        data() {
            return {
                loading: false,
                filter: {
                    searchKey: "",
                    createdTime: '',
                    state: '',
                    province: '',
                    city: '',
                    level: '',
                    source: '',
                    oilNo: '',
                    states: [
                        {
                            value: 1,
                            label: '未跟进'
                        },
                        {
                            value: 2,
                            label: '已跟进'
                        },
                        {
                            value: 3,
                            label: '已转订单'
                        },
                        {
                            value: 4,
                            label: '已回绝'
                        }
                    ],
                    oilTypes: [],
                    oilNos: [],
                    levels: [],
                    sources: [],
                    provinces: [],
                    cities: [],
                    pickerOptions: {
                        disabledDate(time) {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                table: {
                    data: [],
                    selection: []
                },
                batch: {
                    operations: [
                        {
                            label: "回绝",
                            method: "put",
                            url: "/admin/inquiry/reject",
                            message: "回绝该询盘信息后，将无法再创建订单，请确认是否回绝？"
                        }
                    ],
                    targets: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                addDialog: {
                    visible: false,
                    model: {
                        id: '',
                        record: ''
                    }
                },
                seeDialog: {
                    visible: false,
                    id: '',
                    records: []
                },
                validate: {
                    record: [
                        {required: true, message: '请填写跟进记录', trigger: "blur"}
                    ]
                }
            }
        },
        watch: {},
        methods: {
            search() {
                this.page.currentPage = 1;
                this.fetchList();
            },
            selectable(row, index) {
                return !["已转订单", "已回绝"].includes(row.state);
            },
            provinceChange() {
                this.filter.city = '';
                this.filter.cities = [];
                this.fetchCities();
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
                this.filter.searchKey = "";  // 过滤时不带关键字搜索，让页面显示与实际参数一致
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
            fetchProvinces() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/commons/cities"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.filter.provinces = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchCities() {
                if (!this.filter.province) {
                    return;
                }
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/commons/cities",
                    params: {
                        parentId: this.filter.province
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.filter.cities = response.data || [];
                    }
                }).catch(() => {
                });
            },
            findTypeId(typeName) {
                let type = this.filter.oilTypes.find((item) => {
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
            fetchLevels() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/levels"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.filter.levels = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchSources() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/allsources"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.filter.sources = response.data || [];
                    }
                }).catch(() => {
                });
            },
            getPrice(row) {
                let price = "线下沟通";
                if (row.price >= 0) {
                    price = '¥ ' + (row.price / 100);
                }
                return price;
            },
            addRecord(id) {
                this.seeDialog.visible = false;
                this.addDialog.visible = true;
                this.addDialog.model.id = id;
                this.addDialog.model.record = '';
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate();
                });
            },
            seeRecord(row) {
                this.seeDialog.visible = true;
                this.seeDialog.id = row.id;
                this.fetchRecords(row.id);
            },
            turnToOrder(row) {
                this.$store.state.enquiry = row;
                this.$store.commit("change");  // 调用commit才能发出改变通知
                this.$router.push({path: '/service-order/add', query: {enquiryId: row.id}});
            },
            reject(row) {
                this.$confirm(this.batch.operations[0].message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '关闭',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax(this.batch.operations[0].url,[row.id]);
                }).catch(() => {
                });
            },
            operateAjax(url,data) {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + url,
                    data: data
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
            selectionChange(selection) {
                this.batch.targets = selection.map((item) => {
                    return item.id;
                });
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/inquiries",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {
                        searchKey: this.filter.searchKey,
                        createdTime: this.filter.createdTime && this.$moment(this.filter.createdTime).format("YYYY-MM-DD"),
                        state: this.filter.state,
                        province: this.filter.province,
                        city: this.filter.city,
                        level: this.filter.level,
                        source: this.filter.source,
                        oilType: this.filter.oilType,
                        oilNo: this.filter.oilNo
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
            /*******  添加跟踪记录 对话框 *******/
            addConfirm() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addSubmit();
                    } else {
                        return false;
                    }
                });
            },
            addSubmit() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/inquiry/" + this.addDialog.model.id + "/record",
                    data: {
                        record: this.addDialog.model.record
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.addDialog.visible = false;
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
            /*******  查看跟踪记录 对话框 *******/
            fetchRecords(enquiryId) {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/inquiry/" + enquiryId + "/records"
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response) {
                        this.seeDialog.records = response.data || [];
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
            this.fetchProvinces();
        }
    }
</script>

<style scoped lang="less">
    .record {
        line-height: 20px;
        span {
            color: #FFB204;
        }
    }

    .records {
        max-height: 350px;
        overflow: auto;
    }

    .service-enquiry-list .list-filter {
        .el-select {
            width: 100px;
        }
        .el-date-editor {
            width: 140px;
        }
    }
</style>
<template>
    <div class="price-management-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">价格管理</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="showAddDialog">新建</el-button>
            <el-input placeholder="按商品名称或ID查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="id" label="价格方案ID" width="140"></el-table-column>
                <el-table-column prop="supplyCompanyId" label="供应商ID" width="100"></el-table-column>
                <el-table-column prop="supplyCompanyName" label="供应商名称" width="90"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" width="100px"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                <el-table-column prop="province" label="供应省份" width="80px"></el-table-column>
                <el-table-column label="库提价" width="80px">
                    <template slot-scope="scope">
                        {{isFinite(parseFloat(scope.row.price)) ? '¥ ' + scope.row.price / 100 : scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column prop="settlementType" label="结算方式" width="80px"></el-table-column>
                <el-table-column prop="upTime" label="上架时间" width="160px"></el-table-column>
                <el-table-column prop="downTime" label="下架时间" width="160px"></el-table-column>
                <el-table-column label="比上次价格" width="90px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.fluctuateRate !== undefined"
                              :class="{up: scope.row.fluctuateFlag >= 0, down: scope.row.fluctuateFlag < 0}">
                            <i class='el-icon-upload2' v-if="scope.row.fluctuateFlag >= 0"></i>
                            <i class='el-icon-download' v-if="scope.row.fluctuateFlag < 0"></i> {{scope.row.fluctuateRate}} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="modifiedTime" label="修改时间" width="160px"></el-table-column>
                <el-table-column prop="modifier" label="修改人"></el-table-column>
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)" v-if="scope.row.enabled">编辑</el-button>
                        <el-button type="text" @click="adjust(scope.row)"
                                   v-if="scope.row.enabled && isFinite(parseFloat(scope.row.price))">调价
                        </el-button>
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
        <el-dialog :title="addDialog.model.id ? '编辑价格方案':'添加价格方案'" :visible.sync="addDialog.visible" width="500px"
                   :close-on-click-modal="false">
            <el-form :model="addDialog.model" ref="addForm" :rules="validate" label-width="120px">
                <el-form-item label="供应商：" prop="supplyCompanyId">
                    <el-select v-model="addDialog.model.supplyCompanyId" clearable placeholder="选择供应商"
                               @change="supplierChange" :disabled="!!addDialog.model.id">
                        <el-option v-for="item in addDialog.suppliers" :key="item.id" :value="item.id"
                                   :label="item.companyName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品：" prop="goodsId">
                    <el-select v-model="addDialog.model.goodsId" placeholder="请选择">
                        <el-option v-for="item in addDialog.goods" :key="item.id" :value="item.id" :label="item.desc">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格：" prop="priceType">
                    <el-radio v-model="addDialog.model.priceType" :label="1">线上显示</el-radio>
                    <el-radio v-model="addDialog.model.priceType" :label="2">线下沟通</el-radio>
                </el-form-item>
                <el-form-item label="库提价(有票)：" prop="price" v-if="addDialog.model.priceType == 1">
                    <el-input v-model="addDialog.model.price" maxlength="5" placeholder=""></el-input>
                    元/吨
                </el-form-item>
                <el-form-item label="结算方式：">
                    先款后货
                </el-form-item>
                <el-form-item label="供应省份：" prop="provinceIds">
                    <el-select v-model="addDialog.model.provinceIds" multiple placeholder="可以多选"
                               disabled @visible-change="provinceBlur">
                        <el-option v-for="item in addDialog.provinces" :key="item.cityId" :value="item.cityId"
                                   :label="item.cityName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架时间：" prop="upTime">
                    <el-time-picker v-model="addDialog.model.upTime" placeholder="选择时间"></el-time-picker>
                </el-form-item>
                <el-form-item label="下架时间：">
                    {{downTime}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="调价" :visible.sync="adjustDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="adjustDialog" ref="adjustForm" :rules="validate" label-width="120px">
                <el-form-item label="库提价(有票)：" prop="price">
                    <el-input v-model="adjustDialog.price" maxlength="5" placeholder=""></el-input>
                    元/吨
                </el-form-item>
                <el-form-item label="比上次价格：">
                    <span v-if="adjustRate >= 0" class="up">
                        <i class='el-icon-upload2'></i> {{adjustRate.toFixed(2)}} %
                    </span>
                    <span v-if="adjustRate < 0" class="down">
                        <i class='el-icon-download'></i>{{Math.abs(adjustRate).toFixed(2)}} %
                    </span>
                </el-form-item>
                <el-form-item label="价格下架时间：">
                    {{downTime}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="adjustDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="adjustConfirm">确 认</el-button>
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
                    searchKey: "",
                },
                table: {
                    data: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                downTime: '', // 下架时间
                addDialog: {
                    visible: false,
                    model: {
                        id: '',
                        supplyCompanyId: '',
                        goodsId: '',
                        priceType: 1,
                        price: '',
                        provinceIds: [-1],
                        upTime: '',
                        settlementType: 1
                    },
                    suppliers: [],
                    goods: [],
                    provinces: []
                },
                adjustDialog: {
                    visible: false,
                    currentRow: {},
                    price: ''
                },
                validate: {
                    supplyCompanyId: [
                        {required: true, message: '请选择'}
                    ],
                    goodsId: [
                        {required: true, message: '请选择'}
                    ],
                    priceType: [
                        {required: true, message: '请选择'}
                    ],
                    price: [
                        {required: true, message: '请填写价格', trigger: "blur"},
                        {pattern: /^[1-9]\d{0,4}$/, message: '请输入正整数,勿以0开头', trigger: "blur"}
                    ],
                    provinceIds: [
                        {required: true, message: '请选择'}
                    ],
                    upTime: [
                        {required: true, message: '请选择'}
                    ]
                }
            }
        },
        watch: {},
        computed: {
            formFields: function () {
                return Object.keys(this.addDialog.model);
            },
            adjustRate: function () {
                return this.variance(this.adjustDialog.price, this.adjustDialog.currentRow.price / 100);
            }
        },
        methods: {
            search() {
                this.page.currentPage = 1;
                this.fetchList();
            },
            showAddDialog() {
                this.addDialog.visible = true;
                this.addDialog.goods = [];
                this.fetchSuppliers();
                this.fetchProvince();
                // 清空
                this.addDialog.model = this.$copyFields(this.formFields, {
                    priceType: 1,
                    settlementType: 1,
                    provinceIds: [-1]
                }, this.addDialog.model);
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate();
                });
            },
            edit(row) {
                this.showAddDialog();
                // 回填
                this.$copyFields(this.formFields, row, this.addDialog.model);
                this.addDialog.model.settlementType = 1;
                this.addDialog.model.provinceIds = [row.provinceId];
                this.addDialog.model.price = isFinite(parseFloat(this.addDialog.model.price)) ? this.addDialog.model.price / 100 : "";
                this.fetchGoods();
            },
            adjust(row) {
                this.adjustDialog.visible = true;
                this.$copyFields(this.formFields, row, this.adjustDialog.currentRow);
                this.adjustDialog.currentRow.settlementType = 1;
                this.adjustDialog.currentRow.provinceIds = [row.provinceId];
                this.adjustDialog.price = row.price / 100;
                this.$nextTick(function () {
                    this.$refs.adjustForm.clearValidate();
                });
            },
            provinceBlur() {
                if (this.addDialog.model.provinceIds.includes(-1)) {
                    this.addDialog.model.provinceIds = [0];
                }
            },
            remove(row) {
                this.$confirm('确认删除该价格?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        ids: [row.id]
                    };
                    this.operateAjax("/admin/custom/service/goodsonsale/delete", data);
                }).catch(() => {
                });
            },
            operateAjax(url, data) {
                this.loading = true;
                this.$axios({
                    method: "post",
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
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/goodsonsale/list",
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
            fetchDownTime() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goodsonsale/downTime"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.downTime = response.data.downTime;
                    }
                }).catch(() => {
                });
            },
            /*******  新增 编辑 对话框  *******/
            fetchSuppliers() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/supplycompanies/unauth"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.addDialog.suppliers = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchGoods() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/desc/list",
                    params: {
                        supplyCompanyId: this.addDialog.model.supplyCompanyId
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.addDialog.goods = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchProvince() {
                if (this.addDialog.provinces.length) {
                    return;
                }
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/commons/cities"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        let all = [{
                            cityId: -1,
                            cityName: '全国'
                        }];
                        this.addDialog.provinces = all.concat(response.data || []);
                    }
                }).catch(() => {
                });
            },
            supplierChange() {
                this.addDialog.model.goodsId = '';
                this.addDialog.goods = [];
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate("goodsId");
                });
                if (this.addDialog.model.supplyCompanyId) {
                    this.fetchGoods();
                }
            },
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
                let data = this.$copyFields(this.formFields, this.addDialog.model, null);
                data.upTime = this.$moment(this.addDialog.model.upTime).format("YYYY-MM-DD HH:mm:ss");
                data.price = Math.round(data.price * 100);
                // 编辑
                if (this.addDialog.model.id) {
                    data.provinceId = data.provinceIds[0];
                    delete data.provinceIds;
                }
                // 新增，处理省份全选
                else if (data.provinceIds.includes(-1)) {
                    data.provinceIds = this.addDialog.provinces.slice(1).map((item) => {
                        return item.cityId;
                    });
                }
                this.$axios({
                    method: "post",
                    url: this.$basePath + (this.addDialog.model.id ? "/admin/custom/service/goodsonsale/edit" : "/admin/custom/service/goodsonsale/save"),
                    data: data
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
            /*******  调价 对话框  *******/
            variance(newValue, oldValue) {
                let variance = Math.round((newValue - oldValue) / oldValue * 10000) / 100;
                if (Number.isFinite(variance)) {
                    return variance;
                }
            },
            adjustConfirm() {
                this.$refs.adjustForm.validate((valid) => {
                    if (valid) {
                        this.adjustSubmit();
                    } else {
                        return false;
                    }
                });
            },
            adjustSubmit() {
                this.loading = true;
                let data = this.$copyFields(this.formFields, this.adjustDialog.currentRow, null);
                data.price = Math.round(this.adjustDialog.price * 100);
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/goodsonsale/save",
                    data: data
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.adjustDialog.visible = false;
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.page.currentPage = 1;
                        this.fetchList();
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        mounted: function () {
            this.fetchList();
            this.fetchDownTime();
        }
    }
</script>

<style scoped lang="less">
    .el-input {
        width: 215px;
    }

    .up {
        color: #F56C6C;
    }

    .down {
        color: #67C23A;
    }
</style>
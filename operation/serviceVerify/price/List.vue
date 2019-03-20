<template>
    <div class="supplier-verify-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">价格审核</span>
            <el-input placeholder="按供应商名称查询" v-model="filter.queryString" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-filter">
            <el-form :inline="true">
                <el-form-item label="审核状态：">
                    <el-select v-model="filter.auditState" clearable placeholder="全部" @change="filterChange">
                        <el-option v-for="item in filter.states" :key="item.value" :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data" @selection-change="selectionChange">
                <el-table-column type="selection" width="50" :selectable="selectable"></el-table-column>
                <el-table-column prop="id" label="价格方案ID" width="140"></el-table-column>
                <el-table-column prop="supplyId" label="供应商ID" width="100"></el-table-column>
                <el-table-column prop="supplyName" label="供应商名称" width="90"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" width="100"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                <el-table-column prop="province" label="供应省份"></el-table-column>
                <el-table-column label="库提价" width="80px">
                    <template slot-scope="scope">
                        {{isFinite(parseFloat(scope.row.price)) ? '¥ ' + scope.row.price / 100 : scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column prop="settlementType" label="结算方式" width="80"></el-table-column>
                <el-table-column prop="upTime" label="上架时间" width="160"></el-table-column>
                <el-table-column prop="downTime" label="下架时间" width="160"></el-table-column>
                <el-table-column prop="checkTime" label="审核时间" width="160"></el-table-column>
                <el-table-column prop="checkUserName" label="审核人"></el-table-column>
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button type="text" @click="verify([scope.row])" v-if="[0,1].includes(scope.row.checkState)">审核
                        </el-button>
                        <span v-else>{{stateMap[scope.row.checkState]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <div class="batch-operations">
                <el-button type="text" @click="verify(batch.targets)" :disabled="!batch.targets.length">批量审核</el-button>
            </div>
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="审核" :visible.sync="verifyDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="verifyDialog.model" ref="verifyForm" :rules="validate" label-width="100px">
                <el-form-item label="审核结果：">
                    <el-radio v-model="verifyDialog.model.auditResult" :label="2">通过</el-radio>
                    <el-radio v-model="verifyDialog.model.auditResult" :label="3">不通过</el-radio>
                </el-form-item>
                <el-form-item label="拒绝理由：" v-if="verifyDialog.model.auditResult == 3">
                    信息错误
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="verifyDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="verifyConfirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            let stateMap = {
                1: '待审核',
                2: '已审核',
                3: '未通过'
            };
            return {
                loading: false,
                stateMap: stateMap,
                filter: {
                    queryString: "",
                    states: Object.keys(stateMap).map((item)=>{
                        return {
                            value: item,
                            label: stateMap[item]
                        }
                    }),
                    auditState: '',
                    applyTime: '',
                    auditTime: '',
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
                    targets: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                verifyDialog: {
                    visible: false,
                    model: {
                        ids: [],
                        auditResult: 2
                    }
                },
                validate: {
                }
            }
        },
        watch: {},
        computed: {
            formFields: function () {
                let fields = [];
                for (let field in this.verifyDialog.model) {
                    fields.push(field);
                }
                return fields;
            }
        },
        methods: {
            search() {
                this.page.currentPage = 1;
                this.fetchList();
            },
            filterChange() {
                this.page.currentPage = 1;
                this.filter.queryString = "";  // 过滤时不带关键字搜索，让页面显示与实际参数一致
                this.fetchList();
            },
            selectable(row, index) {
                return [0,1].includes(row.checkState);
            },
            showCarousel(row, activeIndex) {
                this.carousel.visible = true;
                this.carousel.images.forEach((item) => {
                    item.src = row[item.key];
                });
                this.$nextTick(function () {
                    this.carousel.activeIndex = activeIndex;
                });
            },
            verify(targets) {
                let ids = targets.map((item) => {
                    return item.id;
                });
                this.verifyDialog.visible = true;
                this.$copyFields(this.formFields, {
                    ids: ids,
                    auditResult: 2
                }, this.verifyDialog.model);
                this.$nextTick(function () {
                    this.$refs.verifyForm.clearValidate();
                });
            },
            selectionChange(selection) {
                this.batch.targets = selection;
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/audit/goods",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {
                        searchKey: this.filter.queryString,
                        checkState: this.filter.auditState
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
            /*******  审核 对话框  *******/
            verifyConfirm() {
                this.$refs.verifyForm.validate((valid) => {
                    if (valid) {
                        this.submit();
                    } else {
                        return false;
                    }
                });
            },
            submit() {
                this.loading = true;
                let data = this.$copyFields(this.formFields, this.verifyDialog.model, null);
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/custom/service/goods/audit",
                    data: data
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.verifyDialog.visible = false;
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
    .table-image {
        cursor: pointer;
    }
</style>
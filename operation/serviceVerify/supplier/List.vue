<template>
    <div class="supplier-verify-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">供应商审核</span>
            <el-input placeholder="按申请人手机号查询" v-model="filter.queryString" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-filter">
            <el-form :inline="true">
                <el-form-item label="申请时间：">
                    <el-date-picker v-model="filter.applyTime" align="right" type="date" placeholder="选择日期"
                                    :picker-options="filter.pickerOptions" @change="filterChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核时间：">
                    <el-date-picker v-model="filter.auditTime" align="right" type="date" placeholder="选择日期"
                                    :picker-options="filter.pickerOptions" @change="filterChange">
                    </el-date-picker>
                </el-form-item>
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
                <el-table-column prop="companyName" label="公司名称"></el-table-column>
                <el-table-column prop="corporation" label="公司法定代表人"></el-table-column>
                <el-table-column prop="companyAddress" label="公司地址"></el-table-column>
                <el-table-column prop="companyLicence" label="统一社会信用代码"></el-table-column>
                <el-table-column label="公司营业执照照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.companyLicencePic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 0)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="saleLicence" label="成品油批发执照代码"></el-table-column>
                <el-table-column label="成品油批发执照照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.saleLicencePic + '!S70'" class="table-image" @click="showCarousel(scope.row, 1)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="danSaleLicense" label="危化品经营证代码"></el-table-column>
                <el-table-column label="危化品经营证照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.danSaleLicensePic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 2)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="bankOpenId" label="银行开户许可证ID"></el-table-column>
                <el-table-column label="银行开户许可证照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.bankOpenPic + '!S70'" class="table-image" @click="showCarousel(scope.row, 3)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="corCertId" label="法定代表人身份证号"></el-table-column>
                <el-table-column label="法定代表人身份证照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.corCertPic + '!S70'" class="table-image" @click="showCarousel(scope.row, 4)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="业务联系人"></el-table-column>
                <el-table-column prop="userPhone" label="联系人电话" width="120"></el-table-column>
                <el-table-column prop="position" label="职位" width="50"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间" width="160"></el-table-column>
                <el-table-column prop="auditStateStr" label="审核状态" width="80"></el-table-column>
                <el-table-column prop="auditTime" label="审核时间" width="160"></el-table-column>
                <el-table-column prop="auditUserName" label="审核人"></el-table-column>
                <el-table-column label="操作" width="50">
                    <template slot-scope="scope">
                        <el-button type="text" @click="verify([scope.row])" v-if="scope.row.auditState == 1">审核
                        </el-button>
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
        <dialog-carousel :visible.sync="carousel.visible" :images="carousel.images"
                         :active-index="carousel.activeIndex"></dialog-carousel>
        <el-dialog title="审核" :visible.sync="verifyDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="verifyDialog.model" ref="verifyForm" :rules="validate" label-width="100px">
                <el-form-item label="审核结果：">
                    <el-radio v-model="verifyDialog.model.auditResult" :label="2">通过</el-radio>
                    <el-radio v-model="verifyDialog.model.auditResult" :label="3">不通过</el-radio>
                </el-form-item>
                <el-form-item label="拒绝理由：" prop="refuseReason" v-if="verifyDialog.model.auditResult == 3">
                    <el-checkbox-group v-model="verifyDialog.model.refuseReason">
                        <el-checkbox label="资料不全"></el-checkbox>
                        <el-checkbox label="信息错误"></el-checkbox>
                        <el-checkbox label="图片看不清"></el-checkbox>
                    </el-checkbox-group>
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
    import DialogCarousel from "../../../components/DialogCarousel"

    export default {
        components: {
            "dialog-carousel": DialogCarousel
        },
        data() {
            return {
                loading: false,
                filter: {
                    queryString: "",
                    states: [
                        {
                            value: 1,
                            label: '待审核'
                        },
                        {
                            value: 2,
                            label: '已审核'
                        },
                        {
                            value: 3,
                            label: '未通过'
                        }
                    ],
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
                carousel: {
                    visible: false,
                    activeIndex: 0,
                    images: [
                        {
                            label: '营业执照',
                            key: 'companyLicencePic',
                            src: ''
                        },
                        {
                            label: '成品油批发执照',
                            key: 'saleLicencePic',
                            src: ''
                        },
                        {
                            label: '危化品经营证照',
                            key: 'danSaleLicensePic',
                            src: ''
                        },
                        {
                            label: '银行开户许可证',
                            key: 'bankOpenPic',
                            src: ''
                        },
                        {
                            label: '法定代表人身份证',
                            key: 'corCertPic',
                            src: ''
                        }
                    ]
                },
                verifyDialog: {
                    visible: false,
                    model: {
                        ids: [],
                        auditResult: 2,
                        refuseReason: []
                    }
                },
                validate: {
                    refuseReason: [
                        {required: true, message: '请选择拒绝理由'}
                    ]
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
                return row.auditState == 1;
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
                    return item.userId;
                });
                this.verifyDialog.visible = true;
                this.$copyFields(this.formFields, {
                    ids: ids,
                    auditResult: 2,
                    refuseReason: []
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
                    url: this.$basePath + "/admin/custom/service/audit/suppliers",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {
                        queryString: this.filter.queryString,
                        applyTime: this.filter.applyTime && this.$moment(this.filter.applyTime).format("YYYY-MM-DD"),
                        auditTime: this.filter.auditTime && this.$moment(this.filter.auditTime).format("YYYY-MM-DD"),
                        auditState: this.filter.auditState
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
                data.refuseReason = data.refuseReason.join(',');
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/custom/service/suppliers/audit",
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
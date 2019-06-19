<template>
    <div class="tip-off-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">退款申请</span>
            <el-input placeholder="客户、商户、订单ID" v-model="filter.query" class="input-with-select" clearable
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
                <el-table-column prop="customerId" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户"></el-table-column>
                <el-table-column prop="merchantId" label="商户ID"></el-table-column>
                <el-table-column prop="merchantName" label="商户"></el-table-column>
                <el-table-column prop="productId" label="商品ID"></el-table-column>
                <el-table-column prop="productName" label="商品"></el-table-column>
                <el-table-column prop="orderId" label="订单ID"></el-table-column>
                <el-table-column label="退款类型">
                    <template slot-scope="scope">
                        {{typeMap[scope.row.type]}}
                    </template>
                </el-table-column>
                <el-table-column label="申请详情">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover" :content="scope.row.detail">
                            <el-button slot="reference" type="text" v-if="scope.row.detail">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="申请时间"></el-table-column>
                <el-table-column label="回复记录">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover" v-if="showRecord(scope.row.recordList, 'reply')">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div v-for="item in scope.row.recordList" v-if="item.type=='reply'">
                                {{item.operator}} {{item.time}}: {{item.detail}}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="处理记录">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover" v-if="showRecord(scope.row.recordList, 'conduct')">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div v-for="item in scope.row.recordList" v-if="item.type=='conduct'">
                                {{item.operator}} {{item.time}} {{displayStatus(item.reportStatus)}} {{item.detail && (' : '+item.detail)}}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{displayStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="reply(scope.row)">回复</el-button>
                        <el-button type="text" @click="accept(scope.row)" v-if="scope.row.status == 'pending'">受理
                        </el-button>
                        <el-button type="text" @click="conduct(scope.row)" v-if="scope.row.status == 'handling'">处理
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
        <el-dialog title="回复" :visible.sync="replyDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="replyDialog.model" ref="replyForm" :rules="rules" label-width="0">
                <el-form-item label="" prop="reply">
                    <el-input type="textarea" :rows="4" placeholder="请输入回复给客户的内容"
                              v-model="replyDialog.model.reply" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="replyDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="replyConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="处理" :visible.sync="conductDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="conductDialog.model" ref="conductForm" :rules="rules" label-width="0">
                <el-form-item label="" prop="status">
                    <el-radio-group v-model="conductDialog.model.status">
                        <el-radio :label="item.value" v-for="(item, index) in conductDialog.handles" :key="index">
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="detail">
                    <el-input type="textarea" :rows="4" placeholder="请输入处理理由"
                              v-model="conductDialog.model.detail" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="conductDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="conductConfirm">确 认</el-button>
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
                    status: '',
                    statusList: [
                        {
                            value: 'pending',
                            label: '待受理'
                        },
                        {
                            value: 'handling',
                            label: '受理中'
                        },
                        {
                            value: 'refunded',
                            label: '已退款'
                        },
                        {
                            value: 'refused',
                            label: '已拒绝'
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
                typeMap: {
                    outOfContact: '联系不上趣导',
                    denialOfService: '趣导拒绝提供服务',
                    other: '其他'
                },
                replyDialog: {
                    visible: false,
                    model: {
                        id: '',
                        reply: ''
                    }
                },
                conductDialog: {
                    visible: false,
                    handles: [
                        {
                            value: 'refunded',
                            label: '已退款'
                        },
                        {
                            value: 'refused',
                            label: '拒绝'
                        }
                    ],
                    model: {
                        id: '',
                        status: '',
                        detail: ''
                    }
                },
                rules: {
                    reply: [
                        {required: true, message: '请填写内容'}
                    ],
                    status: [
                        {required: true, message: '请选择'}
                    ],
                    detail: [
                        {required: true, message: '请填写内容'}
                    ]
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
            showRecord(recordList, type){
                let typeRecord = recordList.find((item)=>{
                    return item.type == type;
                });
                return !!typeRecord;
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/refund",
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
            accept(row) {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/refund/" + row.id + "/accept"
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
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
            /*******  回复 对话框 *******/
            reply(row) {
                this.replyDialog.visible = true;
                this.replyDialog.model.id = row.id;
                this.replyDialog.model.reply = '';
                this.$nextTick(function () {
                    this.$refs.replyForm.clearValidate();
                });
            },
            replyConfirm() {
                this.$refs.replyForm.validate((valid) => {
                    if (valid) {
                        this.replySubmit();
                    } else {
                        return false;
                    }
                });
            },
            replySubmit() {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/refund/" + this.replyDialog.model.id + "/reply",
                    data: {
                        detail: this.replyDialog.model.reply
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.replyDialog.visible = false;
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
            /*******  处理 对话框 *******/
            conduct(row) {
                this.conductDialog.visible = true;
                this.conductDialog.model.id = row.id;
                this.conductDialog.model.detail = '';
                this.conductDialog.model.status = '';
                this.$nextTick(function () {
                    this.$refs.conductForm.clearValidate();
                });
            },
            conductConfirm() {
                this.$refs.conductForm.validate((valid) => {
                    if (valid) {
                        this.conductSubmit();
                    } else {
                        return false;
                    }
                });
            },
            conductSubmit() {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/refund/" + this.conductDialog.model.id + "/conduct",
                    data: {
                        reportStatus: this.conductDialog.model.status,
                        detail: this.conductDialog.model.detail
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.conductDialog.visible = false;
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
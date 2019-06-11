<template>
    <div class="tip-off-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">客户留言</span>
            <el-input placeholder="按客户ID或昵称查询" v-model="filter.query" class="input-with-select" clearable
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
                <el-table-column prop="customerNick" label="客户昵称"></el-table-column>
                <el-table-column label="内容">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover" :content="scope.row.detail">
                            <el-button slot="reference" type="text" v-if="scope.row.detail">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="留言时间"></el-table-column>
                <el-table-column label="回复记录">
                    <template slot-scope="scope" v-if="scope.row.replyList.length">
                        <el-popover placement="left" trigger="hover">
                            <div v-for="item in scope.row.replyList">
                                {{item.operator}} {{item.time}}: {{item.detail}}
                            </div>
                            <el-button slot="reference" type="text">查看</el-button>
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
                    status: 'pending',
                    statusList: [
                        {
                            value: 'pending',
                            label: '未回复'
                        },
                        {
                            value: 'replied',
                            label: '已回复'
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
                replyDialog: {
                    visible: false,
                    model: {
                        id: '',
                        reply: ''
                    }
                },
                rules: {
                    reply: [
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
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/message",
                    params: {
                        pageSize: 10,
                        pageNum: this.page.currentPage,
                        search: this.filter.query,
                        status: this.filter.status
                    },
                    data: {}
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
                    url: this.$basePath + "/admin/message/" + this.replyDialog.model.id + "/reply",
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
            }
        },
        mounted: function () {
            this.fetchList();
        }
    }
</script>

<style scoped lang="less">
</style>
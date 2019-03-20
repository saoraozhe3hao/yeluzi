<template>
    <div class="commodity-management-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">品牌管理</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="showDialog">新建</el-button>
            <el-input placeholder="按品牌名称查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data" @selection-change="selectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="createdTime" label="修改时间"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)">编辑</el-button>
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
        <el-dialog :title="addDialog.model.id ? '编辑商品':'添加商品'" :visible.sync="addDialog.visible" width="500px"
                   :close-on-click-modal="false">
            <el-form :model="addDialog.model" ref="addForm" :rules="validate" label-width="100px">
                <el-form-item label="油品品牌：" prop="name">
                    <el-input v-model="addDialog.model.name" maxlength="20" placeholder=""></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 认</el-button>
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
                },
                table: {
                    data: []
                },
                batch: {
                    operations: [
                        {
                            label: "删除",
                            url: "/admin/goods/sources/delete",
                            method: 'post',
                            fieldName: 'ids'
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
                        name: ''
                    }
                },
                validate: {
                    name: [
                        {required: true, message: '请填写'}
                    ]
                }
            }
        },
        computed: {},
        watch: {},
        methods: {
            search() {
                this.page.currentPage = 1;
                this.fetchList();
            },
            showDialog() {
                this.addDialog.visible = true;
                // 清空
                this.addDialog.model = this.$copyFields(Object.keys(this.addDialog.model), null, this.addDialog.model);
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate();
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
                    url: this.$basePath + "/admin/goods/sources/list",
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
            edit(row) {
                this.showDialog();
                // 回填
                this.$copyFields(Object.keys(this.addDialog.model), row, this.addDialog.model);
            },
            /*******  新增 编辑 对话框  *******/
            confirm() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.submit();
                    } else {
                        return false;
                    }
                });
            },
            submit() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + '/admin/goods/sources/save',
                    data: this.addDialog.model
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
            }
        },
        mounted: function () {
            this.fetchList();
        }
    }
</script>

<style scoped lang="less">
</style>
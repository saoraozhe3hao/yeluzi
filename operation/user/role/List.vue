<template>
    <div class="role-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">运营角色</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="add">新增角色</el-button>
            <el-input placeholder="按名称查询" v-model="filter.query" class="input-with-select" clearable @clear="search"
                      @keyup.enter.native="search">
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
            <el-table :data="table.data" @selection-change="selectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="权限">
                    <template slot-scope="scope">
                        {{displayAuthorities(scope.row.authorities)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{displayStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)">修改</el-button>
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
        <el-dialog title="新增角色" :visible.sync="addDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="form" ref="addForm" :rules="rules" label-width="100px">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="form.name" maxlength="8" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="权限：" prop="authorities">
                    <el-select v-model="form.authorities" filterable placeholder="请选择" multiple>
                        <el-option v-for="item in allAuthorities" :key="item.id" :value="item.id"
                                   :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑角色" :visible.sync="editDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="form" ref="editForm" :rules="rules" label-width="100px">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="form.name" maxlength="11" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="authorities">
                    <el-select v-model="form.authorities" filterable placeholder="请选择" multiple
                               @keyup.enter.native="editConfirm">
                        <el-option v-for="item in allAuthorities" :key="item.id" :value="item.id"
                                   :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import BatchOperation from "../../../components/BatchOperation"

    export default {
        components: {
            'batch-operation': BatchOperation
        },
        data() {
            return {
                loading: false,
                filter: {
                    query: '',
                    status: 'normal',
                    statusList: [
                        {
                            value: 'normal',
                            label: '正常'
                        },
                        {
                            value: 'disabled',
                            label: '停用'
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
                batch: {
                    operations: [
                        {
                            label: "启用",
                            url: "/admin/role/enable",
                            method: 'put'
                        },
                        {
                            label: "停用",
                            url: "/admin/role/disable",
                            method: 'put'
                        }
                    ],
                    targets: []
                },
                addDialog: {
                    visible: false
                },
                editDialog: {
                    visible: false
                },
                allAuthorities: [],
                form: {
                    id: '',
                    name: '',
                    authorities: []
                },
                rules: {
                    name: this.$validation.fullName,
                    authorities: [
                        {required: true, message: '请选择权限'}
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
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/role",
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
            displayAuthorities(authorities) {
                let labels = authorities.map((item) => {
                    return item.label;
                });
                return labels.join(',');
            },
            displayStatus(status) {
                let item = this.filter.statusList.find((item) => {
                    return item.value === status;
                });
                return item && item.label;
            },
            selectionChange(selection) {
                this.batch.targets = selection.map((item) => {
                    return item.id;
                });
            },
            fetchAuthorities() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/role/authority"
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response) {
                        this.allAuthorities = response.data;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            /*******  新增 对话框  *******/
            add() {
                this.$copyFields(Object.keys(this.form), null, this.form);
                this.addDialog.visible = true;
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate();
                });
                this.fetchAuthorities();
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
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/role",
                    data: {
                        name: this.form.name,
                        authorityIds: this.form.authorities
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
            /*******  编辑 对话框  *******/
            edit(row) {
                this.form.id = row.id;
                this.form.name = row.name;
                this.form.authorities = row.authorities.map((item) => {
                    return item.id;
                });
                this.editDialog.visible = true;
                this.fetchAuthorities();
            },
            editConfirm() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.editSubmit();
                    } else {
                        return false;
                    }
                });
            },
            editSubmit() {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/role/" + this.form.id,
                    data: {
                        name: this.form.name,
                        authorityIds: this.form.authorities
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.editDialog.visible = false;
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
    .role-list {
        .el-dialog {
            .el-select {
                width: 360px;
            }
        }
    }
</style>
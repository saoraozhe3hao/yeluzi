<template>
    <div class="operator-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">运营人员</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="add">新增人员</el-button>
            <el-input placeholder="按姓名或手机号查询" v-model="filter.query" class="input-with-select">
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
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="idNumber" label="身份证号"></el-table-column>
                <el-table-column prop="username" label="手机号(账号)"></el-table-column>
                <el-table-column label="角色">
                    <template slot-scope="scope">
                        {{displayRole(scope.row.roles)}}
                    </template>
                </el-table-column>
                <el-table-column prop="creator" label="创建人"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{statusMap[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="resetPwd(scope.row)">重置密码</el-button>
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
        <el-dialog title="新增人员" :visible.sync="addDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="form" ref="addForm" :rules="rules" label-width="100px">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="form.name" maxlength="8" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idNumber">
                    <el-input v-model="form.idNumber" maxlength="20" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="username">
                    <el-input v-model="form.username" maxlength="11" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="roles">
                    <el-select v-model="form.roles" filterable placeholder="请选择" multiple>
                        <el-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录密码：" prop="password">
                    <el-input v-model="form.password" maxlength="16" placeholder="请输入" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码：" prop="repeatPwd">
                    <el-input v-model="form.repeatPwd" maxlength="16" placeholder="请输入" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑人员" :visible.sync="editDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="form" ref="editForm" :rules="rules" label-width="100px">
                <el-form-item label="手机号：" prop="username">
                    <el-input v-model="form.username" maxlength="11" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="roles">
                    <el-select v-model="form.roles" filterable placeholder="请选择" multiple>
                        <el-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="重置密码" :visible.sync="resetDialog.visible" width="500px" :close-on-click-modal="false">
            <!-- 用ref.prop 去 校验 model.prop -->
            <el-form :model="form" ref="resetForm" :rules="rules" label-width="120px">
                <el-form-item label="新密码：" prop="password">
                    <el-input v-model="form.password" maxlength="16" placeholder="请输入" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码：" prop="repeatPwd">
                    <el-input v-model="form.repeatPwd" maxlength="16" placeholder="请输入" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="resetConfirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import BatchOperation from "../../../components/BatchOperation"
    import Md5 from 'md5'

    export default {
        components: {
            'batch-operation': BatchOperation,
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
                    data: [],
                    selection: []
                },
                statusMap: {
                    normal: '正常',
                    disabled: '停用'
                },
                batch: {
                    operations: [
                        {
                            label: "启用",
                            url: "/admin/operator/enable",
                            method: 'put'
                        },
                        {
                            label: "停用",
                            url: "/admin/operator/disable",
                            method: 'put'
                        }
                    ],
                    targets: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                roles: [],
                addDialog: {
                    visible: false
                },
                editDialog: {
                    visible: false
                },
                resetDialog: {
                    visible: false
                },
                form: {
                    id: '',
                    name: '',
                    idNumber: '',
                    username: '',
                    roles: [],
                    password: '',
                    repeatPwd: ''
                },
                rules: {
                    name: this.$validation.fullName,
                    idNumber: this.$validation.idNumber,
                    username: this.$validation.mobile,
                    password: this.$validation.password,
                    repeatPwd: this.$validation.repeatPwd.call(this, "form.password"),
                    roles: [
                        {required: true, message: '请选择角色'},
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
            filterChange(){
                this.filter.query = "";
                this.fetchList();
            },
            displayRole(roles) {
                let roleNames = roles.map((item) => {
                    return item.name;
                });
                return roleNames.join(',');
            },
            selectionChange(selection) {
                this.batch.targets = selection.map((item) => {
                    return item.id;
                });
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/operator",
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
            fetchRoles() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/operator/role"
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response) {
                        this.roles = response.data;
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
                this.fetchRoles();
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
                    url: this.$basePath + "/admin/operator",
                    data: {
                        name: this.form.name,
                        idNumber: this.form.idNumber,
                        username: this.form.username,
                        roleIds: this.form.roles,
                        pwd: Md5(this.form.password)
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
                this.form.username = row.username;
                this.form.roles = row.roles.map((item) => {
                    return item.id;
                });
                this.editDialog.visible = true;
                this.fetchRoles();
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
                    url: this.$basePath + "/admin/operator/" + this.form.id,
                    data: {
                        username: this.form.username,
                        roleIds: this.form.roles
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
            },
            /*******  重置密码 对话框  *******/
            resetPwd(row) {
                this.form.id = row.id;
                this.form.password = '';
                this.form.repeatPwd = '';
                this.resetDialog.visible = true;
                this.$nextTick(function () {
                    this.$refs.resetForm.clearValidate();
                });
            },
            resetConfirm() {
                this.$refs.resetForm.validate((valid) => {
                    if (valid) {
                        this.resetSubmit();
                    } else {
                        return false;
                    }
                });
            },
            resetSubmit() {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/operator/" + this.form.id + "/password",
                    data: {
                        password: Md5(this.form.password)
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.resetDialog.visible = false;
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
    .operator-list {
        .el-dialog {
            .el-select {
                width: 360px;
            }
        }
    }
</style>
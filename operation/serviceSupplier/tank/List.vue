<template>
    <div class="tank-list"  v-loading="loading">
        <div class="list-top">
            <span class="page-title">油库地址</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="addOne">新建</el-button>
            <el-input placeholder="按油库名称查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table :data="table.data">
                <el-table-column prop="supplyCompanyId" label="供应商ID" width="100"></el-table-column>
                <el-table-column prop="supplyCompanyName" label="供应商名称"></el-table-column>
                <el-table-column prop="id" label="油库ID" width="70"></el-table-column>
                <el-table-column prop="name" label="油库名称"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="contacts" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="电话" width="140"></el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="添加油库" :visible.sync="addDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="addDialog.model" ref="addForm" :rules="validate" label-width="100px">
                <el-form-item label="供应商：" prop="supplyCompanyId">
                    <el-select v-model="addDialog.model.supplyCompanyId" clearable placeholder="选择供应商">
                        <el-option v-for="item in addDialog.suppliers" :key="item.id" :value="item.id"
                                   :label="item.companyName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="油库名称：" prop="name">
                    <el-input v-model="addDialog.model.name" maxlength="30" placeholder="油库名称"></el-input>
                </el-form-item>
                <el-form-item label="地址：" prop="address">
                    <el-input v-model="addDialog.model.address" maxlength="100" placeholder="地址"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="contacts">
                    <el-input v-model="addDialog.model.contacts" maxlength="8" placeholder="联系人"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone">
                    <el-input v-model="addDialog.model.phone" maxlength="13" placeholder="电话"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data () {
            return {
                loading: false,
                filter: {
                    searchKey: ''
                },
                table: {
                    data: [],
                    selection: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                addDialog: {
                    visible: false,
                    suppliers: [],
                    model: {
                        supplyCompanyId: '',
                        name: '',
                        contacts: '',
                        phone: '',
                        address: ''
                    }
                },
                validate: {
                    supplyCompanyId: [
                        {required: true, message: '请输入选择'},
                    ],
                    name: this.$validation.name,
                    contacts: this.$validation.fullName,
                    phone: this.$validation.phone,
                    address: this.$validation.address
                }
            }
        },
        watch: { },
        computed: {
            formFields: function () {
                let fields = [];
                for(let field in this.addDialog.model){
                    fields.push(field);
                }
                return fields;
            }
        },
        methods: {
            search(){
                this.page.currentPage = 1;
                this.fetchList();
            },
            addOne(){
                this.addDialog.visible = true;
                this.$copyFields(this.formFields, null, this.addDialog.model);
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate();
                });
                this.fetchSuppliers();
            },
            fetchList(){
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/oildepots",
                    params:{
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data:{
                        searchKey: this.filter.searchKey
                    }
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if(response){
                        this.table.data = response.data || [];
                        this.page.totalCount = response.recordsTotal;
                    }
                }).catch(()=>{
                    this.loading = false;
                });
            },
            /*******  新增 对话框  *******/
            fetchSuppliers(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/supplycompanies/unauth"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.suppliers = response.data || [];
                    }
                }).catch(()=>{
                });
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
            addSubmit(){
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/oildepot/save",
                    data: this.addDialog.model
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if(response.code == "0"){
                        this.addDialog.visible = false;
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.fetchList();
                    }
                }).catch(()=>{
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
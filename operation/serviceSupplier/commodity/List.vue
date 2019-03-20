<template>
    <div class="commodity-management-list"  v-loading="loading">
        <div class="list-top">
            <span class="page-title">商品管理</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="showDialog">新建</el-button>
            <el-input placeholder="按商品名称或ID查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="supplyCompanyId" label="供应商ID" width="100"></el-table-column>
                <el-table-column prop="supplyCompanyName" label="供应商名称"></el-table-column>
                <el-table-column prop="id" label="ID" width="100px"></el-table-column>
                <el-table-column prop="type" label="种类" width="70px"></el-table-column>
                <el-table-column prop="code" label="商品" width="90px"></el-table-column>
                <el-table-column prop="level" label="级别" width="70px"></el-table-column>
                <el-table-column prop="source" label="品牌" width="70px"></el-table-column>
                <el-table-column prop="oilDepot" label="油库"></el-table-column>
                <el-table-column prop="modifiedTime" label="修改时间" width="160px"></el-table-column>
                <el-table-column prop="modifier" label="修改人"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <el-dialog :title="addDialog.model.id ? '编辑商品':'添加商品'" :visible.sync="addDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="addDialog.model" ref="addForm" :rules="validate" label-width="100px">
                <el-form-item label="供应商：" prop="supplyCompanyId">
                    <el-select v-model="addDialog.model.supplyCompanyId" clearable placeholder="选择供应商" @change="supplierChange">
                        <el-option v-for="item in addDialog.suppliers" :key="item.id" :value="item.id"
                                   :label="item.companyName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="种类：" prop="type">
                    <el-select v-model="addDialog.model.type" placeholder="请选择" @change="typeChange">
                        <el-option v-for="item in addDialog.types" :key="item.typeId" :label="item.typeName" :value="item.typeName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标号：" prop="code">
                    <el-select v-model="addDialog.model.code" placeholder="请选择">
                        <el-option v-for="(item,index) in addDialog.codes" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="级别：" prop="level">
                    <el-select v-model="addDialog.model.level" placeholder="请选择">
                        <el-option v-for="(item,index) in addDialog.levels" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌：" prop="source">
                    <el-select v-model="addDialog.model.source" placeholder="请选择">
                        <el-option v-for="(item,index) in addDialog.sources" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="油库：" prop="oilDepotId">
                    <el-select v-model="addDialog.model.oilDepotId" placeholder="请选择">
                        <el-option v-for="item in addDialog.depots" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
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
    export default {
        components: {        },
        data () {
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
                addDialog:{
                    visible: false,
                    model: {
                        id: '',
                        supplyCompanyId: '',
                        type: '',
                        code: '',
                        level: '',
                        source: '',
                        oilDepotId: ''
                    },
                    suppliers: [],
                    types: [],
                    codes: [],
                    levels: [],
                    sources: [],
                    depots: []
                },
                validate: {
                    supplyCompanyId: [
                        {required: true, message: '请输入选择'},
                    ],
                    type: [
                        {required: true, message: '请选择'}
                    ],
                    code: [
                        {required: true, message: '请选择'}
                    ],
                    level: [
                        {required: true, message: '请选择'}
                    ],
                    source: [
                        {required: true, message: '请选择'}
                    ],
                    oilDepotId: [
                        {required: true, message: '请选择'}
                    ]
                }
            }
        },
        computed: {
            formFields: function () {
                let fields = [];
                for(let field in this.addDialog.model){
                    fields.push(field);
                }
                return fields;
            }
        },
        watch: { },
        methods: {
            search(){
                this.page.currentPage = 1;
                this.fetchList();
            },
            showDialog(){
                this.addDialog.visible = true;
                this.fetchSuppliers();
                this.fetchTypes();
                this.fetchLevels();
                this.fetchSources();
                // 清空
                this.addDialog.model = this.$copyFields(this.formFields, null, this.addDialog.model);
                this.addDialog.codes = [];
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate();
                });
            },
            fetchList(){
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/goods/list",
                    params:{
                        length: 10,
                        start: (this.page.currentPage - 1) * 10
                    },
                    data: {
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
            edit(row){
                this.showDialog();
                // 回填
                this.$copyFields(this.formFields, row, this.addDialog.model);
            },
            /*******  新增 编辑 对话框  *******/
            fetchSuppliers(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/supplycompanies/unauth"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.suppliers = response.data || [];
                        if(this.addDialog.model.supplyCompanyId){
                            this.fetchDepots();
                        }
                    }
                }).catch(()=>{
                });
            },
            fetchTypes(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/types"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.types = response.data || [];
                        if(this.addDialog.model.type){
                            this.fetchCodes();
                        }
                    }
                }).catch(()=>{});
            },
            findTypeId(typeName){
                let type = this.addDialog.types.find((item)=>{
                    return item.typeName == typeName;
                });
                return type.typeId;
            },
            fetchCodes(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/codes",
                    params: {
                        typeId: this.findTypeId(this.addDialog.model.type)
                    }
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.codes = response.data || [];
                    }
                }).catch(()=>{});
            },
            fetchLevels(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/levels"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.levels = response.data || [];
                    }
                }).catch(()=>{});
            },
            fetchSources(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/sources"
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.sources = response.data || [];
                    }
                }).catch(()=>{});
            },
            fetchDepots(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/oildepotincompany",
                    params: {
                        supplyCompanyId: this.addDialog.model.supplyCompanyId
                    }
                }).then((response) => {
                    response = response.data;
                    if(response.code == 0){
                        this.addDialog.depots = response.data || [];
                    }
                }).catch(()=>{});
            },
            typeChange(){
                this.addDialog.model.code = '';
                this.addDialog.codes = [];
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate("code");
                });
                if(this.addDialog.model.type){
                    this.fetchCodes();
                }
            },
            supplierChange(){
                this.addDialog.model.oilDepotId = '';
                this.addDialog.depots = [];
                this.$nextTick(function () {
                    this.$refs.addForm.clearValidate("oilDepotId");
                });
                if(this.addDialog.model.supplyCompanyId){
                    this.fetchDepots();
                }
            },
            confirm() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.submit();
                    } else {
                        return false;
                    }
                });
            },
            submit(){
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + (this.addDialog.model.id ? "/admin/custom/service/goods/edit": "/admin/custom/service/goods/save"),
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
<template>
    <div class="supplier-basic-info" v-loading="loading">
        <div class="add-top">
            基本资料
        </div>
        <div class="add-form">
            <el-form ref="form" :model="myDetail" :label-position="'left'" label-width="100px">
                <el-form-item label="姓名：">
                    {{myDetail.name}}
                </el-form-item>
                <el-form-item label="手机号：">
                    {{myDetail.mobile}}
                </el-form-item>
                <el-form-item label="职位：">
                    {{myDetail.position}}
                </el-form-item>
                <el-form-item label="身份证照片：">
                    <img :src="myDetail.certPic" class="image"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="edit">编辑</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="编辑用户信息" :visible.sync="editDialog.visible"  width="500px" class="basic-info-dialog" :close-on-click-modal="false">
            <el-form :model="editDialog.model" ref="editForm" :rules="validate" label-width="100px">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="editDialog.model.name" maxlength="8" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    {{myDetail.mobile}}
                </el-form-item>
                <el-form-item label="职位：" prop="position">
                    <el-select v-model="editDialog.model.position" placeholder="请选择">
                        <el-option v-for="(item,index) in editDialog.positions" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                loading: false,
                editDialog: {
                    visible: false,
                    positions: [],
                    model: {
                        name: '',
                        position: ''
                    }
                },
                validate: {
                    name: this.$validation.fullName,
                    position: [
                        {required: true, message: '请输入'}
                    ]
                }
            }
        },
        computed: {
            myDetail: function() {
                return this.$store.state.myDetail || {};
            },
            formFields: function () {
                let fields = [];
                for(let field in this.editDialog.model){
                    fields.push(field);
                }
                return fields;
            }
        },
        watch: {},
        methods: {
            edit(){
                this.editDialog.visible = true;
                // 回填
                this.$copyFields(this.formFields, this.$store.state.myDetail, this.editDialog.model);
                this.fetchPositions();
            },
            /**    编辑 对话框      **/
            confirm() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.submit();
                    } else {
                        return false;
                    }
                });
            },
            fetchPositions() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/user/positions"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.editDialog.positions = response.data;
                    }
                }).catch((error) => {
                });
            },
            submit(){
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/user/message",
                    data: this.editDialog.model
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if(response.code == "0"){
                        this.editDialog.visible = false;
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.$copyFields(this.formFields, this.editDialog.model, this.$store.state.myDetail);
                        this.$store.commit("change");
                    }
                }).catch(()=>{
                    this.loading = false;
                });
            }
        },
        mounted: function () {

        }
    }
</script>

<style scoped lang="less">
    .image {
        width: 178px;
        height: auto;
        display: block;
    }
</style>
<style lang="less">
    .basic-info-dialog .el-select{
        width: 360px;
    }
</style>
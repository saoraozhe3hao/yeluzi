<template>
    <div class="order-management-add" v-loading="loading">
        <div class="add-top">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/service-order' }">订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>创建新订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row class="">
            <el-col :span="12">
                <div class="add-form">
                    <el-form ref="form" :model="form.model" :rules="validate" label-width="140px">
                        <el-form-item label="供应商名称：" prop="supplyCompanyId" v-if="!enquiry.supplyCompanyId">
                            <el-select v-model="form.model.supplyCompanyId" placeholder="请选择">
                                <el-option v-for="item in form.suppliers" :key="item.id" :value="item.id"
                                           :label="item.companyName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="供应商ID：">
                            {{form.model.supplyCompanyId}}
                        </el-form-item>
                        <el-form-item label="供应商名称：" v-if="enquiry.supplyCompanyId">
                            {{enquiry.supplyCompanyName}}
                        </el-form-item>
                        <el-form-item label="油站名称：" prop="stationName">
                            <el-input v-model="form.model.stationName" maxlength="20" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="油站地址：" prop="stationAddress">
                            <el-input v-model="form.model.stationAddress" maxlength="30" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人：" prop="contacts">
                            <el-input v-model="form.model.contacts" maxlength="8" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号：" prop="phone">
                            <el-input v-model="form.model.phone" maxlength="13" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="商品ID：" prop="goodsId">
                            <el-select v-model="form.model.goodsId" placeholder="请选择">
                                <el-option v-for="item in form.goods" :key="item.id" :value="item.id"
                                           :label="item.desc">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数量：" prop="amount">
                            <el-input v-model="form.model.amount" maxlength="6" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="单位：">
                            {{form.model.unit}}
                        </el-form-item>
                        <el-form-item label="价格类型：">
                            <el-radio v-model="form.model.priceType" label="库提价(有票)">库提价(有票)</el-radio>
                            <el-radio v-model="form.model.priceType" label="到站价">到站价</el-radio>
                        </el-form-item>
                        <el-form-item label="客户销售单价：" prop="memberPrice">
                            <el-input v-model="form.model.memberPrice" maxlength="8" placeholder="请输入"></el-input>
                            元
                        </el-form-item>
                        <el-form-item label="客户销售合计：">
                            {{memberMoney}} 元
                        </el-form-item>
                        <el-form-item label="供应商采购单价：" prop="companyPrice">
                            <el-input v-model="form.model.companyPrice" maxlength="8" placeholder="请输入"></el-input>
                            元
                        </el-form-item>
                        <el-form-item label="供应商采购合计：">
                            {{companyMoney}} 元
                        </el-form-item>
                        <el-form-item label="聚油网差价：">
                            {{gapMoney}} 元
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="validateForm">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12" class="right">
                <div>以往跟踪记录</div>
                <div v-for="item in records" class="records">
                    {{item.time}} <span>{{item.userName}}</span> {{item.operation}} <span>{{item.content}}</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                enquiry: {},
                records: [],
                form: {
                    suppliers: [],
                    goods: [],
                    model: {
                        inquiryId: '',
                        memberId: '',
                        supplyCompanyId: '',
                        stationName: '',
                        stationAddress: '',
                        contacts: '',
                        phone: '',
                        goodsId: '',
                        amount: '',
                        unit: '',
                        priceType: '',
                        memberPrice: '',
                        companyPrice: ''
                    }
                },
                validate: {
                    stationName: this.$validation.name,
                    stationAddress: this.$validation.address,
                    contacts: this.$validation.fullName,
                    phone: this.$validation.mobile,
                    supplyCompanyId: [
                        {required: true, message: '请选择'}
                    ],
                    goodsId: [
                        {required: true, message: '请选择'}
                    ],
                    amount: [
                        {required: true, message: '请填写数量', trigger: "blur"},
                        {pattern: /^\d{1,3}(\.\d{1,2})?$/, message: '请输入整数或2位小数，整数部分最多3位', trigger: "blur"}
                    ],
                    memberPrice: this.$validation.price,
                    companyPrice: this.$validation.price
                }
            }
        },
        computed: {
            memberMoney: function(){
                let orderMoney = this.form.model.memberPrice * this.form.model.amount || "";
                return orderMoney && Math.round(orderMoney * 100) / 100;
            },
            companyMoney: function(){
                let orderMoney = this.form.model.companyPrice * this.form.model.amount || "";
                return orderMoney && Math.round(orderMoney * 100) / 100;
            },
            gapMoney: function(){
                if(!this.memberMoney || !this.companyMoney){
                    return "";
                }
                let gap = this.memberMoney - this.companyMoney;
                return Math.round(gap * 100) / 100;
            }
        },
        watch: {
            "form.model.supplyCompanyId": function (val,oldVal) {
                if(oldVal){
                    this.form.model.goodsId = "";
                }
                this.fetchGoods();
            }
        },
        methods: {
            validateForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submit();
                    }
                });
            },
            submit() {
                this.loading = true;
                let data = this.$copyFields(Object.keys(this.form.model), this.form.model);
                data.memberPrice = Math.round(data.memberPrice * 100);
                data.companyPrice = Math.round(data.companyPrice * 100);
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/order",
                    data: data
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.$router.push({path: '/service-order'});
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            fetchDetail() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/inquiry/" + this.$route.query.enquiryId
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.enquiry = response.data;
                        this.$copyFields(Object.keys(this.form.model), response.data, this.form.model);
                        this.form.model.memberPrice = response.data.price >= 0 ? response.data.price / 100 : "";
                        if(!response.data.supplyCompanyId){
                            this.fetchSuppliers();
                        }
                    }
                });
            },
            fetchSuppliers() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/supplycompanies"
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.form.suppliers = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchGoods() {
                if(!this.form.model.supplyCompanyId){
                    return;
                }
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/goods/desc/list",
                    params: {
                        supplyCompanyId: this.form.model.supplyCompanyId
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == 0) {
                        this.form.goods = response.data || [];
                    }
                }).catch(() => {
                });
            },
            fetchRecords() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/inquiry/" + this.$route.query.enquiryId + "/records"
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response) {
                        this.records = response.data || [];
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        mounted: function () {
            this.fetchDetail();
            this.fetchRecords();
        }
    }
</script>

<style scoped lang="less">
    .el-input, .el-select {
        width: 300px;
    }

    .add-form {
        border-right: 1px solid #E4E7ED;
        margin: 30px 0 0;
    }

    .right {
        padding-left: 10px;
        margin-top: 50px;
        .records {
            margin-top: 20px;
            line-height: 20px;
            span {
                color: #FFB204;
            }
        }
    }
</style>
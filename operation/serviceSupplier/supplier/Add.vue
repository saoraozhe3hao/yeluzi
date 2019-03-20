<template>
    <div class="service-supplier-add">
        <div class="add-top">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/service-supplier' }">供应商管理</el-breadcrumb-item>
                <el-breadcrumb-item>新建供应商</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form" :rules="validate" label-position="right" label-width="180px" class="form">
            <el-form-item label="公司名：" prop="companyName">
                <el-input v-model="form.companyName" maxlength="30" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="法定代表人：" prop="corName">
                <el-input v-model="form.corName" maxlength="8" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="公司地址：" prop="address">
                <el-input v-model="form.address" maxlength="100" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="公司统一社会信用代码：" prop="businessLicence">
                <el-input v-model="form.businessLicence" maxlength="30" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="公司营业执照照片：" prop="businessLicencePic">
                <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false"
                           :on-error="uploadError('businessLicencePic')"
                           :on-success="uploadSuccess('businessLicencePic')"
                           :http-request="upload('businessLicencePic')" :accept="acceptImg"
                           :before-upload="beforeUpload('businessLicencePic')" v-loading="loading.businessLicencePic">
                    <img v-if="currentImage('businessLicencePic')" :src="currentImage('businessLicencePic')"
                         class="image">
                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
                <el-progress :percentage="progress.businessLicencePic" class="progress"
                             v-if="progress.businessLicencePic && progress.businessLicencePic < 100"></el-progress>
                <div @click="showCarousel(1)" class="sample">
                    <img :src="carousel.images[1].src" class="sample-image">
                    <span class="sample-label">样例</span>
                </div>
            </el-form-item>
            <el-form-item label="成品油批发执照代码：" prop="saleLicence">
                <el-input v-model="form.saleLicence" maxlength="30" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="成品油批发执照照片：" prop="saleLicencePic">
                <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false"
                           :on-error="uploadError('saleLicencePic')"
                           :on-success="uploadSuccess('saleLicencePic')"
                           :http-request="upload('saleLicencePic')" :accept="acceptImg"
                           :before-upload="beforeUpload('saleLicencePic')" v-loading="loading.saleLicencePic">
                    <img v-if="currentImage('saleLicencePic')" :src="currentImage('saleLicencePic')"
                         class="image">
                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
                <el-progress :percentage="progress.saleLicencePic" class="progress"
                             v-if="progress.saleLicencePic && progress.saleLicencePic < 100"></el-progress>
                <div @click="showCarousel(2)" class="sample">
                    <img :src="carousel.images[2].src" class="sample-image">
                    <span class="sample-label">样例</span>
                </div>
            </el-form-item>
            <el-form-item label="危化品经营执照代码：" prop="danSaleLicense">
                <el-input v-model="form.danSaleLicense" maxlength="30" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="危化品经营执照照片：" prop="danSaleLicensePic">
                <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false"
                           :on-error="uploadError('danSaleLicensePic')"
                           :on-success="uploadSuccess('danSaleLicensePic')"
                           :http-request="upload('danSaleLicensePic')" :accept="acceptImg"
                           :before-upload="beforeUpload('danSaleLicensePic')" v-loading="loading.danSaleLicensePic">
                    <img v-if="currentImage('danSaleLicensePic')" :src="currentImage('danSaleLicensePic')"
                         class="image">
                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
                <el-progress :percentage="progress.danSaleLicensePic" class="progress"
                             v-if="progress.danSaleLicensePic && progress.danSaleLicensePic < 100"></el-progress>
                <div @click="showCarousel(3)" class="sample">
                    <img :src="carousel.images[3].src" class="sample-image">
                    <span class="sample-label">样例</span>
                </div>
            </el-form-item>
            <el-form-item label="银行开户许可证编号：" prop="bankOpenId">
                <el-input v-model="form.bankOpenId" maxlength="20" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="银行开户许可证照片：" prop="bankOpenPic">
                <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false"
                           :on-error="uploadError('bankOpenPic')"
                           :on-success="uploadSuccess('bankOpenPic')"
                           :http-request="upload('bankOpenPic')" :accept="acceptImg"
                           :before-upload="beforeUpload('bankOpenPic')" v-loading="loading.bankOpenPic">
                    <img v-if="currentImage('bankOpenPic')" :src="currentImage('bankOpenPic')" class="image">
                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
                <el-progress :percentage="progress.bankOpenPic" class="progress"
                             v-if="progress.bankOpenPic && progress.bankOpenPic < 100"></el-progress>
                <div @click="showCarousel(4)" class="sample">
                    <img :src="carousel.images[4].src" class="sample-image">
                    <span class="sample-label">样例</span>
                </div>
            </el-form-item>
            <el-form-item label="法定代表人身份证号：" prop="corCertId">
                <el-input v-model="form.corCertId" maxlength="20" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="法定代表人身份证照片：" prop="corCertPic">
                <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false"
                           :on-error="uploadError('corCertPic')" :on-success="uploadSuccess('corCertPic')"
                           :http-request="upload('corCertPic')" :accept="acceptImg"
                           :before-upload="beforeUpload('corCertPic')" v-loading="loading.corCertPic">
                    <img v-if="currentImage('corCertPic')" :src="currentImage('corCertPic')" class="image">
                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
                <el-progress :percentage="progress.corCertPic" class="progress"
                             v-if="progress.corCertPic && progress.corCertPic < 100"></el-progress>
                <div @click="showCarousel(5)" class="sample">
                    <img :src="carousel.images[5].src" class="sample-image">
                    <span class="sample-label">样例</span>
                </div>
            </el-form-item>
            <el-form-item label="公司LOGO：" prop="logo">
                <el-upload class="image-uploader" :action="uploadUrl" :show-file-list="false"
                           :on-error="uploadError('logo')" :on-success="uploadSuccess('logo')"
                           :http-request="upload('logo')" :accept="acceptImg"
                           :before-upload="beforeUpload('logo')" v-loading="loading.logo">
                    <img v-if="form.logo" :src="form.logo" class="image">
                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="公司介绍：" prop="summary">
                <el-input type="textarea" :rows="3" placeholder="公司介绍最多200个字" v-model="form.summary" maxlength="200">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" plain @click="validateForm" v-loading="loading.submit">提交审核</el-button>
            </el-form-item>
        </el-form>
        <dialog-carousel :visible.sync="carousel.visible" :images="carousel.images"
                         :active-index="carousel.activeIndex"></dialog-carousel>
    </div>
</template>

<script>
    import DialogCarousel from "../../../components/DialogCarousel"
    import $compressImage from "../../../components/compressImage"

    export default {
        components: {
            "dialog-carousel": DialogCarousel
        },
        data() {
            return {
                loading: {
                    submit: false,
                    businessLicencePic: false,
                    saleLicencePic: false,
                    danSaleLicensePic: false,
                    bankOpenPic: false,
                    corCertPic: false,
                    logo: false
                },
                enableCompress: true, // 是否开启图片前端压缩后再上传
                selectFile: {    // 当前选择的图片
                    businessLicencePic: null,
                    saleLicencePic: null,
                    danSaleLicensePic: null,
                    bankOpenPic: null,
                    corCertPic: null,
                    logo: null
                },
                uploadedDataUrl: {  // 本次已经上传的图片
                    businessLicencePic: null,
                    saleLicencePic: null,
                    danSaleLicensePic: null,
                    bankOpenPic: null,
                    corCertPic: null,
                    logo: null
                },
                progress: {
                    certPic: 0,
                    businessLicencePic: 0,
                    saleLicencePic: 0,
                    danSaleLicensePic: 0,
                    bankOpenPic: 0,
                    corCertPic: 0
                },
                uploadUrl: this.$basePath + "/admin/user/upload",
                acceptImg: ".jpg,.gif,.png,.jpeg.bnp",
                form: {
                    id: '',
                    companyName: '',
                    corName: '',
                    corCertId: '',
                    corCertPic: '',
                    address: '',
                    businessLicence: '',
                    businessLicencePic: '',
                    saleLicence: '',
                    saleLicencePic: '',
                    danSaleLicense: '',
                    danSaleLicensePic: '',
                    bankOpenId: '',
                    bankOpenPic: '',
                    logo: '',
                    summary: ''
                },
                validate: {
                    companyName: [
                        {required: true, message: '请填写'}
                    ],
                    corName: [this.$validation.fullName[1]],
                    address: [],
                    businessLicence: [
                        {pattern: /^[a-zA-Z\d]{5,30}$/, message: '请输入正确的信用代码', trigger: "blur"}
                    ],
                    businessLicencePic: [],
                    saleLicence: [
                        {pattern: /^[a-zA-Z\d]{5,30}$/, message: '请输入正确的执照代码', trigger: "blur"}
                    ],
                    saleLicencePic: [],
                    danSaleLicense: [
                        {pattern: /^.{5,30}$/, message: '请输入正确的执照代码', trigger: "blur"}
                    ],
                    danSaleLicensePic: [],
                    bankOpenId: [
                        {pattern: /^[\-\d]{0,20}$/, message: '请输入正确的许可证编号', trigger: "blur"}
                    ],
                    bankOpenPic: [],
                    corCertId: [
                        {pattern: /^[a-zA-Z\d]{0,20}$/, message: '请输入正确的身份证号', trigger: "blur"}
                    ],
                    corCertPic: [],
                    logo: [
                        {required: true, message: '请上传'}
                    ],
                    summary: [
                        {required: true, message: '请填写'}
                    ]
                },
                carousel: {
                    visible: false,
                    activeIndex: 0,
                    images: [
                        {
                            label: '身份证样例',
                            src: 'http://scmimages.oss-cn-beijing.aliyuncs.com/scmweb/certPic.jpg'
                        },
                        {
                            label: '公司营业执照样例',
                            src: 'http://scmimages.oss-cn-beijing.aliyuncs.com/scmweb/businessLicencePic.jpg'
                        },
                        {
                            label: '成品油批发执照样例',
                            src: 'http://scmimages.oss-cn-beijing.aliyuncs.com/scmweb/saleLicencePic.jpg'
                        },
                        {
                            label: '危化品经营证照样例',
                            src: 'http://scmimages.oss-cn-beijing.aliyuncs.com/scmweb/danSaleLicensePic.jpg'
                        },
                        {
                            label: '银行开户许可证样例',
                            src: 'http://scmimages.oss-cn-beijing.aliyuncs.com/scmweb/bankOpenPic.jpg'
                        },
                        {
                            label: '法人身份证样例',
                            src: 'http://scmimages.oss-cn-beijing.aliyuncs.com/scmweb/certPic.jpg'
                        }
                    ]
                }
            };
        },
        computed: {
            formFields: function () {
                let fields = [];
                for (let field in this.form) {
                    fields.push(field);
                }
                return fields;
            }
        },
        watch: {},
        methods: {
            fetchDetail() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/custom/service/companyinfo",
                    params: {
                        companyId: this.$route.query.id
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.$copyFields(this.formFields, response.data, this.form);
                    }
                });
            },
            beforeUpload(kind) {
                return (file) => {
                    let names = file.name.split('.');
                    let postfix = names[names.length - 1];
                    if (!this.acceptImg.includes(postfix.toLowerCase())) {
                        this.$message({
                            message: "您选择的不是图片",
                            type: 'warning'
                        });
                        return false;
                    }
                    if (kind == 'logo' && file.size > 2097152) {
                        this.$message({
                            message: "图片大小不能超过2M",
                            type: 'warning'
                        });
                        return false;
                    }
                    this.progress[kind] = 0;
                    this.loading[kind] = true;
                    if (this.enableCompress) {
                        return this.compress(kind, file);
                    }
                }
            },
            uploadSuccess(kind) {
                return (response, file, fileList) => {
                    this.loading[kind] = false;
                    if (response.code == 0) {
                        this.form[kind] = response.data.filePath;
                    }
                    else {
                        this.$message({
                            message: response.devMsg || response.msg,
                            type: 'warning'
                        });
                        return false;
                    }
                }
            },
            uploadError(kind) {
                return (err, file, fileList) => {
                    this.loading[kind] = false;
                }
            },
            compress(kind, file) {
                let promise = $compressImage(file);
                promise.then(result => {
                    this.selectFile[kind] = result;
                }).catch(error => {
                    this.loading[kind] = false;
                    this.$message({
                        message: "图片压缩失败",
                        type: 'warning'
                    });
                }).finally(() => {
                });
                return promise;
            },
            upload(kind) {
                if (!this.enableCompress) {
                    return;
                }
                return () => {
                    let formData = new FormData();
                    if(this.selectFile[kind] instanceof File){
                        formData.append('file', this.selectFile[kind]);
                    }
                    else{
                        formData.append('imgCode', this.selectFile[kind]);
                    }
                    this.$axios({
                        method: "post",
                        url: this.uploadUrl,
                        data: formData,
                        onUploadProgress: (event) => {
                            let progress = event.loaded / event.total * 100;
                            progress = progress < 100 ? progress : 95;
                            this.progress[kind] = parseInt(progress);
                        }
                    }).then((response) => {
                        this.loading[kind] = false;
                        response = response.data;
                        if (response.code == 0) {
                            if(this.selectFile[kind] instanceof File){
                                let reader = new FileReader();
                                reader.readAsDataURL(this.selectFile[kind]);
                                reader.onload = (e) => {
                                    this.progress[kind] = 100;
                                    this.uploadedDataUrl[kind] = e.target.result;
                                    this.form[kind] = response.data.filePath;
                                };
                            }
                            else{
                                this.progress[kind] = 100;
                                this.uploadedDataUrl[kind] = this.selectFile[kind];
                                this.form[kind] = response.data.filePath;
                            }
                        }
                    }).catch(() => {
                        this.loading[kind] = false;
                    });
                }
            },
            currentImage(kind) {
                return this.uploadedDataUrl[kind] || this.form[kind];
            },
            showCarousel(activeIndex) {
                this.carousel.visible = true;
                this.$nextTick(function () {
                    this.carousel.activeIndex = activeIndex;
                });
            },
            validateForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submit();
                    }
                });
            },
            submit() {
                this.loading.submit = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + (this.$route.query.id ? "/admin/custom/service/supplycompany/edit" : "/admin/custom/service/supplycompany/save"),
                    data: this.form
                }).then((response) => {
                    this.loading.submit = false;
                    response = response.data;
                    if (response.code == 0) {
                        this.$router.push({path: "/service-supplier"});
                    }
                }).catch(() => {
                    this.loading.submit = false;
                });
            }
        },
        mounted: function () {
            if (this.$route.query.id) {
                this.fetchDetail();
            }
        }
    }
</script>

<style lang="less">
    .service-supplier-add {
        .el-input, .el-select, .el-textarea {
            width: 400px;
        }
        .form {
            margin: 50px 0 0 50px;
            .el-select {
                width: 330px;
            }
        }
        .image-uploader {
            .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .el-upload:hover {
                border-color: #409EFF;
            }
            .image-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .image {
                width: 178px;
                height: 178px;
                display: block;
            }
        }
        .sample {
            cursor: pointer;
            .sample-image {
                position: absolute;
                top: 0;
                left: 200px;
                height: 150px;
            }
            .sample-label {
                position: absolute;
                top: 50px;
                left: 250px;
                background-color: #eee;
                line-height: normal;
                padding: 0 5px;
            }
        }
        .progress{
            width: 300px;
        }
    }
</style>
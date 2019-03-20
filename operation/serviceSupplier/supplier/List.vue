<template>
    <div class="supplier-verify-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">供应商审核</span>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="add">新增</el-button>
            <el-input placeholder="按企业名称查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-filter">
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data" @selection-change="selectionChange">
                <el-table-column prop="id" label="公司ID" width="100"></el-table-column>
                <el-table-column prop="companyName" label="公司名称"></el-table-column>
                <el-table-column prop="corName" label="公司法定代表人"></el-table-column>
                <el-table-column prop="address" label="公司地址"></el-table-column>
                <el-table-column prop="businessLicence" label="统一社会信用代码"></el-table-column>
                <el-table-column label="公司营业执照照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.businessLicencePic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 0)" v-if="scope.row.businessLicencePic"/>
                    </template>
                </el-table-column>
                <el-table-column prop="saleLicence" label="成品油批发执照代码"></el-table-column>
                <el-table-column label="成品油批发执照照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.saleLicencePic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 1)" v-if="scope.row.saleLicencePic"/>
                    </template>
                </el-table-column>
                <el-table-column prop="danSaleLicense" label="危化品经营证代码"></el-table-column>
                <el-table-column label="危化品经营证照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.danSaleLicensePic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 2)" v-if="scope.row.danSaleLicensePic"/>
                    </template>
                </el-table-column>
                <el-table-column prop="bankOpenId" label="银行开户许可证ID"></el-table-column>
                <el-table-column label="银行开户许可证照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.bankOpenPic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 3)" v-if="scope.row.bankOpenPic"/>
                    </template>
                </el-table-column>
                <el-table-column prop="corCertId" label="法定代表人身份证号"></el-table-column>
                <el-table-column label="法定代表人身份证照片">
                    <template slot-scope="scope">
                        <img :src="scope.row.corCertPic + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 4)" v-if="scope.row.corCertPic"/>
                    </template>
                </el-table-column>
                <el-table-column label="公司LOGO">
                    <template slot-scope="scope">
                        <img :src="scope.row.logo + '!S70'" class="table-image"
                             @click="showCarousel(scope.row, 5)" v-if="scope.row.logo"/>
                    </template>
                </el-table-column>
                <el-table-column label="公司介绍">
                    <template slot-scope="scope">
                        <el-popover placement="left" title="" width="200" trigger="hover"
                                    :content="scope.row.summary">
                            <el-button slot="reference" type="text" v-if="scope.row.summary">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
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
        <dialog-carousel :visible.sync="carousel.visible" :images="carousel.images"
                         :active-index="carousel.activeIndex"></dialog-carousel>
    </div>
</template>

<script>
    import DialogCarousel from "../../../components/DialogCarousel"
    import Md5 from 'md5'

    export default {
        components: {
            "dialog-carousel": DialogCarousel
        },
        data() {
            return {
                loading: false,
                filter: {
                    searchKey: "",
                    states: [
                        {
                            value: 1,
                            label: '待审核'
                        },
                        {
                            value: 2,
                            label: '已审核'
                        },
                        {
                            value: 3,
                            label: '未通过'
                        }
                    ]
                },
                table: {
                    data: [],
                    selection: []
                },
                batch: {
                    targets: []
                },
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                carousel: {
                    visible: false,
                    activeIndex: 0,
                    images: [
                        {
                            label: '营业执照',
                            key: 'businessLicencePic',
                            src: ''
                        },
                        {
                            label: '成品油批发执照',
                            key: 'saleLicencePic',
                            src: ''
                        },
                        {
                            label: '危化品经营证照',
                            key: 'danSaleLicensePic',
                            src: ''
                        },
                        {
                            label: '银行开户许可证',
                            key: 'bankOpenPic',
                            src: ''
                        },
                        {
                            label: '公司LOGO',
                            key: 'logo',
                            src: ''
                        }
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
                this.filter.searchKey = "";  // 过滤时不带关键字搜索，让页面显示与实际参数一致
                this.fetchList();
            },
            showCarousel(row, activeIndex) {
                this.carousel.visible = true;
                this.carousel.images.forEach((item) => {
                    item.src = row[item.key];
                });
                this.$nextTick(function () {
                    this.carousel.activeIndex = activeIndex;
                });
            },
            add() {
                this.$router.push({path: '/service-supplier/add'});
            },
            edit(row) {
                let query = {
                    id: row.id
                };
                this.$router.push({path: '/service-supplier/add',query});
            },
            selectionChange(selection) {
                this.batch.targets = selection;
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/admin/custom/service/supplycompanies",
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
                    if (response.code == 0) {
                        this.table.data = response.data || [];
                        this.page.totalCount = response.recordsTotal;
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
    .table-image {
        cursor: pointer;
    }
</style>
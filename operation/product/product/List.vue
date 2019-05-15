<template>
    <div class="product-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">商品</span>
            <el-input placeholder="按商品名称或ID查询" v-model="filter.searchKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="list-table">
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="id" label="ID" width="100px"></el-table-column>
                <el-table-column prop="name" label="名称" width="100px"></el-table-column>
                <el-table-column prop="merchantId" label="商户ID" width="100px"></el-table-column>
                <el-table-column prop="merchantName" label="商户" width="100px"></el-table-column>
                <el-table-column prop="timeRange" label="时间范围" width="100px"></el-table-column>
                <el-table-column prop="address" label="地点"></el-table-column>
                <el-table-column label="标签">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>{{scope.row.labels.join(',')}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="limit" label="接待上限"></el-table-column>
                <el-table-column label="活动详情">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>上午活动：{{scope.row.morningActivity}}</div>
                            <div>午饭：{{scope.row.lunch}}</div>
                            <div>下午活动：{{scope.row.afternoonActivity}}</div>
                            <div>晚饭：{{scope.row.dinner}}</div>
                            <div>晚上活动：{{scope.row.eveningActivity}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="住宿详情">
                    <template slot-scope="scope">
                        <div v-if="scope.row.stayOver == 0">
                            无法住宿
                        </div>
                        <el-popover placement="left" trigger="hover" v-if="scope.row.stayOver != 0">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div v-if="scope.row.stayOver == 1">
                                <div>趣导提供住宿</div>
                                <div>房间数：{{scope.row.roomNum}}间，{{scope.row.roomPrice}} 元/间</div>
                                <div>床位数：{{scope.row.bedNum}}个，{{scope.row.bedPrice}} 元/个</div>
                            </div>
                            <div v-if="scope.row.stayOver == 2">
                                <div>附近酒店住宿</div>
                                <div>{{scope.row.hotelDetail}}</div>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="价格规则">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>1人：{{scope.row.singlePrice}} 元</div>
                            <div>2人：{{scope.row.doublePrice}} 元/人</div>
                            <div>3~5人：{{scope.row.treblePrice}} 元/人</div>
                            <div>6~9人：{{scope.row.sextuplePrice}} 元/人</div>
                            <div>10人以上：{{scope.row.decuplePrice}} 元/人</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showCarousel(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="verify(scope.row)" v-if="scope.row.status == '待审核'">审核
                        </el-button>
                        <el-button type="text" @click="offShelf(scope.row)"
                                   v-if="['预约中','零预约'].includes(scope.row.status)">下架
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="list-bottom">
            <el-pagination background @current-change="fetchList" :current-page.sync="page.currentPage"
                           :page-size="10" layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="审核" :visible.sync="verifyDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="verifyDialog.model" ref="verifyForm" :rules="rules" label-width="120">
                <el-form-item label="审核结果：" required="">
                    <el-radio-group v-model="verifyDialog.model.auditResult">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="2">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="不通过理由：" prop="refuseReason" v-if="verifyDialog.model.auditResult == 2">
                    <el-input type="textarea" :rows="4" placeholder="请输入理由"
                              v-model="verifyDialog.model.refuseReason" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="verifyDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="verifyConfirm">确 认</el-button>
            </div>
        </el-dialog>
        <dialog-carousel :visible.sync="carousel.visible" :images="carousel.images"
                         :active-index.sync="carousel.activeIndex"></dialog-carousel>
    </div>
</template>

<script>
    import DialogCarousel from "../../../components/DialogCarousel"
    export default {
        components: {
            "dialog-carousel": DialogCarousel
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
                page: {
                    totalCount: 0,
                    currentPage: 1
                },
                verifyDialog: {
                    visible: false,
                    model: {
                        id: '',
                        auditResult: 2,
                        refuseReason: ''
                    }
                },
                carousel: {
                    visible: false,
                    activeIndex: 0,
                    images: []
                },
                rules: {
                    refuseReason: [
                        {required: true, message: '请填写内容'}
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
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/product",
                    params: {
                        length: 10,
                        start: (this.page.currentPage - 1) * 10,
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
            showCarousel(row) {
                this.carousel.visible = true;
                this.carousel.activeIndex = 0;
                this.carousel.images = [];
                row.activityPhotos.forEach((item)=>{
                    this.carousel.images.push({
                        label: '活动',
                        src: item
                    });
                });
                row.stayOverPhotos.forEach((item)=>{
                    this.carousel.images.push({
                        label: '住宿',
                        src: item
                    });
                });
            },
            /** 下架 对话框 **/
            offShelf(row) {
                this.$confirm('确认下架该商品?', '确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operateAjax("/admin/customer/" + row.id);
                }).catch(() => {
                });
            },
            operateAjax(url) {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + url
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == 0) {
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
            /** 审核 对话框 **/
            verify(row) {
                this.verifyDialog.visible = true;
                this.$copyFields(Object.keys(this.verifyDialog.model), {
                    id: row.id,
                    auditResult: 1,
                    refuseReason: ''
                }, this.verifyDialog.model);
                this.$nextTick(function () {
                    this.$refs.verifyForm.clearValidate();
                });
            },
            verifyConfirm() {
                this.$refs.verifyForm.validate((valid) => {
                    if (valid) {
                        this.verifySubmit();
                    } else {
                        return false;
                    }
                });
            },
            verifySubmit() {
                this.loading = true;
                let data = this.$copyFields(Object.keys(this.verifyDialog.model), this.verifyDialog.model, null);
                this.$axios({
                    method: "put",
                    url: this.$basePath + "/admin/custom/service/members/audit",
                    data: data
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == "0") {
                        this.verifyDialog.visible = false;
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
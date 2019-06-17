<template>
    <div class="product-list" v-loading="loading">
        <div class="list-top">
            <span class="page-title">商品</span>
            <el-input placeholder="按商品ID或商户ID查询" v-model="filter.query" class="input-with-select" clearable
                      @clear="search" @keyup.enter.native="search">
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
            <el-table ref="multipleTable" :data="table.data">
                <el-table-column prop="id" label="ID" width="100px"></el-table-column>
                <el-table-column prop="name" label="名称" width="100px"></el-table-column>
                <el-table-column prop="merchantId" label="商户ID" width="100px"></el-table-column>
                <el-table-column prop="merchantName" label="商户" width="100px"></el-table-column>
                <el-table-column label="时间范围" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.startDate}}至{{scope.row.endDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="地点"></el-table-column>
                <el-table-column label="标签">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>{{scope.row.tags}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="topLimit" label="接待上限"></el-table-column>
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
                        <el-popover placement="left" trigger="hover">
                            <el-button slot="reference" type="text">查看</el-button>
                            <div>趣导提供民宿</div>
                            <div>房间数：{{scope.row.roomNum}}间，{{scope.row.roomPrice}} 元/间</div>
                            <div>床位数：{{scope.row.bedNum}}个，{{scope.row.bedPrice}} 元/个</div>
                            <div>附近酒店信息</div>
                            <div>{{scope.row.hotelInfo}}</div>
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
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{displayStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="audit(scope.row)" v-if="scope.row.status == 'pending'">审核
                        </el-button>
                        <el-button type="text" @click="offShelf(scope.row)"
                                   v-if="['ordering','noneOrder'].includes(scope.row.status)">下架
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
        <el-dialog title="审核" :visible.sync="auditDialog.visible" width="500px" :close-on-click-modal="false">
            <el-form :model="auditDialog.model" ref="auditForm" :rules="rules" label-width="120">
                <el-form-item label="审核结果：" required="">
                    <el-radio-group v-model="auditDialog.model.auditResult">
                        <el-radio label="approve">通过</el-radio>
                        <el-radio label="disapprove">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="不通过理由：" prop="refuseReason" v-if="auditDialog.model.auditResult == 'disapprove'">
                    <el-input type="textarea" :rows="4" placeholder="请输入理由"
                              v-model="auditDialog.model.refuseReason" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="auditConfirm">确 认</el-button>
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
                    query: '',
                    status: '',
                    statusList: [
                        {
                            value: 'pending',
                            label: '待审核'
                        },
                        {
                            value: 'unapproved',
                            label: '审核不通过'
                        },
                        {
                            value: 'noneOrder',
                            label: '零预约'
                        },
                        {
                            value: 'ordering',
                            label: '预约中'
                        },
                        {
                            value: 'underShelf',
                            label: '已下架'
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
                auditDialog: {
                    visible: false,
                    model: {
                        id: '',
                        auditResult: 'approve',
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
            filterChange() {
                this.page.currentPage = 1;
                this.filter.query = "";
                this.fetchList();
            },
            displayStatus(status) {
                let item = this.filter.statusList.find((item) => {
                    return item.value === status;
                });
                return item && item.label;
            },
            fetchList() {
                this.loading = true;
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/admin/product",
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
            showCarousel(row) {
                this.carousel.visible = true;
                this.carousel.activeIndex = 0;
                this.carousel.images = [];
                row.activityPhotos.split(',').forEach((item) => {
                    this.carousel.images.push({
                        label: '活动',
                        src: item
                    });
                });
                row.stayOverPhotos.split(',').forEach((item) => {
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
                    this.operateAjax(`/admin/product/${row.id}/offShelf/`);
                }).catch(() => {
                });
            },
            operateAjax(url, data) {
                this.loading = true;
                this.$axios({
                    method: "put",
                    url: this.$basePath + url,
                    data
                }).then((response) => {
                    this.loading = false;
                    response = response.data;
                    if (response.code == 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.auditDialog.visible = false;
                        this.fetchList();
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            /** 审核 对话框 **/
            audit(row) {
                this.auditDialog.visible = true;
                this.$copyFields(Object.keys(this.auditDialog.model), {
                    id: row.id,
                    auditResult: 'approve',
                    refuseReason: ''
                }, this.auditDialog.model);
                this.$nextTick(function () {
                    this.$refs.auditForm.clearValidate();
                });
            },
            auditConfirm() {
                this.$refs.auditForm.validate((valid) => {
                    if (valid) {
                        let model = this.auditDialog.model;
                        this.operateAjax(`/admin/product/${model.id}/${model.auditResult}`, {refuseReason: model.refuseReason});
                    } else {
                        return false;
                    }
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
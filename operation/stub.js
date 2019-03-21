import Mock from 'mockjs'

let Random = Mock.Random;

let commonId = Random.integer(0);
let goodsId = Random.integer(100000000, 200000000);

function stub() {
    // 我的 详情 接口
    Mock.mock(/\/admin\/user\/detail/, function () {
        return {
            code: "0",
            data: {
                id: Random.integer(0),
                name: Random.pick(["张三", "李四", "王五", "赵六"]),
                idNumber: Random.integer(10000000000, 19999999999),
                mobile: Random.integer(10000000000, 19999999999),
                role: "角色" + Random.integer(0),
                rights: ['order', 'order.all', 'pastOrder.all', 'product', 'product.all',
                    'pastProduct', 'pastProduct.all', 'comment', 'comment.all', 'operator', 'operator.all',
                    'merchant', 'merchant.all', 'customer', 'customer.all', 'tipOff', 'tipOff.all']
            }
        }
    });
    // 客户 分页列表
    Mock.mock(/\/admin\/customer/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                name: "客户" + Random.integer(0),
                status: Random.pick(['正常', '禁用']),
                phone: Random.integer(10000000000, 19999999999)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 商户 分页列表
    Mock.mock(/\/admin\/merchant/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                name: "客户" + Random.integer(0),
                status: Random.pick(['正常', '禁止发布']),
                phone: Random.integer(10000000000, 19999999999)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 商户举报 分页列表
    Mock.mock(/\/admin\/tipOff/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                customerId: Random.integer(0),
                customerName: "客户" + Random.integer(0),
                merchantId: Random.integer(0),
                merchantName: "商户" + Random.integer(0),
                type: Random.pick(['联系不上趣导', '趣导拒绝提供服务', '其他']),
                refund: Random.pick([0, 1]),
                detail: "举报详情" + Random.integer(0),
                replies: [
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        content: "内容" + Random.integer(0)
                    },
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        content: "内容" + Random.integer(0)
                    }
                ],
                conducts: [
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        status: Random.pick(['待处理', '处理中', '办结']),
                        content: "内容" + Random.integer(0)
                    },
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        status: Random.pick(['待处理', '处理中', '办结']),
                        content: "内容" + Random.integer(0)
                    }
                ],
                status: Random.pick(['待处理', '处理中', '办结']),
                phone: Random.integer(10000000000, 19999999999)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 角色 选项
    Mock.mock(/\/admin\/role/, function () {
        return {
            code: "0",
            data: [
                {
                    "id": 100001,
                    "name": "系统管理员"
                },
                {
                    "id": 100002,
                    "name": "查看员"
                },
                {
                    "id": 100003,
                    "name": "运营员"
                }
            ]
        }
    });
    // 运营人员 列表
    Mock.mock(/\/admin\/operator/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                name: "姓名" + Random.integer(0),
                idNumber: Random.integer(10000000000, 19999999999),
                role: Random.pick([100001, 100002, 100003]),
                mobile: Random.integer(10000000000, 19999999999),
                creator: "创建人" + Random.integer(0),
                status: Random.pick(["停用", "正常"])
            });
        }
        return {
            code: "0",
            data: {
                resultList: data,
                totalCount: Random.integer(15, 550)
            }
        }
    });
    // 商品 列表
    Mock.mock(/\/admin\/product/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(100000000, 200000000),
                name: "商品" + Random.integer(0),
                merchantId: Random.integer(100000000, 200000000),
                merchantName: "商户" + Random.integer(0),
                timeRange: Random.datetime(),
                address: "地点" + Random.integer(0),
                labels: ["打野", "民俗", "探秘", "赶海"],
                limit: Random.integer(0,100),
                morningActivity: "早上" + Random.integer(0),
                lunch: "午饭" + Random.integer(0),
                afternoonActivity: "下午" + Random.integer(0),
                dinner: "午饭" + Random.integer(0),
                eveningActivity: "晚上" + Random.integer(0),
                stayOver: Random.integer(0,2),
                roomNum: Random.integer(0,100),
                roomPrice: Random.integer(0,100),
                bedNum: Random.integer(0,100),
                bedPrice: Random.integer(0,100),
                hotelDetail: "酒店说明" + Random.integer(0),
                singlePrice:  Random.integer(0,100),
                doublePrice:  Random.integer(0,100),
                treblePrice:  Random.integer(0,100),
                sextuplePrice:  Random.integer(0,100),
                decuplePrice:  Random.integer(0,100),
                status: Random.pick(['待审核','审核不通过','零预约','预约中','已下架']),
                activityPhotos: [Random.image(),Random.image(),Random.image()],
                stayOverPhotos: [Random.image(),Random.image(),Random.image()]
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 评价 列表
    Mock.mock(/\/admin\/comment/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(100000000, 200000000),
                score: Random.integer(0,100),
                comment: "评论" + Random.integer(0),
                response: "回应" + Random.integer(0),
                customerId: Random.integer(0),
                customerName: "客户" + Random.integer(0),
                merchantId: Random.integer(100000000, 200000000),
                merchantName: "商户" + Random.integer(0),
                productId: Random.integer(0),
                productName: "商品" + Random.integer(0),
                orderId: Random.integer(0),
                payTime: Random.datetime(),
                useTime: Random.datetime(),
                commentTime: Random.datetime()
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });

    // 其他
    Mock.mock(/\/admin/, function () {
        return {
            code: "0",
            data: null
        }
    });
}

export default stub;
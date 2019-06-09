import Mock from 'mockjs'

let Random = Mock.Random;

let commonId = Random.integer(0);

function mock() {
    // 我的 详情 接口
    Mock.mock(/\/me$/, function () {
        return {
            code: "0",
            data: {
                id: Random.integer(0),
                name: Random.pick(["张三", "李四", "王五", "赵六"]),
                idNumber: Random.integer(10000000000, 19999999999),
                username: Random.integer(10000000000, 19999999999),
                roles: [{id: "1", name: "admin"},{id: "2", name: "auditor"}],
                authorities: ['order.all', 'product.all', 'pastProduct.all', 'comment.all', 'operator.all', 'merchant.all',
                     'customer.all', 'refund.all', 'tipOff.all', 'withdraw.all','message.all'] // get,put,delete,post,all
            }
        }
    });
    // 客户 分页列表
    Mock.mock(/\/admin\/customer/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                nickname: "客户" + Random.integer(0),
                status: Random.pick(['normal', 'forbidden']),
                mobile: Random.integer(10000000000, 19999999999)
            });
        }
        return {
            code: "0",
            data: {
                list: data,
                total: Random.integer(15, 550)
            }
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
                        status: Random.pick(['待受理', '受理中', '办结']),
                        content: "内容" + Random.integer(0)
                    },
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        status: Random.pick(['待受理', '受理中', '办结']),
                        content: "内容" + Random.integer(0)
                    }
                ],
                status: Random.pick(['待受理', '受理中', '办结']),
                phone: Random.integer(10000000000, 19999999999)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 提现申请 分页列表
    Mock.mock(/\/admin\/withdraw/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                merchantId: Random.integer(0),
                merchantName: "商户" + Random.integer(0),
                name: "姓名" + Random.integer(0),
                cardNumber: Random.integer(0),
                bank: "开户行" + Random.integer(0),
                amount: Random.integer(0, 1232),
                operator: "操作人" + Random.integer(0),
                status: Random.pick(['待支付', '支付中', '已支付'])
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 角色 选项
    Mock.mock(/\/admin\/operator\/role/, function () {
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
                roles: [{id: 100001, name: "系统管理员"},{id: 100002, name: "审计员"}],
                username: Random.integer(10000000000, 19999999999),
                creator: "创建人" + Random.integer(0),
                status: Random.pick(["disabled", "normal"])
            });
        }
        return {
            code: "0",
            data: {
                list: data,
                total: Random.integer(15, 550)
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
                limit: Random.integer(0, 100),
                morningActivity: "早上" + Random.integer(0),
                lunch: "午饭" + Random.integer(0),
                afternoonActivity: "下午" + Random.integer(0),
                dinner: "午饭" + Random.integer(0),
                eveningActivity: "晚上" + Random.integer(0),
                stayOver: Random.integer(0, 2),
                roomNum: Random.integer(0, 100),
                roomPrice: Random.integer(0, 100),
                bedNum: Random.integer(0, 100),
                bedPrice: Random.integer(0, 100),
                hotelDetail: "酒店说明" + Random.integer(0),
                singlePrice: Random.integer(0, 100),
                doublePrice: Random.integer(0, 100),
                treblePrice: Random.integer(0, 100),
                sextuplePrice: Random.integer(0, 100),
                decuplePrice: Random.integer(0, 100),
                status: Random.pick(['待审核', '审核不通过', '零预约', '预约中', '已下架']),
                activityPhotos: [Random.image(), Random.image(), Random.image()],
                stayOverPhotos: [Random.image(), Random.image(), Random.image()]
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
                score: Random.integer(0, 100),
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
    // 订单 列表
    Mock.mock(/\/admin\/order/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(100000000, 200000000),
                customerId: Random.integer(0),
                customerName: "客户" + Random.integer(0),
                merchantId: Random.integer(100000000, 200000000),
                merchantName: "商户" + Random.integer(0),
                productId: Random.integer(0),
                productName: "商品" + Random.integer(0),
                payTime: Random.datetime(),
                orderTime: Random.datetime(),
                useTime: Random.datetime(),
                total: Random.integer(0, 1000),
                status: Random.pick(['待使用', '已使用', '已过期', '已退款']),
                customerNum: Random.integer(0, 100),
                roomNum: Random.integer(0, 10),
                bedNum: Random.integer(0, 10),
                refunder: "运营员" + Random.integer(0),
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 用户留言 分页列表
    Mock.mock(/\/admin\/message/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                customerId: Random.integer(0),
                customerName: "客户" + Random.integer(0),
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
                status: Random.pick(['未回复', '已回复'])
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });

    // 其他
    Mock.mock(/./, function () {
        return {
            code: "0",
            data: null
        }
    });
}

// 本地才加载桩数据
if (location.hostname == 'localhost') {
    mock();
}

export default mock;
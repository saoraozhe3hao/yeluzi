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
                authorities: ['order.all', 'product.all', 'comment.all', 'operator.all', 'merchant.all',
                     'customer.all', 'refund.all', 'accuse.all', 'withdraw.all','message.all','role.all'] // get,put,delete,post,all
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
                balance: Random.integer(0),
                merchantName: "商户" + Random.integer(0),
                realName: "真名" + Random.integer(0),
                score: '4.6',
                idNumber: Random.integer(10000000000, 19999999999),
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
    // 商户举报 分页列表
    Mock.mock(/\/admin\/accuse/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                customerId: Random.integer(0),
                customerName: "客户" + Random.integer(0),
                merchantId: Random.integer(0),
                merchantName: "商户" + Random.integer(0),
                type: Random.pick(['outOfContact', 'denialOfService', 'other']),
                detail: "举报详情" + Random.integer(0),
                recordList: [
                    {
                        detail: "afsadf",
                        id: "1",
                        operator: "洪真全",
                        operatorId: "1",
                        time: "2019-10-11 11:23:44",
                        type: "reply"
                    },
                    {
                        detail: "ccccccccc",
                        id: "2",
                        operator: "洪真全",
                        operatorId: "1",
                        reportStatus: "pending",
                        time: "2019-10-11 11:23:44",
                        type: "conduct"
                    }
                ],
                status: Random.pick(['pending', 'handling', 'done']),
                time: Random.datetime()
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
    // 退款申请 分页列表
    Mock.mock(/\/admin\/refund/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                customerId: Random.integer(0),
                customerName: "客户" + Random.integer(0),
                merchantId: Random.integer(0),
                merchantName: "商户" + Random.integer(0),
                productId: Random.integer(0),
                productName: "商品" + Random.integer(0),
                orderId: Random.integer(0),
                type: Random.pick(['outOfContact', 'denialOfService', 'other']),
                detail: "举报详情" + Random.integer(0),
                recordList: [
                    {
                        detail: "afsadf",
                        id: "1",
                        operator: "洪真全",
                        operatorId: "1",
                        time: "2019-10-11 11:23:44",
                        type: "reply"
                    },
                    {
                        detail: "ccccccccc",
                        id: "2",
                        operator: "洪真全",
                        operatorId: "1",
                        reportStatus: "pending",
                        time: "2019-10-11 11:23:44",
                        type: "conduct"
                    }
                ],
                status: Random.pick(['pending', 'handling', 'done']),
                time: Random.datetime()
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
    // 提现申请 分页列表
    Mock.mock(/\/admin\/withdraw/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                merchantId: Random.integer(0),
                merchant: {
                    bankNumber: Random.integer(0),
                    id:  Random.integer(0),
                    merchantName: "商户" + Random.integer(0),
                    openingBank: "开户行" + Random.integer(0),
                    realName: "姓名" + Random.integer(0),
                },
                amount: Random.integer(0, 1232),
                operator: "操作人" + Random.integer(0),
                status: Random.pick(['pending', 'handling', 'paid']),
                time: Random.datetime()
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
    // 运营人员 列表
    Mock.mock(/\/admin\/operator\?/, function () {
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
    // 运营角色 列表
    Mock.mock(/\/admin\/role\?/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                name: "角色" + Random.integer(0),
                status: Random.pick(["disabled", "normal"]),
                authorities: [
                    {
                        "id": 100004,
                        "name": "operator.all",
                        "label": "运营人员"
                    },
                    {
                        "id": 100011,
                        "name": "role.all",
                        "label": "角色"
                    },
                    {
                        "id": 100006,
                        "name": "customer.all",
                        "label": "客户"
                    },
                    {
                        "id": 100010,
                        "name": "message.all",
                        "label": "客户留言"
                    },
                    {
                        "id": 100002,
                        "name": "product.all",
                        "label": "商品"
                    },
                    {
                        "id": 100005,
                        "name": "merchant.all",
                        "label": "商户"
                    },
                    {
                        "id": 100008,
                        "name": "accuse.all",
                        "label": "商户举报"
                    },
                    {
                        "id": 100009,
                        "name": "withdraw.all",
                        "label": "提现申请"
                    },
                    {
                        "id": 100001,
                        "name": "order.all",
                        "label": "订单"
                    },
                    {
                        "id": 100003,
                        "name": "comment.all",
                        "label": "评价"
                    },
                    {
                        "id": 100007,
                        "name": "refund.all",
                        "label": "退款"
                    }
                ]
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
    // 权限 选项
    Mock.mock(/\/admin\/role\/authority/, function () {
        return {
            code: "0",
            data: [
                {
                    "id": 100004,
                    "name": "operator.all",
                    "label": "运营人员"
                },
                {
                    "id": 100011,
                    "name": "role.all",
                    "label": "角色"
                },
                {
                    "id": 100006,
                    "name": "customer.all",
                    "label": "客户"
                },
                {
                    "id": 100010,
                    "name": "message.all",
                    "label": "客户留言"
                },
                {
                    "id": 100002,
                    "name": "product.all",
                    "label": "商品"
                },
                {
                    "id": 100005,
                    "name": "merchant.all",
                    "label": "商户"
                },
                {
                    "id": 100008,
                    "name": "accuse.all",
                    "label": "商户举报"
                },
                {
                    "id": 100009,
                    "name": "withdraw.all",
                    "label": "提现申请"
                },
                {
                    "id": 100001,
                    "name": "order.all",
                    "label": "订单"
                },
                {
                    "id": 100003,
                    "name": "comment.all",
                    "label": "评价"
                },
                {
                    "id": 100007,
                    "name": "refund.all",
                    "label": "退款"
                }
            ]
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
                startDate: Random.date(),
                endDate: Random.date(),
                location: "地点" + Random.integer(0),
                tags: '打野, 民俗, 探秘, 赶海',
                topLimit: Random.integer(0, 100),
                morningActivity: "早上" + Random.integer(0),
                lunch: "午饭" + Random.integer(0),
                afternoonActivity: "下午" + Random.integer(0),
                dinner: "午饭" + Random.integer(0),
                eveningActivity: "晚上" + Random.integer(0),
                roomNum: Random.integer(0, 100),
                roomPrice: Random.integer(0, 100),
                bedNum: Random.integer(0, 100),
                bedPrice: Random.integer(0, 100),
                hotelInfo: "酒店说明" + Random.integer(0),
                singlePrice: Random.integer(0, 100),
                doublePrice: Random.integer(0, 100),
                treblePrice: Random.integer(0, 100),
                sextuplePrice: Random.integer(0, 100),
                decuplePrice: Random.integer(0, 100),
                status: Random.pick(['pending', 'unapproved', 'noneOrder', 'ordering', 'underShelf']),
                activityPhotos: Random.image()+','+Random.image()+','+ Random.image(),
                stayOverPhotos: Random.image()+','+ Random.image()+','+ Random.image()
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
    // 评价 列表
    Mock.mock(/\/admin\/comment/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(100000000, 200000000),
                score: Random.integer(0, 100),
                detail: "评论" + Random.integer(0),
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
            data: {
                list: data,
                total: Random.integer(15, 550)
            }
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
                orderTime: Random.date(),
                useTime: Random.datetime(),
                total: Random.integer(0, 1000),
                status: Random.pick(['unused', 'used', 'overdue', 'refunded']),
                customerNum: Random.integer(0, 100),
                roomNum: Random.integer(0, 10),
                bedNum: Random.integer(0, 10),
                refunderName: "运营员" + Random.integer(0),
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
    // 客户留言 分页列表
    Mock.mock(/\/admin\/message/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                customerId: Random.integer(0),
                customerNick: "客户" + Random.integer(0),
                detail: "举报详情" + Random.integer(0),
                time: Random.datetime(),
                replyList: [
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        detail: "内容" + Random.integer(0)
                    },
                    {
                        operator: "运营人" + Random.integer(0),
                        time: Random.date(),
                        detail: "内容" + Random.integer(0)
                    }
                ],
                status: Random.pick(['pending', 'replied'])
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
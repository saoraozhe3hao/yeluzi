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
    // 供应商审核 列表
    Mock.mock(/\/admin\/custom\/service\/audit\/suppliers/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                userId: Random.integer(0),
                companyName: "公司" + Random.integer(0),
                corporation: "法定代表人" + Random.integer(0),
                companyAddress: "地址" + Random.integer(0),
                companyLicence: Random.integer(0),
                companyLicencePic: Random.dataImage('178x178'),
                saleLicence: Random.integer(0),
                saleLicencePic: Random.dataImage('178x178'),
                danSaleLicense: Random.integer(0),
                danSaleLicensePic: Random.dataImage('178x178'),
                bankOpenId: Random.integer(0),
                bankOpenPic: Random.dataImage('178x178'),
                corCertId: Random.integer(0),
                corCertPic: Random.dataImage('178x178'),
                userName: "联系人" + Random.integer(0),
                userPhone: Random.integer(10000000000, 19999999999),
                position: Random.pick(["老板", "销售", "财务"]),
                auditUserName: "审核人" + Random.integer(0),
                applyTime: Random.datetime(),
                auditState: Random.pick(["1", "2", "3"]),
                auditStateStr: Random.pick(["待审核", "已审核", "未通过"]),
                auditTime: Random.datetime()
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
    // 客户审核 列表
    Mock.mock(/\/admin\/custom\/service\/audit\/members/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                companyName: "公司" + Random.integer(0),
                corporation: "法定代表人" + Random.integer(0),
                companyLicence: Random.integer(0),
                companyLicencePic: Random.dataImage('178x178'),
                danSaleLicense: Random.integer(0),
                danSaleLicensePic: Random.dataImage('178x178'),
                userName: "申请人" + Random.integer(0),
                userPhone: Random.integer(10000000000, 19999999999),
                applyTime: Random.datetime(),
                auditId: Random.integer(0),
                auditUserName: "审核人" + Random.integer(0),
                auditState: Random.pick(["1", "2", "3"]),
                auditStateStr: Random.pick(["通过", "未通过", "待审核"]),
                auditTime: Random.datetime()
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
    // 客服系统，订单 列表
    Mock.mock(/\/admin\/custom\/service\/orders/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                orderId: Random.integer(2200008100000, 3200008199999),
                inquiryId: Random.integer(2323, 3323),
                supplyId: Random.integer(100000060, 200000060),
                supplyName: "供应商" + Random.integer(0),
                stationName: "油站" + Random.integer(0),
                stationAddress: "地址" + Random.integer(0),
                contacts: "联系人" + Random.integer(0),
                phone: Random.integer(10000000000, 19999999999),
                goodsId: Random.integer(110000012, 210000012),
                oilNo: Random.pick(["0#", "92#", "95#", "-10#"]),
                level: Random.pick(["国五", "国四"]),
                source: Random.pick(["中石化", "中石油", "中海油"]),
                amount: Random.integer(1, 10000),
                unit: Random.pick(["吨", "升"]),
                pricePlan: Random.integer(0),
                priceType: Random.pick(["库提价(有票)", "库提价(无票)"]),
                price: Random.integer(10, 10000),
                dueMoney: Random.integer(0),
                payType: Random.pick(["对公转账", "对私转账"]),
                oilDepotId: Random.integer(0),
                oilDepotName: "油库" + Random.integer(1, 10000),
                oilDepotAddress: "地址" + Random.integer(0),
                oilDepotContacts: "联系人" + Random.integer(0),
                oilDepotPhone: Random.integer(10000000000, 19999999999),
                orderCreatedTime: Random.datetime(),
                payStateStr: Random.pick(["未支付", "已支付", "已取消", "已完成"]),
                confirmTime: Random.datetime(),
                confirmUserName: "人员" + Random.integer(0),
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

    // 供应商 企业信息
    Mock.mock(/\/admin\/system\/supply\/companyinfo/, function () {
        return {
            code: "0",
            data: {
                id: Random.integer(0),
                companyName: "公司" + Random.integer(0),
                corName: "法定代表人" + Random.integer(0),
                corCertId: Random.integer(0),
                corCertPic: Random.dataImage('178x178'),
                address: "地址" + Random.integer(0),
                businessLicence: Random.integer(0),
                businessLicencePic: Random.dataImage('178x178'),
                saleLicence: Random.integer(0),
                saleLicencePic: Random.dataImage('178x178'),
                danSaleLicense: Random.integer(0),
                danSaleLicensePic: Random.dataImage('178x178'),
                bankOpenId: Random.integer(0),
                bankOpenPic: Random.dataImage('178x178'),
                logo: Random.dataImage('178x178'),
                summary: "介绍" + Random.integer(0)
            }
        }
    });
    // 职位列表
    Mock.mock(/\/admin\/user\/positions/, function () {
        return {
            code: "0",
            data: [
                "老板",
                "销售",
                "财务"
            ]
        }
    });
    // 商品 列表
    Mock.mock(/\/admin\/goods\/list/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(100000000, 200000000),
                type: Random.pick(["汽油", "柴油"]),
                code: Random.pick(["0#", "92#", "95#", "-10#"]),
                level: Random.pick(["国五", "国四"]),
                source: Random.pick(["中石化", "中石油", "中海油"]),
                oilDepotId: commonId,
                oilDepot: "油库" + Random.integer(0),
                modifiedTime: Random.datetime(),
                modifier: "修改人" + Random.integer(0)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 全部商品 选型
    Mock.mock(/\/admin\/goods\/desc\/list/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(0),
                desc: "商品" + Random.integer(0)
            });
        }
        data.push({
            id: goodsId,
            desc: "商品" + Random.integer(0)
        });
        return {
            code: "0",
            data: data
        }
    });
    // 客户 全部列表
    Mock.mock(/\/admin\/system\/oildepotincompany/, function () {
        let data = [];
        for (let i = 0; i < 5; i++) {
            data.push({
                id: Random.integer(0),
                name: "油库" + Random.integer(0),
                address: "地址" + Random.integer(0),
                contacts: "联系人" + Random.integer(0),
                phone: Random.integer(10000000000, 19999999999)
            });
        }
        data.push(
            {
                id: commonId,
                name: "油库" + Random.integer(0),
                address: "地址" + Random.integer(0),
                contacts: "联系人" + Random.integer(0),
                phone: Random.integer(10000000000, 19999999999)
            }
        );
        return {
            code: "0",
            data: data
        }
    });
    // 商品标号 选项
    Mock.mock(/\/admin\/goods\/codes/, function () {
        return {
            code: "0",
            data: [
                "0# 车柴",
                "-10# 车柴",
                "-20# 车柴",
                "-35# 车柴"
            ]
        }
    });
    // 商品级别 选项
    Mock.mock(/\/admin\/goods\/levels/, function () {
        return {
            code: "0",
            data: [
                "国V",
                "国VI"
            ]
        }
    });
    // 商品品牌 选项
    Mock.mock(/\/admin\/goods\/sources$/, function () {
        return {
            code: "0",
            data: [
                "中石油",
                "中石化"
            ]
        }
    });
    // 价格 列表
    Mock.mock(/(goodsonsale\/list|audit\/goods)/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(12012140002580, 22012140002589),
                enabled: Random.pick([0, 1]),
                goodsId: goodsId,
                goodsName: Random.pick(["0#", "92#", "95#", "-10#"]),
                province: "省份" + Random.integer(10, 99),
                city: "区域" + Random.integer(10, 99),
                price: Random.integer(10000, 90000),
                settlementType: Random.pick(["先款后货", "先货后款"]),
                upTime: Random.datetime(),
                modifiedTime: Random.datetime(),
                modifier: "修改人" + Random.integer(0)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 品牌 分页列表
    Mock.mock(/goods\/sources\/list/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(12012140002580, 22012140002589),
                name: "品牌" + Random.integer(10, 99),
                createdTime: Random.datetime()
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 区域 列表
    Mock.mock(/\/admin\/commons\/cities/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                cityId: Random.integer(0),
                cityName: "区域" + Random.integer(0)
            });
        }
        return {
            code: "0",
            data: data
        }
    });
    // 询盘 列表
    Mock.mock(/\/admin\/inquiries/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: Random.integer(2324, 3324),
                stationId: Random.integer(0),
                stationName: "油站" + Random.integer(0),
                stationAddress: "地址" + Random.integer(0),
                contacts: "联系人" + Random.integer(0),
                phone: Random.integer(10000000000, 19999999999),
                goodsId: Random.integer(100000060, 200000060),
                oilNo: Random.pick(["0#", "92#", "95#", "-10#"]),
                level: Random.pick(["国五", "国四"]),
                source: Random.pick(["中石化", "中石油", "中海油"]),
                amount: Random.integer(1, 10000),
                unit: Random.pick(["吨", "升"]),
                goodsSalesRuleId: Random.integer(1201214000245, 2201214000245),
                priceType: Random.pick(["库提价(有票)", "库提价(无票)"]),
                price: Random.integer(100, 10000),
                oilDepotAddressId: Random.integer(1, 10000),
                oilDepotName: "油库" + Random.integer(0),
                oilDepotAddress: "地址" + Random.integer(0),
                oilDepotContacts: "联系人" + Random.integer(0),
                oilDepotPhone: Random.integer(10000000000, 19999999999),
                createdTime: Random.datetime('yyyy-MM-dd HH:mm'),
                state: Random.pick(["未跟进", "已跟进", "已回绝", "已转订单"]),
                updateTime: Random.datetime('yyyy-MM-dd HH:mm'),
                updateUserName: "更新人" + Random.integer(0)
            });
        }
        return {
            code: "0",
            data: data,
            recordsTotal: Random.integer(15, 550)
        }
    });
    // 询盘跟踪记录 列表
    Mock.mock(/\/admin\/inquiry\/.*\/records/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                time: Random.datetime(0),
                userName: Random.pick(["张三", "李四", "王五", "赵六"]),
                operation: Random.pick(["已将本询盘单回绝", "已将本询盘单转为订单", "添加了跟进记录"]),
                content: "跟踪内容" + Random.integer(0)
            });
        }
        return {
            code: "0",
            data: data
        }
    });
    // 询盘 详情
    Mock.mock(/\/admin\/inquiry\/.+$/, function () {
        return {
            code: "0",
            data: {
                inquiryId: Random.integer(0),
                supplyCompanyId: Random.integer(0),
                supplyCompanyName: "供应商" + Random.integer(0),
                stationName: "油站" + Random.integer(0),
                stationAddress: "地址" + Random.integer(0),
                contacts: "联系人" + Random.integer(0),
                phone: Random.integer(10000000000, 19999999999),
                goodsId: goodsId,
                amount: Random.integer(0, 1000),
                unit: "单位" + Random.integer(0),
                priceType: "类型" + Random.integer(0),
                price: Random.integer(0, 1000)
            }
        }
    });
    // 订单 列表
    Mock.mock(/\/admin\/orders/, function () {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                orderId: Random.integer(2200012100000, 3200012199999),
                inquiryId: Random.integer(2323, 3323),
                stationName: "油站" + Random.integer(0),
                stationAddress: "地址" + Random.integer(0),
                stationContacts: "联系人" + Random.integer(0),
                phone: Random.integer(10000000000, 19999999999),
                goodsId: Random.integer(110000012, 210000012),
                oilNo: Random.pick(["0#", "92#", "95#", "-10#"]),
                level: Random.pick(["国五", "国四"]),
                source: Random.pick(["中石化", "中石油", "中海油"]),
                amount: Random.integer(1, 10000),
                unit: Random.pick(["吨", "升"]),
                priceType: Random.pick(["库提价(有票)", "库提价(无票)"]),
                price: Random.integer(1000, 10000),
                orderMoney: Random.integer(0),
                payType: Random.pick(["对公转账", "对私转账"]),
                oilDepotId: Random.integer(1, 10000),
                oilDepotName: "油库" + Random.integer(0),
                oilDepotAddress: "地址" + Random.integer(0),
                oilDepotContacts: "联系人" + Random.integer(0),
                oilDepotPhone: Random.integer(10000000000, 19999999999),
                createdTime: Random.datetime('yyyy-MM-dd HH:mm'),
                state: Random.pick(["未支付", "未确认", "已支付", "已取消", "已完成"]),
                confirmTime: Random.datetime('yyyy-MM-dd HH:mm'),
                confirmUserName: "人员" + Random.integer(0),
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
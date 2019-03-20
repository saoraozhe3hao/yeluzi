import Router from 'vue-router'

import BasicInfo from './mine/BasicInfo'
import ResetPwd from './mine/ResetPwd'
import ServiceSupplierVerify from './serviceVerify/supplier/List'
import ServiceCustomerVerify from './serviceVerify/customer/List'
import ServicePriceVerify from './serviceVerify/price/List'
import ServiceOrder from './serviceOrder/order/Index'
import ServiceOrderList from './serviceOrder/order/List'
import ServiceOrderAdd from './serviceOrder/order/Add'
import ServiceEnquiry from './serviceOrder/enquiry/List'
import ServiceCommodity from './serviceSupplier/commodity/List'
import ServicePrice from './serviceSupplier/price/List'
import ServiceTank from './serviceSupplier/tank/List'
import ServiceSupplier from './serviceSupplier/supplier/Index'
import ServiceSupplierList from './serviceSupplier/supplier/List'
import ServiceSupplierAdd from './serviceSupplier/supplier/Add'

import Customer from './user/customer/List'
import Merchant from './user/merchant/List'
import TipOff from './user/tipOff/List'
import Operator from './user/operator/List'
import SupplierBasic from './supplierMine/BasicInfo'
import SupplierCommodity from './supplierCommodity/commodity/List'
import SupplierPrice from './supplierCommodity/price/List'
import SupplierSource from './supplierCommodity/source/List'
import SupplierOrder from './supplierFinance/order/List'

export default new Router({
  routes: [
      {
          path: '/customer',      // 用户 - 客户
          component: Customer
      },
      {
          path: '/merchant',      // 用户 - 商户
          component: Merchant
      },
      {
          path: '/tipOff',      // 用户 - 商户举报
          component: TipOff
      },
      {
          path: '/operator',   // 用户 - 运营人员
          component: Operator
      },

      {
          path: '/basic',          // 我的 - 基本信息
          component: BasicInfo
      },
      {
          path: '/resetPwd',           // 我的 - 修改密码
          component: ResetPwd
      },
      {
          path: '/service-enquiry',        // 客服 - 询价单查询
          component: ServiceEnquiry
      },
      {
          path: '/service-order',          // 客服 - 订单查询
          component: ServiceOrder,
          children: [
              {
                  path: '',               // 客服 - 订单查询 - 订单列表
                  component: ServiceOrderList
              },
              {
                  path: 'add',                 // 客服 - 订单查询 - 新建订单
                  component: ServiceOrderAdd
              },
          ]
      },
      {
          path: '/service-supplier-verify',   // 客服 - 供应商审核
          component: ServiceSupplierVerify
      },
      {
          path: '/service-customer-verify',   // 客服 - 客户审核
          component: ServiceCustomerVerify
      },
      {
          path: '/service-price-verify',   // 客服 - 价格审核
          component: ServicePriceVerify
      },
      {
          path: '/service-supplier',          // 客服 - 非认证供应商管理
          component: ServiceSupplier,
          children: [
              {
                  path: '',               // 供应商 - 非认证供应商管理 - 供应商列表
                  component: ServiceSupplierList
              },
              {
                  path: 'add',                 // 供应商 - 非认证供应商管理 - 新建供应商
                  component: ServiceSupplierAdd
              },
          ]
      },
      {
          path: '/service-tank',        // 客服 - 油库管理
          component: ServiceTank
      },
      {
          path: '/service-commodity',        // 客服 - 商品管理
          component: ServiceCommodity
      },
      {
          path: '/service-price',        // 客服 - 价格管理
          component: ServicePrice
      },

      {
          path: '/supplier-basic',    // 供应商 - 基本资料
          component: SupplierBasic
      },
      {
          path: '/supplier-commodity',   // 供应商 - 商品管理
          component: SupplierCommodity
      },
      {
          path: '/supplier-price',    // 供应商 - 价格管理
          component: SupplierPrice
      },
      {
          path: '/supplier-source',    // 供应商 - 品牌管理
          component: SupplierSource
      },
      {
          path: '/supplier-order',          // 供应商 - 订单管理
          component: SupplierOrder
      }
  ]
})

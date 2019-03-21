import Router from 'vue-router'

import BasicInfo from './mine/BasicInfo'
import ResetPwd from './mine/ResetPwd'

import Operator from './user/operator/List'
import Customer from './user/customer/List'
import Message from './user/message/List'

import Product from './product/product/List'
import Merchant from './product/merchant/List'
import TipOff from './product/tipOff/List'

import Order from './order/order/List'
import Comment from './order/comment/List'

export default new Router({
  routes: [
      {
          path: '/basic',          // 我的 - 基本信息
          component: BasicInfo
      },
      {
          path: '/resetPwd',           // 我的 - 修改密码
          component: ResetPwd
      },

      {
          path: '/operator',   // 用户 - 运营人员
          component: Operator
      },
      {
          path: '/customer',      // 用户 - 客户
          component: Customer
      },
      {
          path: '/message',      // 用户 - 用户留言
          component: Message
      },

      {
          path: '/product',   // 商品 - 商品
          component: Product
      },
      {
          path: '/merchant',      // 商品 - 商户
          component: Merchant
      },
      {
          path: '/tipOff',      // 商品 - 商户举报
          component: TipOff
      },

      {
          path: '/comment',   // 订单 - 评价
          component: Comment
      },
      {
          path: '/order',   // 订单 - 订单
          component: Order
      },
  ]
})

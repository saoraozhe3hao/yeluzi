import Router from 'vue-router'

import BasicInfo from './mine/BasicInfo'
import ResetPwd from './mine/ResetPwd'

import Customer from './user/customer/List'
import Merchant from './user/merchant/List'
import TipOff from './user/tipOff/List'
import Operator from './user/operator/List'

import Product from './product/product/List'
import Comment from './product/comment/List'

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
          path: '/product',   // 商品 - 商品
          component: Product
      },
      {
          path: '/comment',   // 商品 - 评价
          component: Comment
      },
  ]
})

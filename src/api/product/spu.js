/**
 * SPU属性管理api
 */

import request from '@/utils/request'

// 获取spu 列表
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu信息
export const reqSpu = spuId => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// Spu图标接口
export const reqSpuImgList = spuId => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 平台全部销售属性
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 修改 || 添加SPU
export const reqAddOrUpdateSpu = spuInfo => {
  if (spuInfo.id) {
    // 参数有id， 修改spu
    request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    // 无id， 新增spu
    request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

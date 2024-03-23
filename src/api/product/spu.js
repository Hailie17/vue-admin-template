/**
 * SPU属性管理api
 */

import request from '@/utils/request'

// 获取spu 列表
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu信息
export const reqSpu = spuId => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息
export const reqTradeMarkList = () => request({ url: `/admin/product/bageTradeMark/getTradeMarkList`, method: 'get' })

// Spu图标接口
export const reqSpuImgList = spuId => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 平台全部销售属性
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

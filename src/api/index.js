/**
 * 将四个模块请求的接口函数统一返回
 */

import * as trademark from './product/tradeMark';
import * as attr from './product/attr';
import * as spu from './product/attr';
import * as sku from './product/attr';

// 对外暴露
export default {
  trademark,
  attr,
  spu,
  sku
}

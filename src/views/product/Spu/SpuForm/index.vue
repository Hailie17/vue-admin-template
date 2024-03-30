<template>
  <div>
    {{ unSelectSaleAttr }}
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmName" placeholder="请选择品牌">
          <el-option v-for="(item, index) in tradeMarkList" :key="item.id" :label="item.tmName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" value="">
          <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag v-for="tag in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false">{{ tag.saleAttrValueName }}</el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" size="small" class="input-new-tag" />
              <el-button v-else size="small" class="button-new-tag">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('changeScne', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        tmId: 0
      }, // spu信息属性
      tradeMarkList: [], // 品牌信息
      spuImageList: [], // spu图片信息
      attrId: '' // 收集未选择的销售属性的id
    }
  },
  computed: {
    unSelectSaleAttr() {
      const result = this.saleAttrList.filter(item => {
        return this.spuSaleAttrList.every(item1 => {
          // every方法返回布尔值
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    async initSpuData(row) {
      const spuResult = await this.$API.spu.reqSpu(row.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      const spuImageResult = await this.$API.spu.reqSpuImgList(row.id)
      if (spuImageResult.code === 200) {
        const listArr = spuImageResult.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
    }
  }
}
</script>

<style scoped></style>

<template>
  <div>
    {{ attrId }}
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
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList" :on-success="handlerSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrId" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrId" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" />
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">{{ tag.saleAttrValueName }}</el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" size="small" class="input-new-tag" @blur="handleInputConfirm(row)" />
              <el-button v-else size="small" class="button-new-tag" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
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
      attrId: '', // 收集未选择的销售属性的id
      saleAttrList: [],
      spuSaleAttrList: []
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
    handleRemove(file, fileList) {
      // file 删除的图片
      // fileList 删除后剩余的图片
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(':')
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrId = ''
    },
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      // 不能为空
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 不能重复
      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      if (!result) return
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
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
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 保存 || 编辑spu
    async addOrUpdateSpu() {
      // 图片需要有imgName 和 imageUrl 字段
      // map（） 返回新数组
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      const res = await this.$API.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
      }
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="">
    <el-card style="margin: 20px 0">
      <CategorySelect :show="scene == 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="!category3Id">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="200"></el-table-column>
          <el-table-column prop="description" label="SPU描述"> </el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="{ row, $index }">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" @click="updateSpu(row)" title="修改spu"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu所有sku列表"></hint-button>
              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @confirm="deleteAttr($index)" style="display: inline-block; margin-left: 10px">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 10px; text-align: center" :curret-page="page" @size-change="handleSizeChange" @current-change="getSPUList" :total="total" :page-size="limit" :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>
      </div>
      <!-- add -->
      <spu-form v-show="scene === 1" @changeScne="changeScne" ref="spu" />
      <sku-form v-show="scene === 2" />
    </el-card>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: 'Attr',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      page: 1,
      limit: 3,
      total: 0,
      records: [], // spu列表数据
      scene: 0 // 0-spu列表数据 1-添加spu|修改spu 2-添加spu
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getSPUList()
      }
    },
    async getSPUList(pages = 1) {
      this.page = pages
      const res = await this.$API.spu.reqSpuList(this.page, this.limit, this.category3Id)
      if (res.code === 200) {
        this.records = res.data.records
        this.total = res.data.total
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSPUList()
    },
    // 添加Spu值
    addAtrrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加Spu
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData()
    },
    // 更新Spu
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('请输入正确的Spu值')
        return
      }
      const isRepat = this.attrInfo.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === row.valueName
        }
      })
      if (isRepat) return
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus() // 获取表单元素实现聚焦
      })
    },
    // 气泡删除确认按钮
    deleteAttr(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.show = true
        this.$message({ type: 'success', message: '保存成功' })
        this.attrList()
      } catch (error) {
        // this.$message('保存失败')
      }
    },
    changeScne(scene) {
      this.scene = scene
      this.getSPUList(this.page)
    }
  }
}
</script>

<style scoped></style>

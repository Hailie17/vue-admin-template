<template>
  <div class="">
    <el-card style="margin: 20px 0">
      <CategorySelect :show="show" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="show">
        <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled="!category3Id">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="attrName" label="SPU名称" width="200"></el-table-column>
          <el-table-column prop="prop" label="SPU描述">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="(value, index) in row.attrValueList" :key="value.id" style="margin: 0 20px">{{ value.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="{ row, $index }">
              <hint-button type="warning" icon="el-icon-plus" size="mini" title="添加spu"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" title="修改spu"></hint-button>
              <hint-button type="warning" icon="el-icon-info" size="mini" title="查看当前spu所有sku列表"></hint-button>
              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @confirm="deleteAttr($index)" style="display: inline-block; margin-left: 10px">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 10px; text-align: center" :curret-page="page" @size-change="handleSizeChange" @current-change="getSPUList" :total="total" :page-size="limit" :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>
      </div>
      <!-- add -->
      <div v-show="!show">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addAtrrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
          <el-button @click="show = true">取消</el-button>
          <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
            <el-table-column align="center" label="序号" width="80"></el-table-column>
            <el-table-column label="属性值名称" prop="prop">
              <template slot-scope="{ row, $index }">
                <el-input v-if="row.flag" v-model="row.valueName" placeholder="请输入属性值" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
                <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttr($index)">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
          <el-button @click="show = true">取消</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      show: true,
      page: 1,
      limit: 3,
      total: 0,
      records: [], // spu列表数据
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
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
    // 添加属性值
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
    // 添加属性
    addAttr() {
      this.show = false
      // 清除数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id, // 收集3级id
        categoryLevel: 3
      }
    },
    // 更新属性
    updateAttr(row) {
      this.show = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false) // this.$set() 响应式
      })
    },
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('请输入正确的属性值')
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
    }
  }
}
</script>

<style scoped></style>

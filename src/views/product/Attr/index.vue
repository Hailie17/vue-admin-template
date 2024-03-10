<template>
  <div class="">
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="ifShowTable">
        <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled="!category3Id">添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" align="center" width="200"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" align="center">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="(value, index) in row.attrValueList" :key="value.id" style="margin: 0 20px">{{ value.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- add -->
      <div v-show="!ifShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addAtrrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
          <el-button @click="ifShowTable = true">取消</el-button>
          <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
            <el-table-column align="center" label="序号" width="80"></el-table-column>
            <el-table-column label="属性值名称" prop="prop">
              <template slot-scope="{ row, $index }">
                <el-input v-if="row.flag" v-model="row.valueName" placeholder="请输入属性名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
                <span v-else @click="row.flag = true" style="display: block">{{ row.valueName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary">保存</el-button>
          <el-button @click="ifShowTable = true">取消</el-button>
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
      ifShowTable: true,
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
        this.getAttrList()
      }
    },
    async getAttrList() {
      const res = await this.$API.attr.reqAttrList(this.category1Id, this.category2Id, this.category3Id)
      if (res.code === 200) {
        this.attrList = res.data
      }
    },
    // 添加属性值
    addAtrrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
    },
    // 添加属性
    addAttr() {
      this.ifShowTable = false
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
      this.ifShowTable = false
      this.attrInfo = cloneDeep(row)
    },
    toLook(row) {
      row.flag = false
    }
  }
}
</script>

<style scoped></style>

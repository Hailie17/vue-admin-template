<template>
  <div class="">
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="ifShowTable">
        <el-button type="primary" icon="el-icon-plus" @click="ifShowTable = false" :disabled="!category3Id">添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" align="center" width="200"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" align="center">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="(value, index) in row.attrValueList" :key="value.id" style="margin: 0 20px">{{ value.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scop="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- add -->
      <div v-show="!ifShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item prop="attrName" label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
          <el-button @click="ifShowTable = true">取消</el-button>
          <el-table style="width: 100%; margin: 20px 0" border>
            <el-table-column align="center" label="序号" width="80"></el-table-column>
            <el-table-column label="属性值名称"></el-table-column>
            <el-table-column label="操作"> </el-table-column>
          </el-table>
          <el-button type="primary">保存</el-button>
          <el-button @click="ifShowTable = true">取消</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
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
        attrValueList: [
          {
            attrId: 0,
            valueName: 'string'
          }
        ],
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
    }
  }
}
</script>

<style scoped></style>

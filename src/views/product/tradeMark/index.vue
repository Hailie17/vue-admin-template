<template>
  <div class="">
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0;">添加</el-button>
    <el-table :data="list" style="width: 100%;" border>
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row, $index}">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row, $index}">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px; textAlign: center" :curret-page="page"  @size-change="handleSizeChange" @current-change="getPageList" :total="total" :page-size="limit" :page-count="7" :page-sizes="[3,5,10]" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: []
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const res = await this.$API.trademark.reqTradeMarkList(page, limit)
      this.list = res.data.records
      this.total = res.data.total
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="">
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0;">添加</el-button>
    <el-table style="width: 100%;" border>
      <el-table-column prop="prop" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width"></el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px; textAlign: center" :curret-page="6" :total="99" :page-size="3" :page-count="3" :page-sizes="[3,5,10]" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>
  </div>
</template>

<script>
</script>

<style scoped></style>

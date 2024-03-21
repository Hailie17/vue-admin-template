<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌">
          <el-option v-for="(item, index) in tradeMarkList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="" list-type="picture-card" :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select>
          <el-option></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table>
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column label="属性名"></el-table-column>
          <el-table-column label="属性值名称列表"></el-table-column>
          <el-table-column label="操作"></el-table-column>
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
    return {}
  },
  methods: {
    initSpuData(row) {
      console.log('发请求', row)
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="(item, index) in list1" :key="item.id" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in list1" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="value" placeholder="请选择"> <el-option v-for="item in list1" :key="item.value" :label="item.label" :value="item.value" / > </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      list1: [],
      value: ''
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    }
  }
}
</script>

<style scoped></style>

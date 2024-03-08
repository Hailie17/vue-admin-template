<template>
  <div class="">
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handler1">
          <el-option v-for="(item, index) in list1" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handler2">
          <el-option v-for="item in list2" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handler3">
          <el-option v-for="item in list3" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
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
    },
    async handler1() {
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const res = await this.$API.attr.reqCategory2List(category1Id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    async handler2() {
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const res = await this.$API.attr.reqCategory3List(category2Id)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    handler3() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style scoped></style>

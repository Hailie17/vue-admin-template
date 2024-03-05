<template>
  <div class="">
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px; textalign: center" :curret-page="page" @size-change="handleSizeChange" @current-change="getPageList" :total="total" :page-size="limit" :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>

    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogVisible">
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrupdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称 2-10位'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请填写品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请选择品牌图片' }]
      }
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
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 添加品牌
    showDialog() {
      this.dialogVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 修改品牌
    updateTradeMark(row) {
      this.dialogVisible = true
      this.tmForm = { ...row }
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加或修改提交按钮
    addOrupdateTradeMark() {
      this.$refs.ruleForm.validate(async success => {
        if (success) {
          this.dialogVisible = false
          const res = await this.$API.trademark.reqAddorupdateTradeMark(this.tmForm)
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改成功' : '添加成功'
            })
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
.el-pagination {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

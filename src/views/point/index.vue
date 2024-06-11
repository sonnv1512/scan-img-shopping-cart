<template>
  <div class="lx-body">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span class="title">Danh sách tài khoản</span>
        <div class="justify-end">
          <a-button type="primary" @click="handleOpen">
            <a-icon type="plus-circle" />Tạo điểm
          </a-button>
        </div>
      </div>
      <el-table :data="tableData" :row-class-name="$func.tableRowClassName" :v-loading="loadingTable">
        <el-table-column prop="name" label="Tên điểm" width="180" />
        <el-table-column label="Tỉnh/Thành phố">
          <template slot-scope="scope">{{ scope.row.province ? scope.row.province.name : '' }}</template>
        </el-table-column>
        <el-table-column label="Ngày giờ tạo">
          <template slot-scope="scope">{{ scope.row.CreatedAt | customDate('#hhhh#h:#mm# #DD#/#MM#/#YYYY#') }}</template>
        </el-table-column>
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            <a-button
              shape="circle"
              icon="delete"
              type="danger"
              @click="deletePoint(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="Khai báo điểm"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="form form-1col">
        <div class="form-item">
          <label for="name">Chọn tỉnh/thành phố</label>
          <el-select
            v-model="formSubmit.provinceId"
            size="medium"
            placeholder="Chọn thành phố"
            clearable
            filterable
          >
            <el-option
              v-for="item in ListProvince"
              :key="item.ID + 'ListProvince'"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </div>
        <div class="form-item">
          <label for="name">Tên điểm</label>
          <el-input v-model="formSubmit.name" placeholder="Nhập tên điểm" />
        </div>
        <!-- <div class="form-item">
          <label for="name">Trạng thái</label>
          <el-select
            v-model="formSubmit.status"
            size="medium"
            placeholder="Chọn trạng thái"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <a-button type="primary" :loading="loadingSubmit" @click="submitForm">Lưu</a-button>
        <a-button @click="dialogVisible = false">Đóng</a-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Province from '@/class/Province'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formSubmit: {
        provinceId: null,
        name: null,
        status: 1
      },
      options: [],
      tableData: [],
      ListProvince: Province,
      dialogVisible: false,
      loadingTable: false,
      loadingSubmit: false
    }
  },
  computed: {
    ...mapGetters([
      'token', 'serverIp'
    ])
  },
  mounted() {
    this.getListPoint()
  },
  methods: {
    submitForm: function() {
      const { provinceId, name, status } = this.formSubmit
      const params = { provinceId, name, status }
      this.createPoint(params)
    },
    createPoint(params) {
      const self = this
      self.loadingSubmit = true
      axios({
        method: 'POST',
        url: this.serverIp + 'point/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Thêm điểm thành công!', 'success')
          self.getListPoint()
          self.loadingSubmit = false
        })
        .catch(function(err) {
          self.notify(null, `Thêm điểm thất lại, lỗi: ${err}`, 'error')
          self.loadingSubmit = false
        })
    },
    getListPoint() {
      const self = this
      self.loadingTable = true
      axios({
        method: 'GET',
        url: this.serverIp + 'point/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      })
        .then(function(res) {
          self.tableData = res.data.Data
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    deletePoint(item) {
      const self = this
      axios({
        method: 'DELETE',
        url: this.serverIp + 'point/' + item.ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      })
        .then(function(res) {
          self.notify(null, 'Xóa điểm thành công!', 'success')
          self.getListPoint()
        })
        .catch(function(err) {
          self.notify(null, `Xóa điểm thất lại, lỗi: ${err}`, 'error')
        })
    },
    handleOpen() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    notify(object, content, type) {
      this.$notification[type]({
        message: object || 'Thông báo',
        description: content || ''
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

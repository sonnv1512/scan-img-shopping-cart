<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Danh sách tài khoản</span>
        <div class="justify-end">
          <a-button type="primary" @click="handleOpen">
            <a-icon type="plus-circle" />Tạo tài khoản
          </a-button>
        </div>
      </div>
      <!-- start: table -->
      <el-table v-loading="loadingTable" :data="tableData" :row-class-name="$func.tableRowClassName">
        <el-table-column type="index" width="50" />
        <el-table-column label="Đơn vị">
          <template slot-scope="scope">
            <span v-if="scope.row.userLevel !== UserLevel.admin">{{ scope.row.departmentName || scope.row.divisionName}}</span>
            <span v-if="scope.row.userLevel === UserLevel.admin">Cục Đường Thủy</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="Tài khoản" />
        <el-table-column label="Cấp tài khoản">
          <template slot-scope="scope">{{ scope.row.userLevel | userLevel }}</template>
        </el-table-column>
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            <a-popconfirm
              title="Xác nhận thao tác xóa tài khoản"
              ok-text="Đồng ý"
              cancel-text="Hủy"
              @confirm="confirm($event, 'Xóa tài khoản', scope.row)"
              @cancel="cancel($event, 'Xóa tài khoản')"
            >
              <a-button
                shape="circle"
                icon="delete"
                type="danger"
              />
            </a-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- start: dialiog -->
    <el-dialog
      title="Tạo tài khoản"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="form form-1col">
        <div class="form-item">
          <label for="name">Loại</label>
          <el-select
            v-model="formSubmit.userLevel"
            size="medium"
            placeholder="Chọn loại tài khoản"
            disabled
          >
            <!-- <el-option label="Tài khoản cấp Tổng Cục" :value="0" /> -->
            <el-option label="Tài khoản Sở" :value="2" />
            <el-option label="Tài khoản nhân viên Sở" :value="3" />
          </el-select>
        </div>
        <div class="form-item">
          <label for="name">Tên sở</label>
          <el-select
            v-model="formSubmit.department"
            size="medium"
            placeholder="Chọn sở"
            :disabled="disableSelect"
          >
            <el-option
              v-for="item in ListProvince"
              :key="item.ID"
              :label="`Sở ${item.name}`"
              :value="item.ID"
            />
          </el-select>
        </div>
        <div class="form-item">
          <label for="name">Tên đăng nhập</label>
          <el-input v-model="formSubmit.userName" placeholder="" />
        </div>
        <div class="form-item">
          <label for="name">Mật khẩu</label>
          <el-input
            v-model="formSubmit.password"
            placeholder=""
            show-password
          />
        </div>
        <div class="form-item">
          <label for="name">Nhập lại mật khẩu</label>
          <el-input
            v-model="formSubmit.verifyPassword"
            placeholder=""
            show-password
          />
        </div>
        <div class="form-item">
          <label for="name">Email</label>
          <el-input v-model="formSubmit.email" placeholder="" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <a-button
          type="primary"
          :loading="loadingSubmit"
          @click="submitForm"
        >Lưu</a-button>
        <a-button @click="dialogVisible = false">Đóng</a-button>
      </span>
    </el-dialog>
    <!-- end: dialiog -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import Province from '@/class/Province'
import UserLevel from '@/class/UserLevel'

export default {
  data() {
    return {
      formSearch: {
        value1: null,
        value2: null
      },
      formSubmit: {
        division: null,
        department: null,
        userName: null,
        password: null,
        verifyPassword: null,
        email: null,
        userLevel: null
      },
      options: [],
      tableData: [],
      dialogVisible: false,
      loadingSubmit: false,
      loadingTable: false,
      ListProvince: Province,
      ListDivision: this.$func.renderDivision(),
      UserLevel: UserLevel,
      disableSelect: false
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo', 'serverIp']),
    currentUserLevel() {
      const userLevel = this.userInfo && this.userInfo.user_system ? this.userInfo.user_system.userLevel : null
      return userLevel
    }
  },
  mounted() {
    this.getListUser()
    console.log(this.userInfo)
    if (this.currentUserLevel !== UserLevel.admin) {
      this.disableSelect = true
    }
    if (this.currentUserLevel === UserLevel.admin) {
      this.formSubmit.userLevel = UserLevel.staff
    }
    if (this.currentUserLevel === UserLevel.staff) {
      this.formSubmit.userLevel = UserLevel.employee
      this.formSubmit.department = this.userInfo.user_system.departmentId
    }
  },
  methods: {
    checkValid() {
      //  division, department,
      const { userLevel, division, department, userName, password, verifyPassword, email } = this.formSubmit
      if (!userLevel) {
        this.notify(null, 'Vui lòng chọn loại tài khoản', 'warning')
        return false
      }
      // if (userLevel === 2 && !department) {
      //   this.notify(null, 'Vui lòng chọn "Sở" cho tài khoản', 'warning')
      //   return false
      // }
      if (this.currentUserLevel !== UserLevel.superAdmin && !department) {
        this.notify(null, 'Vui lòng chọn thông tin "Sở" cho tài khoản', 'warning')
        return false
      }
      if (!userName) {
        this.notify(null, 'Vui lòng điền tên tài khoản', 'warning')
        return false
      }
      if (password.split('').length < 6) {
        this.notify(null, 'Mật khẩu dài ít nhất 6 ký tự', 'warning')
        return false
      }
      if (verifyPassword !== password) {
        this.notify(null, 'Mật khẩu không khớp vui lòng nhập lại', 'warning')
        return false
      }
      if (!this.$func.checkValidEmail(email)) {
        this.notify(null, 'Email không đúng định dạng', 'warning')
        return false
      }
      return true
    },
    submitForm: function() {
      if (!this.checkValid()) {
        return
      }
      const { division, department, userName, password, userLevel, email } = this.formSubmit
      const params = {
        userName: userName,
        password: password,
        salt: this.$func.renderRandomStr(10),
        userType: 0, // hiện tại chưa dùng userType
        userLevel: userLevel,
        email: email
      }
      if (department) {
        params.departmentId = department
        params.departmentName = 'Sở ' + this.ListProvince.find(x => x.ID === department).name || ''
      }
      this.createUser(params)
    },
    createUser(params) {
      const self = this
      self.loadingSubmit = true
      axios({
        method: 'POST',
        url: this.serverIp + 'user-system/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Thêm tài khoản thành công!', 'success')
          self.getListUser()
          self.loadingSubmit = false
        })
        .catch(function(err) {
          self.notify(null, `Thêm tài khoản thất lại, lỗi: ${err}`, 'error')
          self.loadingSubmit = false
        })
    },
    getListUser() {
      const self = this
      self.loadingTable = true
      axios({
        method: 'GET',
        url: this.serverIp + 'user-system/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      })
        .then(function(res) {
          self.tableData = res.data.Data.filter(x => x.userLevel !== 0)
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    handleDeleteUser(item) {
      const self = this
      axios({
        method: 'DELETE',
        url: this.serverIp + 'user-system/' + item.ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      })
        .then(function(res) {
          self.notify(null, 'Xóa tài khoản thành công!', 'success')
          self.getListUser()
        })
        .catch(function(err) {
          self.notify(null, `Xóa tài khoản thất lại, lỗi: ${err}`, 'error')
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
    },
    confirm(e, actionName = null, data = null) {
      // console.log(e)
      this.$message.success(`Xác nhận thao tác ${actionName ? `: ${actionName}` : ''}`)
      this.handleDeleteUser(data)
    },
    cancel(e, actionName = null) {
      // console.log(e)
      this.$message.error(`Hủy thao tác ${actionName ? `: ${actionName}` : ''}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-contain {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
  .filter-item {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    label {
      color: #383f47;
      font-size: 14px;
      font-weight: normal;
      margin-right: 10px;
    }
  }
}
</style>

<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Tạo thông báo mới </span>
        <div class="justify-end">
          <!-- operation button -->
        </div>
      </div>
      <!-- end: header -->
      <div class="flow-route-contain">
        <div class="left-side form-1col">
          <div class="form-item">
            <label for="name">Tiêu đề</label>
            <el-input
              v-model="formSubmit.name"
              size="medium"
              placeholder="Nhập tiêu đề"
              clearable
            />
          </div>
          <div class="form-item">
            <label for="name">Nội dung</label>
            <el-input
              v-model="formSubmit.name"
              size="medium"
              placeholder="Nhập nội dung"
              clearable
            />
          </div>
          <div class="form-item">
            <label for="name">Hình ảnh (đường dẫn)</label>
            <el-input
              v-model="formSubmit.name"
              size="medium"
              placeholder="Nhập đường dẫn ảnh"
              clearable
            />
          </div>
          <!-- <div class="form-item">
            <label>Tỉnh</label>
            <el-select
              v-model="formSubmit.provinces"
              size="medium"
              placeholder="Chọn tỉnh/thành phố"
              clearable
              multiple
              filterable
              :disabled="disableSelect"
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
            <label>Luồng</label>
            <el-input
              v-model="formSubmit.flowRouteProvinceName"
              size="medium"
              type="textarea"
              :rows="2"
              placeholder="Nhập luồng ..."
              clearable
            />
          </div>
          <div class="form-item">
            <label>Loại luồng</label>
            <div>
              <el-radio v-model="formSubmit.type" disabled :label="0">Luồng xanh nội tỉnh</el-radio>
              <el-radio v-model="formSubmit.type" disabled :label="1">Luồng xanh quốc gia</el-radio>
            </div>
          </div> -->
          <div class="justify-end">
            <a-button @click="resetForm">
              Làm mới
            </a-button>
            <a-button :loading="loadingSubmit" type="primary" @click="saveFlow">
              Lưu
            </a-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import Province from '@/class/Province'
import UserLevel from '@/class/UserLevel'

export default {
  name: 'SimpleRoute',
  data() {
    return {
      formSubmit: {
        name: null,
        provinces: [],
        flowRouteProvinceName: null,
        status: 1,
        type: 0
      },
      ListSubmit: [],
      ListProvince: Province,
      UserLevel: UserLevel,
      disableSelect: false,
      loadingSubmit: true
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo', 'serverIp']),
    currentUserLevel() {
      const userLevel = this.userInfo && this.userInfo.user_system ? this.userInfo.user_system.userLevel : null
      return userLevel
    },
    currentUserDepartment() {
      const department = this.userInfo && this.userInfo.user_system ? this.userInfo.user_system.departmentId : null
      return department
    }
  },
  mounted() {
  },
  methods: {
    checkValid() {
      const { name, provinces, flowRouteProvinceName } = this.formSubmit
      if (!name) {
        this.notify(null, 'Trường "Tên thông báo" không được để trống!', 'warning')
        return false
      }
      if (provinces.length === 0) {
        this.notify(null, 'Trường "Tỉnh" không được để trống!', 'warning')
        return false
      }
      if (!flowRouteProvinceName) {
        this.notify(null, 'Trường "thông báo" không được để trống!', 'warning')
        return false
      }
      return true
    },
    saveFlow() {
      if (!this.checkValid()) {
        return
      }
      this.loadingSubmit = true
      const {} = this.formSubmit
      const params = {
        name: name,
        flowRouteProvinceName: flowRouteProvinceName,
        status: 1,
        type: type,
        provinces: provinces.map(x => this.ListProvince.find(item => item.ID === x))
      }
      this.createFlowRoute(params)
    },
    createFlowRoute(params) {
      const self = this
      axios({
        method: 'POST',
        url: this.serverIp + 'flow-route-province/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Thêm thông báo mới thành công!', 'success')
          self.loadingSubmit = false
        })
        .catch(function(err) {
          self.notify(null, `Thêm thông báo thất lại, lỗi: ${err}`, 'error')
          self.loadingSubmit = false
        })
    },
    notify(object, content, type) {
      this.$notification[type]({
        message: object || 'Thông báo',
        description: content || ''
      })
    },
    resetForm() {
      // do reset form submit
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-route-contain {
  display: grid;
  grid-template-columns: 60%;
  justify-content: center;
}
.flowPoint-contain {
  display: grid;
  grid-gap: 5px;
}
</style>

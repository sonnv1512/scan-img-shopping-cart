<template>
  <div class="lx-body">
    <div class="tranfer">
      <h2>Điều chuyển phân tải duyệt đơn giữa các tỉnh</h2>
      <div class="filter-contain">
        <div class="filter-item">
          <label for="filter">Tỉnh cần chia</label>
          <el-select
            v-model="formSubmit.managerIdFrom"
            size="medium"
            placeholder="Chọn tỉnh/thành phố"
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
        <div class="filter-item">
          <label for="filter">Số lượng chuyển tối đa</label>
          <el-input-number
            v-model="formSubmit.limit"
            placeholder="Nhập số lượng cần chuyển"
            :step="50"
          />
        </div>
        <div class="filter-item">
          <label for="filter">Tỉnh tiếp nhận</label>
          <el-select
            v-model="formSubmit.managerIdTo"
            size="medium"
            placeholder="Chọn tỉnh/thành phố"
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
      </div>
      <p class="caution">
        Hệ thống chia tải chỉ áp dụng với những đơn ở trạng thái đang chờ duyệt
      </p>
      <a-button
        class="justify-start"
        type="primary"
        :loading="loadingSubmit"
        @click="submitForm"
      >
        Chuyển hồ sơ
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import Province from '@/class/Province'

export default {
  name: 'ChangePassword',
  data() {
    return {
      formSubmit: {
        managerIdFrom: null,
        limit: null,
        managerIdTo: null
      },
      loadingSubmit: false,
      ListProvince: Province
    }
  },
  computed: {
    ...mapGetters(['token', 'name', 'userInfo', 'serverIp'])
  },
  methods: {
    submitForm() {
      const self = this
      const { managerIdFrom, limit, managerIdTo } = this.formSubmit
      if (!managerIdFrom) {
        this.notify(null, 'Chưa chọn "Tỉnh cần chia"', 'warning')
        return
      }
      if (!limit || limit <= 0) {
        this.notify(null, 'Số lượng chuyển chưa hợp lệ', 'warning')
        return
      }
      if (!managerIdTo) {
        this.notify(null, 'Chưa chọn "Tỉnh tiếp nhận"', 'warning')
        return
      }
      if (managerIdFrom === managerIdTo) {
        this.notify(null, '"Tỉnh cần chia" không được trùng với "Tỉnh tiếp nhận"', 'warning')
        return
      }
      self.loadingSubmit = true
      const params = {
        managerIdFrom: managerIdFrom,
        limit: limit,
        managerIdTo: managerIdTo
      }
      console.log(params)
      axios({
        method: 'POST',
        url: this.serverIp + 'vehicle-flow/transfer',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Chuyển hồ sơ thành công', 'success')
          self.loadingSubmit = false
        })
        .catch(function(err) {
          console.log(err)
          self.notify(null, 'Chuyển hồ sơ thật bại', 'warning')
          self.loadingTable = false
        })
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

<style lang="scss" scoped>
.tranfer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;
  &-input {
    width: 300px;
  }
  &-btn {
    margin-top: 10px;
  }
  &-input + &-input {
    margin-top: 10px;
  }
  .caution {
    color: red;
  }
}
</style>

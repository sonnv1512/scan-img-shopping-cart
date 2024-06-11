<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Danh sách các luồng</span>
        <div class="justify-end">
          <a-button type="primary" @click="openAddFlowRoute">
            <a-icon type="plus-circle" />Tạo luồng
          </a-button>
        </div>
      </div>
      <!-- end: header -->
      <div class="filter-contain">
        <div class="filter-item">
          <label for="filter">Tỉnh</label>
          <el-select
            v-model="formSearch.provinceId"
            size="medium"
            placeholder="Chọn tỉnh/thành phố"
            clearable
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
        <div class="filter-item">
          <label for="filter">Tên luồng</label>
          <el-input
            v-model="formSearch.name"
            size="medium"
            placeholder="Nhập tên luồng .."
            clearable
          />
        </div>
        <div class="filter-item">
          <label for="filter">Loại luồng</label>
          <el-select
            v-model="formSearch.types"
            size="medium"
            placeholder="Chọn tất cả"
            clearable
            multiple
          >
            <el-option
              v-for="item in ListType"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </div>
        <a-button class="justify-start" type="primary" @click="changePage(1)">
          Lấy thông tin
        </a-button>
      </div>
      <!-- start: table -->
      <a-spin :spinning="loadingTable">
        <el-table :data="tableData" :row-class-name="$func.tableRowClassName">
          <el-table-column type="index" width="50">
            <template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.defaultPageSize + (scope.$index + 1) }}</template>
          </el-table-column>
          <el-table-column label="Tỉnh" width="180">
            <template slot-scope="scope">{{
              scope.row.provinces.map(x => x.name).join(', ')
            }}</template>
          </el-table-column>
          <el-table-column prop="name" label="Tên luồng" />
          <el-table-column label="Luồng">
            <template slot-scope="scope">{{
              scope.row.flowRouteProvinceName
            }}</template>
          </el-table-column>
          <el-table-column label="Loại luồng">
            <template slot-scope="scope">
              <a-tag :color="scope.row.type == 1 ? 'cyan' : ''">
                {{
                  scope.row.type == 1
                    ? 'Luồng xanh Quốc gia'
                    : 'Luồng xanh Nội tỉnh'
                }}
              </a-tag>
            </template>
          </el-table-column>
          <el-table-column label="" width="120">
            <template
              v-if="
                (scope.row.type == 1 && currentUserLevel == UserLevel.admin) ||
                (scope.row.type == 0 && (currentUserLevel == UserLevel.staff || currentUserLevel == UserLevel.employee))
              "
              slot-scope="scope"
            >
              <a-button
                shape="circle"
                icon="edit"
                type="warning"
                @click="handleEdit(scope.row)"
              />
              <a-popconfirm
                title="Xác nhận thao tác xóa luồng"
                ok-text="Đồng ý"
                cancel-text="Hủy"
                @confirm="confirm($event, 'Xóa luồng', scope.row)"
                @cancel="cancel($event, 'Xóa luồng')"
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
      </a-spin>
      <div class="pagination-table">
        <a-pagination
          v-model="pagination.currentPage"
          class="pagination-table"
          :total="pagination.FilteredData"
          show-less-items
          :default-page-size="pagination.defaultPageSize"
          @change="changePage"
        />
      </div>
    </el-card>
    <el-dialog
      title="Sửa luồng"
      :visible.sync="dialogEditRoute"
      width="40%"
    >
      <div class="form form-1col">
        <div class="form-item">
          <label for="name">Tên luồng</label>
          <el-input
            v-model="formSubmit.name"
            size="medium"
            placeholder="Nhập tên luồng"
            clearable
          />
        </div>
        <div class="form-item">
          <label for="name">Tỉnh</label>
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
          <label for="name">Luồng</label>
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
          <label for="name">Loại</label>
          <div>
            <el-radio v-model="formSubmit.type" disabled :label="0">Luồng xanh nội tỉnh</el-radio>
            <el-radio v-model="formSubmit.type" disabled :label="1">Luồng xanh quốc gia</el-radio>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <a-button
          class="justify-end"
          type="primary"
          @click="submitForm"
        >Lưu thay đổi</a-button>
        <a-button
          class="justify-end"
          @click="dialogEditRoute = false"
        >Hủy</a-button>
      </span>
    </el-dialog>
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
        types: [],
        provinceId: null,
        name: null
      },
      pagination: {
        currentPage: 1,
        defaultPageSize: 50,
        FilteredData: 100
      },
      tableData: [],
      disableSelect: false,
      loadingTable: true,
      UserLevel: UserLevel,
      ListProvince: Province,
      ListStatus: this.$func.renderFlowRouteProvince_status(),
      ListType: this.$func.FlowRouteProvince_type(),
      // edit route
      dialogEditRoute: false,
      formSubmit: {
        ID: null,
        name: null,
        provinces: null,
        flowRouteProvinceName: null,
        type: 0
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo', 'serverIp']),
    currentUserLevel() {
      const userLevel =
        this.userInfo && this.userInfo.user_system
          ? this.userInfo.user_system.userLevel
          : null
      return userLevel
    },
    currentUserDepartment() {
      const department =
        this.userInfo && this.userInfo.user_system
          ? this.userInfo.user_system.departmentId
          : null
      return department
    }
  },
  mounted() {
    if (this.currentUserLevel === UserLevel.staff) {
      this.disableSelect = true
      this.formSearch.provinceId = this.userInfo.user_system.departmentId
    }
    this.getListFlowRoute()
  },
  methods: {
    checkValid() {
      const { name, provinces, flowRouteProvinceName } = this.formSubmit
      if (!name) {
        this.notify(null, 'Trường "Tên luồng" không được để trống!', 'warning')
        return false
      }
      if (provinces.length === 0) {
        this.notify(null, 'Trường "Tỉnh" không được để trống!', 'warning')
        return false
      }
      if (!flowRouteProvinceName) {
        this.notify(null, 'Trường "Luồng" không được để trống!', 'warning')
        return false
      }
      return true
    },
    submitForm() {
      if (!this.checkValid()) {
        return
      }
      const {
        ID,
        name,
        provinces,
        flowRouteProvinceName,
        type
      } = this.formSubmit
      const params = {
        ID: ID,
        name: name,
        flowRouteProvinceName: flowRouteProvinceName,
        status: 1,
        type: type,
        provinces: provinces.map(x => this.ListProvince.find(item => item.ID === x))
      }
      this.editFlowRoute(params)
    },
    editFlowRoute(params) {
      const self = this
      axios({
        method: 'PUT',
        url: this.serverIp + 'flow-route-province/' + params.ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Sửa luồng thành công!', 'success')
          self.getListFlowRoute()
          self.dialogEditRoute = false
        })
        .catch(function(err) {
          self.notify(null, `Sửa luồng thất lại, lỗi: ${err}`, 'error')
        })
    },
    handleEdit(item) {
      this.formSubmit.ID = item.ID
      this.formSubmit.name = item.name
      this.formSubmit.provinces = item.provinces.map(x => x.ID)
      this.formSubmit.flowRouteProvinceName = item.flowRouteProvinceName
      this.formSubmit.type = item.type
      this.dialogEditRoute = true
    },
    changePage(page) {
      this.pagination.currentPage = page
      this.getListFlowRoute()
    },
    getListFlowRoute() {
      const self = this
      self.loadingTable = true
      const { types, provinceId, name } = this.formSearch
      const { currentPage, defaultPageSize } = this.pagination
      const params = {
        types: types,
        provinceId: provinceId,
        name: name,
        count: defaultPageSize,
        page: currentPage - 1
      }
      axios({
        method: 'POST',
        url: this.serverIp + 'flow-route-province/query',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.tableData = res.data.Data
          self.pagination.FilteredData = res.data.FilteredData
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    handleDeleteFlowRoute(item) {
      const self = this
      axios({
        method: 'DELETE',
        url: this.serverIp + 'flow-route-province/' + item.ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      })
        .then(function(res) {
          self.notify(null, 'Xóa luồng thành công!', 'success')
          self.getListFlowRoute()
        })
        .catch(function(err) {
          self.notify(null, `Xóa luồng thất lại, lỗi: ${err}`, 'error')
        })
    },
    notify(object, content, type) {
      this.$notification[type]({
        message: object || 'Thông báo',
        description: content || ''
      })
    },
    openAddFlowRoute() {
      this.$router.push({ name: 'AddRoute' })
    },
    confirm(e, actionName = null, data = null) {
      // console.log(e)
      this.$message.success(`Xác nhận thao tác ${actionName ? `: ${actionName}` : ''}`)
      this.handleDeleteFlowRoute(data)
    },
    cancel(e, actionName = null) {
      // console.log(e)
      this.$message.error(`Hủy thao tác ${actionName ? `: ${actionName}` : ''}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>

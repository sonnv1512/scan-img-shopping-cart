<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Báo cáo</span>
      </div>
      <!-- end: header -->
      <div class="filter-contain">
        <div class="filter-item">
          <label for="filter">Từ ngày</label>
          <div class="filter-date-time-picker">
            <el-time-select
              v-model="formSearch.fromTime"
              size="medium"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:00'
              }"
              placeholder="Chọn giờ"
            />
            <el-date-picker
              v-model="formSearch.fromDate"
              type="date"
              size="medium"
              format="dd-MM-yyyy"
              placeholder="Chọn ngày bắt đầu"
              clearable
            />
          </div>
        </div>
        <div class="filter-item">
          <label for="filter">Đến ngày</label>
          <div class="filter-date-time-picker">
            <el-time-select
              v-model="formSearch.toTime"
              size="medium"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:00'
              }"
              placeholder="Chọn giờ"
            />
            <el-date-picker
              v-model="formSearch.toDate"
              type="date"
              size="medium"
              format="dd-MM-yyyy"
              placeholder="Chọn ngày bắt đầu"
              clearable
            />
          </div>
        </div>
        <div class="filter-item">
          <label for="filter">Tỉnh</label>
          <el-select
            v-model="formSearch.managerId"
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
        <a-button
          class="justify-start"
          type="primary"
          :loading="loadingTable"
          @click="getListApprovement"
        >
          Lấy thông tin
        </a-button>
      </div>
      <div class="summary-row">
        <p>Số đơn tiếp nhận:<span class="summary-row-info total">{{ summary.total | number }}</span></p>
        <p>Đã duyệt:<span class="summary-row-info approve">{{ summary.approve | number }}</span></p>
        <p>Từ chối:<span class="summary-row-info deny">{{ summary.deny | number }}</span></p>
        <p>Chờ phê duyệt:<span class="summary-row-info wait">{{ summary.wait | number }}</span></p>
        <p>Quá hạn (24h):<span class="summary-row-info differ">{{ summary.differ | number }}</span></p>
        <p>Thu hồi:<span class="summary-row-info recovery">{{ summary.recovery | number }}</span></p>
      </div>
      <!-- start: table -->
      <a-spin :spinning="loadingTable" @sort-change="changeSort">
        <el-table :data="tableData" :row-class-name="$func.tableRowClassName">
          <el-table-column type="index" width="50">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="Tỉnh">
            <template slot-scope="scope">
              {{ scope.row.ProvinceName }}
            </template>
          </el-table-column>
          <el-table-column label="Đã duyệt" width="150" sortable :sort-method="sortTotalApprovedData">
            <template slot-scope="scope">
              {{ scope.row.TotalApprovedData | number }}
            </template>
          </el-table-column>
          <el-table-column label="Từ chối" width="150" sortable :sort-method="sortTotalUnapprovedData">
            <template slot-scope="scope">
              {{ scope.row.TotalUnapprovedData | number }}
            </template>
          </el-table-column>
          <el-table-column label="Chờ phê duyệt" width="150" sortable :sort-method="sortTotalNewData">
            <template slot-scope="scope">
              {{ scope.row.TotalNewData | number }}
            </template>
          </el-table-column>
          <el-table-column label="Quá hạn (24h)" width="150" sortable :sort-method="sortTotalDifferData">
            <template slot-scope="scope">
              {{ scope.row.TotalDifferData | number }}
            </template>
          </el-table-column>
          <el-table-column label="Thu hồi" width="150" sortable :sort-method="sortTotalRecoveredData">
            <template slot-scope="scope">
              {{ scope.row.TotalRecoveredData | number }}
            </template>
          </el-table-column>
        </el-table>
      </a-spin>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import Province from '@/class/Province'
import UserLevel from '@/class/UserLevel'
import moment from 'moment'
export default {
  data() {
    return {
      formSearch: {
        fromTime: '00:00',
        fromDate: new Date(),
        toTime: '23:99',
        toDate: new Date(),
        managerId: []
      },
      summary: {
        total: 0,
        deny: 0,
        wait: 0,
        approve: 0,
        differ: 0,
        recovery: 0
      },
      options: [],
      tableData: [],
      loadingSubmit: false,
      disableSelect: false,
      loadingTable: false,
      UserLevel: UserLevel,
      ListProvince: Province,
      ListStatus: this.$func.renderFlowRouteProvince_status(),
      ListType: this.$func.FlowRouteProvince_type()
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
    this.getListApprovement()
  },
  methods: {
    changeSort(column, prop, order) {
      console.log({ column, prop, order })
    },
    sortTotalApprovedData(a, b) {
      return a.TotalApprovedData - b.TotalApprovedData
    },
    sortTotalUnapprovedData(a, b) {
      return a.TotalUnapprovedData - b.TotalUnapprovedData
    },
    sortTotalNewData(a, b) {
      return a.TotalNewData - b.TotalNewData
    },
    sortTotalDifferData(a, b) {
      return a.TotalDifferData - b.TotalDifferData
    },
    sortTotalRecoveredData(a, b) {
      return a.TotalRecoveredData - b.TotalRecoveredData
    },
    formatDateTime(dateStr, timeStr) {
      return moment(`${dateStr}T${timeStr}:00Z`).toISOString()
      // return moment(`${dateStr} ${timeStr}:00`).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      // return moment(str).toISOString()
    },
    getListApprovement() {
      const self = this
      const { fromTime, fromDate, toTime, toDate, managerId } = this.formSearch

      const params = {
        // toDate: toDate ? new Date(toDate.setHours(23, 59, 59, 999) + 25200000).toISOString() : null,
        fromDate: fromDate && fromTime ? this.formatDateTime(this.$func.customDate(fromDate, '#YYYY#-#MM#-#DD#'), fromTime) : null,
        toDate: toDate && toTime ? this.formatDateTime(this.$func.customDate(toDate, '#YYYY#-#MM#-#DD#'), toTime) : null,
        managerId: managerId
      }
      self.loadingTable = true
      axios({
        method: 'POST',
        url: this.serverIp + 'vehicle-flow/report',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.tableData = res.data
          self.summaryReport(res.data)
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    summaryReport(data) {
      const TotalApprovedData = data.map(x => x.TotalApprovedData)
      const TotalNewData = data.map(x => x.TotalNewData)
      const TotalUnapprovedData = data.map(x => x.TotalUnapprovedData)
      const TotalDifferData = data.map(x => x.TotalDifferData)
      const TotalRecoveredData = data.map(x => x.TotalRecoveredData)
      this.summary.approve = this.$func.sumValueArr(TotalApprovedData)
      this.summary.wait = this.$func.sumValueArr(TotalNewData)
      this.summary.deny = this.$func.sumValueArr(TotalUnapprovedData)
      this.summary.differ = this.$func.sumValueArr(TotalDifferData)
      this.summary.recovery = this.$func.sumValueArr(TotalRecoveredData)
      this.summary.total = this.summary.approve + this.summary.wait + this.summary.deny
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
.summary-row {
  display: flex;
  margin: 20px 0px;
  font-size: 18px;
  display: flex;
  grid-gap: 30px;
  font-weight: 500;
  .summary-row-info {
    margin-left: 3px;
  }
  // .total {
  // }
  .approve {
    color: #49D193;
  }
  .deny {
    color: #FF4868;
  }
  .wait {
    color: #F39B13;
  }
  .differ {
    color: grey;
  }
  .recovery {
    color: rgb(14, 68, 119);
  }
}
</style>

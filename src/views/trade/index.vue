<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Danh sách đăng ký</span>
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
          <label for="filter">Trạng thái</label>
          <el-select
            v-model="formSearch.paymentStatus"
            size="medium"
            placeholder="Chọn tất cả"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in ListStatus"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label for="filter">Gói</label>
          <el-select
            v-model="formSearch.insurancePackageIds"
            size="medium"
            placeholder="Chọn tất cả"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in ListInsurancePackage"
              :key="item.ID"
              :label="`${item.name} (ID = ${item.ID})`"
              :value="item.ID"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label for="filter">SĐT Khách hàng</label>
          <el-input
              v-model="formSearch.buyerPhone"
              size="medium"
              placeholder="Nhập sđt"
              clearable
              type="number"
            />
        </div>
        <div class="filter-item">
          <label for="filter">Mã giao dịch</label>
          <el-input
              v-model="formSearch.ID"
              size="medium"
              placeholder="Nhập mã giao dịch"
              clearable
              type="number"
            />
        </div>
        
        <!-- <div class="filter-item">
          <label for="filter">Người duyệt</label>
          <el-select
            v-model="formSearch.userId"
            size="medium"
            placeholder="Chọn tất cả"
            filterable
            clearable
          >
            <el-option
              v-for="item in ListUser"
              :key="item.ID"
              :label="item.userName"
              :value="item.ID"
            />
          </el-select>
        </div> -->
        <!-- <a-button class="justify-start" type="primary" @click="changePage(1)"> -->
        <a-button class="justify-start" type="primary" @click="getListTrade()">
          Lấy thông tin
        </a-button>
      </div>
      <!-- start: table -->
      <a-spin :spinning="loadingTable">
        <el-table
          :data="tableData"
          :row-class-name="$func.tableRowClassName"
        >
          <el-table-column type="index" width="50">
            <!-- <template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.defaultPageSize + (scope.$index + 1) }}</template> -->
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="Mã giao dịch">
            <template slot-scope="scope">{{ scope.row.ID ? scope.row.ID : '' }}</template>
          </el-table-column>
          <el-table-column label="Tên người đăng ký">
            <template slot-scope="scope">{{ scope.row.buyer ? scope.row.buyer.name : '' }}</template>
          </el-table-column>
          <el-table-column label="Điện thoại" width="120">
            <template slot-scope="scope">{{ scope.row.buyer ? scope.row.buyer.phone : '' }}</template>
          </el-table-column>
          <el-table-column label="Email" width="150">
            <template slot-scope="scope">{{ scope.row.buyer ? scope.row.buyer.email : '' }}</template>
          </el-table-column>
          <el-table-column label="Số CMND" width="120">
            <template slot-scope="scope">{{ scope.row.buyer ? scope.row.buyer.identity : '' }}</template>
          </el-table-column>
          <el-table-column label="Gói bảo hiểm">
            <template slot-scope="scope">{{ scope.row.insurancePackage ? scope.row.insurancePackage.name : '' }}</template>
          </el-table-column>
          <el-table-column label="Thời gian (tháng)" width="120">
            <template slot-scope="scope">{{ scope.row.insurancePackage ? scope.row.insurancePackage.duration : '' }}</template>
          </el-table-column>
          <!-- <el-table-column label="Phương thức thanh toán" width="80">
            <template slot-scope="scope">{{ scope.row.buyer.name }}</template>
          </el-table-column> -->
          <el-table-column label="Trạng thái" width="120">
            <template slot-scope="scope">{{ scope.row.paymentStatus | paymentStatus }}</template>
          </el-table-column>

          <el-table-column label="" width="120">
            <template slot-scope="scope">
              <a-button
                shape="circle"
                icon="edit"
                type="warning"
                @click="openEdit(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </a-spin>

      <!-- <div class="pagination-table">
        <a-pagination
          v-model="pagination.currentPage"
          class="pagination-table"
          :total="pagination.FilteredData"
          show-less-items
          :default-page-size="pagination.defaultPageSize"
          @change="changePage"
        />
      </div> -->
    </el-card>
    <el-dialog
      title="Thông tin đăng ký"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="right-side">
        <div
          v-if="editItem"
          class="info-container"
        >
          <div class="form-1col">
            <div class="form-item">
              <label>Trạng thái thanh toán</label>
              <el-select
                v-model="editItem.paymentStatus"
                size="medium"
                placeholder="Chọn trạng thái"
                filterable
                clearable
                :loading="loadingGetPackage"
              >
                <el-option
                  v-for="item in ListStatus"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </div>
            <div class="form-item">
              <label>Gói</label>
              <el-select
                v-model="editItem.insurancePackageId"
                size="medium"
                placeholder="Chọn trạng thái"
                filterable
                clearable
                :loading="loadingGetPackage"
              >
                <el-option
                  v-for="item in ListInsurancePackage"
                  :key="item.ID"
                  :label="`${item.name} (ID = ${item.ID})`"
                  :value="item.ID"
                />
              </el-select>
            </div>
            <div class="form-item">
              <label>Ghi chú</label>
              <el-input
                v-model="editItem.description"
                size="medium"
                placeholder="Nhập nội dung"
                clearable
              />
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <a-button
          type="primary"
          :loading="loadingSubmit"
          @click="updateForm()"
        >Cập nhật</a-button>
        <a-button @click="dialogVisible = false">Đóng</a-button>
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
  name: 'History',
  data() {
    return {
      formSearch: {
        buyerPhone: null,
        paymentStatus: [],
        ID: null,
        fromTime: '00:00',
        fromDate: new Date(),
        toTime: '23:59',
        toDate: new Date(),
        insurancePackageIds: [],
      },
      pagination: {
        currentPage: 1,
        defaultPageSize: 50,
        FilteredData: 100
      },
      ListInsurancePackage: [],
      tableData: [],
      loadingSubmit: false,
      loadingTable: false,
      loadingGetPackage: false,
      ListUser: [],
      ListProvince: Province,
      dialogVisible: false,
      ListStatus: this.$func.renderFlowRouteProvince_status(),
      editItem: this.renderEditItem(),
      UserLevel: UserLevel,
      radio: 1,
      // add flow
      formAddFlow: {
        // type: null,
        province: null,
        text: null
      },
      dialogAddFlow: false,
      ListType: this.$func.FlowRouteProvince_type(),
      listFlow: {
        allFlow: [],
        filterFlow: [],
        selected: []
      },
      refuseReason: []
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
  watch: {
    editItem(newVal, old) {
      this.refuseReason = []
      // if (!newVal.phoneNumber) {
      //   this.refuseReason.push('Thiếu số điện thoại liên hệ')
      // }
    }
  },
  mounted() {
    this.getListTrade()
    this.getListInsurance()
  },
  methods: {
    openEdit(item) {
      this.editItem = {
        CreatedAt: item.CreatedAt,
        DeletedAt: item.DeletedAt,
        ID: item.ID,
        UpdatedAt: item.UpdatedAt,
        activeDate: item.activeDate,
        buyer: item.buyer,
        buyerId: item.buyerId,
        creator: item.creator,
        creatorId: item.creatorId,
        driverUserId: item.driverUserId,
        description: item.description,
        insurancePackage: item.insurancePackage,
        insurancePackageId: item.insurancePackageId,
        insureder: item.insureder,
        paymentStatus: item.paymentStatus,
        uniqueId: item.uniqueId,
        updatedBy: item.updatedBy,
        updatedById: item.updatedById
      }
      this.handleOpen()
    },
    updateForm() {
      const self = this
      if(!confirm('Xác nhận thay đổi thông tin')) {
        return
      }
      const { ID, paymentStatus, description, insurancePackageId } = this.editItem
      const params = {
        // fromDate: new Date(fromDate).toISOString(),
        // toDate: new Date(toDate).toISOString(),
        paymentStatus: paymentStatus,
        description: description,
        insurancePackageId: insurancePackageId
      }
      axios({
        method: 'POST',
        url: this.serverIp + 'insurance/crm-update/' + ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Cập nhật thành công!', 'success')
          self.getListTrade()
          self.handleClose()
        })
        .catch(function(err) {
          self.notify(null, `Cập nhật thất lại, lỗi: ${err}`, 'error')
        })
    },
    changePage(page) {
      this.pagination.currentPage = page
      this.getListTrade()
    },
    notify(object, content, type) {
      this.$notification[type]({
        message: object || 'Thông báo',
        description: content || ''
      })
    },
    cusDate(input, format = '#hhhh#h:#mm# #DD#/#MM#/#YYYY#') {
      const abc = Date.parse(input)
      return this.$func.customDate(abc, format)
    },
    handleOpen() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    renderEditItem() {
      const obj = {
        CreatedAt: null,
        DeletedAt: null,
        ID: null,
        UpdatedAt: null,
        activeDate: null,
        buyer: null,
        buyerId: null,
        creator: null,
        creatorId: null,
        driverUserId: null,
        description: null,
        insurancePackage: null,
        insurancePackageId: null,
        insureder: null,
        paymentStatus: null,
        uniqueId: null,
        updatedBy: null,
        updatedById: null,
      }
      return obj
    },
    getListTrade() {
      const self = this
      self.loadingTable = true
      const { fromTime, fromDate, toTime, toDate, paymentStatus, insurancePackageIds, buyerPhone, ID } = this.formSearch
      const params = {
        fromDate: fromDate && fromTime ? this.$func.formatDateTime(this.$func.customDate(fromDate, '#YYYY#-#MM#-#DD#'), fromTime) : null,
        toDate: toDate && toTime ? this.$func.formatDateTime(this.$func.customDate(toDate, '#YYYY#-#MM#-#DD#'), toTime) : null,
        driverUserIds: [],
        insurancePackageIds: insurancePackageIds,
        paymentStatus: paymentStatus,
        buyerPhone: buyerPhone,
        insuranceIds: ID ? [parseInt(ID)] : null
      }
      axios({
        method: 'POST',
        url: this.serverIp + 'insurance/get-list',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          console.log(res)
          const response = res.data
          // self.tableData = response.sort(
          //   (a, b) => Date.parse(b.CreatedAt) - Date.parse(a.CreatedAt)
          // )
          self.tableData = response
          self.pagination.FilteredData = res.data.length
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    getListInsurance() {
      const self = this
      self.loadingGetPackage = true
      axios({
        method: 'Get',
        url: this.serverIp + 'component/insurance-package',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      })
        .then(function(res) {
          console.log(res)
          const response = res.data
          // self.tableData = response.sort(
          //   (a, b) => Date.parse(b.CreatedAt) - Date.parse(a.CreatedAt)
          // )
          self.ListInsurancePackage = response
          self.loadingGetPackage = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingGetPackage = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.right-side {
  flex-basis: 0;
  flex-grow: 6;
  padding-left: 30px;

  .info-container {
    display: grid;
    grid-gap: 1rem;
    .info-label {
      background: #084388;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #fff;
      padding: 8px 18px;
      text-transform: uppercase;
    }
    .info-vehicle {
      display: grid;
      grid-gap: 10px;
      &-container {
        padding: 0 20px;
        display: grid;
        grid-gap: 10px;
        .vehicle-item {
          display: grid;
          grid-template-columns: 20% 60%;
          text-transform: uppercase;
          align-items: baseline;
          .info-title {
            color: #9399a9;
            font-size: 12px;
            font-weight: 500;
          }
          .info-content {
            color: #383f47;
            font-size: 16px;
            font-weight: 500;
            word-break: break-word;
          }
        }
      }
    }
    .info-route {
      display: grid;
      grid-gap: 10px;
      &-container {
        padding: 0 20px;
        display: grid;
        grid-gap: 10px;
        .route-info {
          color: #383f47;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          word-break: break-word;
          .remove-route {
            cursor: pointer;
            margin-left: 3px;
            color: red;
            font-weight: bolder;
          }
        }
        .special {
          color: #13c2c2;
          background: #e6fffb;
          border-color: #87e8de;
          padding: 0 7px;
        }
      }
      .place-info {
        padding: 0 20px;
        display: grid;
        grid-template-columns: 20% 60%;
        text-transform: uppercase;
        align-items: baseline;
        .info-title {
          color: #9399a9;
          font-size: 12px;
          font-weight: 500;
          margin: 0;
        }
        .info-content {
          color: #383f47;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    .info-driver {
      display: grid;
      grid-gap: 10px;
      .info-driver-section {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-gap: 10px;
        .info-driver-container {
          padding: 3px;
          display: grid;
          padding: 3px;
          border: 4px solid #ecedf1;
          border-radius: 8px;
          .driver-item {
            display: grid;
            grid-template-columns: 100px 1fr;
            text-transform: uppercase;
            align-items: baseline;
            .info-title {
              color: #9399a9;
              font-size: 12px;
              font-weight: 500;
              margin: 0;
            }
            .info-content {
              color: #383f47;
              font-size: 16px;
              font-weight: 500;
            }
            .info-image-container {
              display: flex;
              grid-gap: 10px;
              .form-image {
                cursor: pointer;
                width: 30px;
                height: 30px;
              }
            }
          }
        }
      }
    }
    .info-form {
      display: grid;
      grid-gap: 10px;
      &-container {
        padding: 0 20px;
        display: flex;
        grid-gap: 10px;
        .form-image {
          cursor: pointer;
          width: 100px;
          height: 100px;
        }
      }
    }
    .warranty {
      color: red;
      padding-bottom: 1rem;
      border-bottom: 1px solid #ecedf1;
    }
    .approve-section {
      display: grid;
      grid-gap: 10px;
      .expried {
        font-weight: 500;
        font-size: 12px;
        line-height: 22px;
        color: #9399a9;
        text-transform: uppercase;
      }
      .expried-date {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        .from-date {
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          color: #383f47;
          margin-right: 5px;
        }
        .to-date {
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          color: #383f47;
          margin-left: 5px;
          margin-right: 5px;
        }
      }
      .action {
        display: grid;
        grid-gap: 10px;
        .approve {
          color: #49d193;
        }
        .reject {
          color: #ff4868;
        }
      }
      .refuseReason {
        .caution {
          color: red;
          margin-bottom: 3px;
        }
      }
    }
  }
}
.status-section {
  display: grid;
}
.good-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}
.dialog-contain {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  .left-side {
    width: 50%;
    padding-right: 30px;
  }
  .right-side {
    width: 50%;
    padding-left: 30px;
  }
}
.route-info {
  &-container {
    padding: 0 20px;
    display: grid;
    grid-gap: 10px;
    .route-info {
      color: #383f47;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      word-break: break-word;
      .remove-route {
        cursor: pointer;
        margin-left: 3px;
        color: red;
        font-weight: bolder;
      }
    }
    .special {
      color: #13c2c2;
      background: #e6fffb;
      border-color: #87e8de;
      padding: 0 7px;
    }
  }
}
.expried-date {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .from-date {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #383f47;
    margin-right: 5px;
    width: 70px;
  }
  .to-date {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #383f47;
    margin-left: 5px;
    margin-right: 5px;
    width: 70px;
  }
}
.add-flow-dialog {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  .add-flow-table {
    overflow: hidden;
    overflow-y: scroll;
    max-height: calc(100vh - 400px);
  }
}
</style>

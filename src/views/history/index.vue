<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Danh sách yêu cầu</span>
      </div>
      <!-- end: header -->
      <div class="filter-contain">
        <div class="filter-item">
          <label for="filter">Trạng thái</label>
          <el-select
            v-model="formSearch.status"
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
          <label for="filter">Số đăng ký</label>
          <el-input v-model="formSearch.numberPlate" placeholder="Nhập số đăng ký" />
        </div>
        <div class="filter-item">
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
        </div>
        <a-button class="justify-start" type="primary" @click="changePage(1)">
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
            <template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.defaultPageSize + (scope.$index + 1) }}</template>
          </el-table-column>
          <el-table-column label="Mã" width="80">
            <template slot-scope="scope">{{ scope.row.ID }}</template>
          </el-table-column>
          <el-table-column label="Số đăng ký">
            <template slot-scope="scope">{{ scope.row.numberPlate }}</template>
          </el-table-column>
          <el-table-column label="Chủ phương tiện">
            <template slot-scope="scope">{{ scope.row.vehicleOwner }}</template>
          </el-table-column>
          <el-table-column label="Loại phương tiện">
            <template slot-scope="scope">{{ scope.row.vehicleType }}</template>
          </el-table-column>
          <!-- <el-table-column label="Nhãn hiệu phương tiện" width="150">
          <template slot-scope="scope">{{ scope.row.vehicleBrand }}</template>
        </el-table-column> -->
          <el-table-column label="Trọng tải toàn phần" width="120">
            <template slot-scope="scope">{{ scope.row.goodsVolume }}</template>
          </el-table-column>
          <el-table-column label="Hàng hóa" width="150">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.goodsType === 1 ? 'success' : 'info'"
                style="height:100%"
                class="justify-start"
              >
                {{
                  scope.row.goodsType === 1
                    ? 'Hàng mau hỏng'
                    : 'Hàng hóa thường'
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Hạn đăng kiểm">
            <template slot-scope="scope">{{
              scope.row.regDeadline | customDate('#DD#/#MM#/#YYYY#')
            }}</template>
          </el-table-column>
          <el-table-column label="Trạng thái/Người thực hiện">
            <template slot-scope="scope">
              <div class="status-section">
                <span>{{ scope.row.status | approvementStatus }}</span>
                <template v-if="scope.row.status == 1">
                  <span>
                    {{ scope.row.status == 1 && scope.row.approver ? scope.row.approver.userName : 'Không xác định' }}
                  </span>
                  <span>
                    {{ scope.row.approveAt | customDateFromDate('#hhhh#h:#mm# #DD#/#MM#/#YYYY#') }}
                  </span>
                </template>
                <template v-if="[2, 3].includes(scope.row.status)">
                  <span>
                    {{ scope.row.status != 1 && scope.row.unapprover ? scope.row.unapprover.userName : 'Không xác định' }}
                  </span>
                  <span>
                    {{ scope.row.unapproveAt | customDateFromDate('#hhhh#h:#mm# #DD#/#MM#/#YYYY#') }}
                  </span>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="" width="120">
            <template slot-scope="scope">
              <a-button
                shape="circle"
                icon="edit"
                type="warning"
                @click="openApprovement(scope.row)"
              />
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
      title="Thông tin yêu cầu"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <div class="right-side">
        <div
          v-if="editItem"
          class="info-container"
        >
          <div class="info-vehicle">
            <label
              class="info-label justify-start"
            >Thông tin phương tiện</label>
            <div class="info-vehicle-container">
              <div class="vehicle-item">
                <label class="info-title" for="">Ngày đăng ký</label>
                <span class="info-content">{{ editItem.regDate }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">CHỦ PHƯƠNG TIỆN</label>
                <span class="info-content">{{
                  editItem.vehicleOwner
                }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">ĐIỆN THOẠI LIÊN HỆ</label>
                <span class="info-content">{{ editItem.phoneNumber }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">SỐ ĐĂNG KÝ</label>
                <span class="info-content">{{ editItem.numberPlate }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">LOẠI PHƯƠNG TIỆN</label>
                <span class="info-content">{{ editItem.vehicleType }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">Nhãn hiệu</label>
                <span class="info-content">{{ editItem.vehicleBrand }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">Trọng tải toàn phần</label>
                <span class="info-content">{{ editItem.goodsVolume }}</span>
              </div>
              <div class="vehicle-item">
                <label
                  class="info-title"
                  for=""
                >CMT/CCCD (cá nhân)/<br>
                  MS DKKD (doanh nghiệp)</label>
                <span class="info-content">{{
                  editItem.identifiedCode
                }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">HẠN ĐĂNG KIỂM</label>
                <span class="info-content">{{ editItem.regDeadline }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">ĐƠN VỊ PHÊ DUYỆT</label>
                <span class="info-content">{{ editItem.managerId | managerById }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">AIS GSHT</label>
                <span class="info-content">{{
                  editItem.cameraJourney == 1 ? 'Có' : 'Không có'
                }}</span>
              </div>
              <div class="vehicle-item">
                <label class="info-title" for="">Hàng hóa</label>
                <div style="display:grid">
                  <span
                    v-for="(item, index) of editItem.goodsKinds"
                    :key="index + 'goodKind'"
                    class="info-content"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="info-route">
            <label
              class="info-label justify-start"
            >Thông tin lộ trình</label>
            <div class="place-info">
              <label class="info-title" for="">Cảng/Bến xuất phát</label>
              <span class="info-content">{{ editItem.fromPlace }}</span>
            </div>
            <div class="place-info">
              <label class="info-title" for="">Cảng/Bến đích</label>
              <span class="info-content">{{ editItem.toPlace }}</span>
            </div>
            <el-button
              type="text"
              class="justify-start"
              @click="dialogAddFlow = true"
            >Thêm lộ trình</el-button>
            <div class="info-route-container">
              <span
                v-for="(flow, indexFlow) of editItem.flowRouteProvinces"
                :key="flow.ID"
                :class="flow.type == 1 ? 'special' : ''"
                class="route-info"
              >
                {{ flow.flowRouteProvinceName }}
                <i class="el-icon-close remove-route" @click="handleRemoveFlow(indexFlow)" />
              </span>
            </div>
          </div>
          <div class="info-driver">
            <label
              class="info-label justify-start"
            >Thông tin thuyền viên</label>
            <p class="covid-test">Giấy xét nghiệm covid 19(âm tính) còn hiệu lực tại thời điểm đăng ký được coi là hợp lệ</p>
            <div class="info-driver-section">
              <div v-for="(driver, index) of editItem.drivers" :key="index+'itemDrivers'" class="info-driver-container">
                <div class="driver-item">
                  <p class="info-title">Thuyền viên ({{ index + 1 }})</p>
                  <span class="info-content">{{ driver.name || '' }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Số điện thoại</p>
                  <span class="info-content">{{ driver.phoneNumber || '' }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Ngày sinh</p>
                  <span class="info-content">{{ driver.birthDay | customDateFromDate('#DD#/#MM#/#YYYY#') }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Số giấy CNKNCM / CCCM</p>
                  <span class="info-content">{{ driver.driverLicense || '' }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Chức danh</p>
                  <span class="info-content">{{ driver.jobTitle | jobTitle }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Ngày làm XN</p>
                  <span class="info-content">{{ driver.covidTestBeginDate | customDateFromDate('#DD#/#MM#/#YYYY#') }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Ngày hết hạn XN</p>
                  <span class="info-content">{{ driver.covidTestExpiredDate | customDateFromDate('#DD#/#MM#/#YYYY#') }}</span>
                </div>
                <div class="driver-item">
                  <p class="info-title">Ảnh chụp XN</p>
                  <div class="info-image-container">
                    <el-image
                      v-for="(image, indexDriverImages) of driver.driverImages"
                      :key="indexDriverImages+'driverImages'"
                      class="form-image"
                      :src="image"
                      fit="['fill', 'contain', 'cover', 'none', 'scale-down']"
                      :preview-src-list="driver.driverImages"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-form">
            <label
              class="info-label justify-start"
            >Đơn đăng ký cấp luồng xanh</label>
            <div class="info-form-container">
              <el-image
                v-for="(image, index) of editItem.images"
                :key="index"
                class="form-image"
                :src="image"
                :preview-src-list="editItem.images"
                fit="['fill', 'contain', 'cover', 'none', 'scale-down']"
              />
            </div>
          </div>
          <!-- <i
            class="warranty"
          >Tôi xin cam kết tuân thủ các nội dung về phòng, chống dịch bệnh
            Covid - 19 theo quy định của bộ y tế, các cơ quan khác có liên
            quan; cam đoan nội dung kê khai nêu trên là đúng sự thật và hoàn
            toàn chịu trách nhiệm trước pháp luật.</i> -->
          <div class="approve-section">
            <label
              class="expried"
              for="expried"
            >THỜI HẠN CÓ GIÁ TRỊ CỦA THẺ</label>
            <div class="expried-date">
              <label class="from-date" for="">Từ</label>
              <el-date-picker
                v-model="editItem.fromDate"
                type="date"
                placeholder="Pick a day"
              />
              <label class="to-date" for="">Đến</label>
              <el-date-picker
                v-model="editItem.toDate"
                type="date"
                placeholder="Pick a day"
              />
            </div>
            <el-input
              v-model="editItem.reason"
              type="textarea"
              :rows="1"
              size="medium"
              placeholder="Điền lý do từ chối"
            />
            <div class="refuseReason">
              <p v-for="reason of refuseReason" :key="reason" class="caution">
                *{{ reason }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <a-button
          type="primary"
          :loading="loadingSubmit"
          @click="submitForm(1)"
        >Chấp thuận</a-button>
        <a-button type="danger" @click="submitForm(2)">Từ chối</a-button>
        <a-button type="warning" @click="submitForm(3)">Thu hồi</a-button>
        <a-button type="dashed" @click="updateForm()">Cập nhật</a-button>
        <a-button @click="dialogVisible = false">Đóng</a-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Thêm lộ trình"
      :visible.sync="dialogAddFlow"
      width="70%"
    >
      <div class="add-flow-dialog">
        <div class="filter-contain">
          <!-- <div class="filter-item">
            <label class="label-name" for="name">Loại luồng</label>
            <el-select
              v-model="formAddFlow.type"
              size="medium"
              placeholder="Chọn tất cả"
              @change="handleSelectFlow"
            >
              <el-option
                v-for="item in ListType"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </div> -->
          <div class="filter-item">
            <label class="label-name" for="name">Tìm kiếm theo tên/luồng (không dấu)</label>
            <el-input
              v-model="formAddFlow.text"
              size="medium"
              placeholder="Nhập tên/luồng"
              suffix-icon="el-icon-search"
              @change="handleSelectFlow"
              clearable
            />
          </div>
          <div class="filter-item">
            <label class="label-name" for="name">Tỉnh</label>
            <el-select
              v-model="formAddFlow.province"
              size="medium"
              placeholder="Chọn tỉnh"
              clearable
              filterable
              :disabled="formAddFlow.type === 1"
              @change="handleSelectFlow"
            >
              <el-option
                v-for="item in ListProvince"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              />
            </el-select>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="listFlow.filterFlow"
          class="add-flow-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="Tỉnh" width="150">
            <template slot-scope="scope">{{ scope.row.provinces.map(x => x.name).join(', ') }}</template>
          </el-table-column>
          <el-table-column
            property="name"
            label="Tên luồng"
            width="120"
          />
          <el-table-column
            property="flowRouteProvinceName"
            label="Luồng"
          />
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
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <a-button
          class="justify-end"
          type="primary"
          @click="addFlowToItem"
        >Thêm {{ `(${listFlow.selected.length})` }}</a-button>
        <a-button
          class="justify-end"
          @click="dialogAddFlow = false"
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
  name: 'History',
  data() {
    return {
      formSearch: {
        numberPlate: null,
        managerId: [],
        status: [],
        userId: null
      },
      pagination: {
        currentPage: 1,
        defaultPageSize: 50,
        FilteredData: 100
      },
      tableData: [],
      loadingSubmit: false,
      loadingTable: false,
      loadingGetUser: false,
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
      if (!newVal.phoneNumber) {
        this.refuseReason.push('Thiếu số điện thoại liên hệ')
      }
      if (!newVal.identifiedCode) {
        this.refuseReason.push('Thiếu CMT/CCCD hoặc MS DKKD')
      }
      if (newVal.goodsKinds.length === 0) {
        this.refuseReason.push('Thiếu thông tin hàng hóa')
      }
      if (!newVal.fromPlace) {
        this.refuseReason.push('Thiếu địa chỉ xuất phát')
      }
      if (!newVal.toPlace) {
        this.refuseReason.push('Thiếu địa chỉ kết thúc')
      }
      if (newVal.drivers.length === 0) {
        this.refuseReason.push('Thiếu thông tin tài xế')
      }
      if (newVal.drivers.some(driver => !driver.name)) {
        this.refuseReason.push('Thiếu tên tài xế')
      }
      if (newVal.drivers.some(driver => !driver.phoneNumber)) {
        this.refuseReason.push('Thiếu số điện thoại tài xế')
      }
      if (newVal.images.length === 0) {
        this.refuseReason.push('Thiếu đơn đăng ký cấp luồng xanh')
      }
    }
  },
  mounted() {
    this.formSearch.managerId =
      this.currentUserLevel === UserLevel.staff || this.currentUserLevel === UserLevel.employee
        ? [this.currentUserDepartment]
        : []
    this.getListApprovement()
    this.getListFlowRouteAll()
    this.getListUser()
  },
  methods: {
    addFlowToItem() {
      this.editItem.flowRouteProvinces = this.editItem.flowRouteProvinces.concat(this.listFlow.selected)
      this.dialogAddFlow = false
      this.listFlow.selected = []
    },
    handleSelectFlow() {
      let filterList = this.listFlow.allFlow
      const { province, text } = this.formAddFlow
      if (text) {
        const textSearch = this.$func.removeVietnameseTones(text)
        filterList = filterList.filter(x =>
          this.$func.removeVietnameseTones(x.name).search(textSearch) !== -1 ||
          this.$func.removeVietnameseTones(x.flowRouteProvinceName).search(textSearch) !== -1
        )
      }
      if (province) {
        filterList = filterList.filter(x => x.provinces.map(x => x.ID).includes(province))
      }
      // if (!province) {
      //   this.listFlow.filterFlow = []
      //   return
      // }
      // filterList = filterList.filter(x => x.provinces.map(x => x.ID).includes(province))
      // if (text) {
      //   const textSearch = this.$func.removeVietnameseTones(text)
      //   filterList = filterList.filter(x =>
      //     this.$func.removeVietnameseTones(x.name).search(textSearch) !== -1 ||
      //     this.$func.removeVietnameseTones(x.flowRouteProvinceName).search(textSearch) !== -1
      //   )
      // }
      this.listFlow.filterFlow = filterList
    },
    handleSelectionChange(val) {
      this.listFlow.selected = val
    },
    getListFlowRouteAll() {
      const self = this
      axios({
        method: 'GET',
        url: this.serverIp + 'flow-route-province/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(function(res) {
          self.listFlow.allFlow = res.data.Data
          self.listFlow.filterFlow = res.data.Data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleRemoveFlow(index) {
      this.editItem.flowRouteProvinces.splice(index, 1)
    },
    openApprovement(item) {
      this.editItem = {
        CreatedAt: item.CreatedAt ? this.cusDate(item.CreatedAt) : '',
        DeletedAt: item.DeletedAt ? this.cusDate(item.DeletedAt) : '',
        ID: item.ID,
        UpdatedAt: item.UpdatedAt ? this.cusDate(item.UpdatedAt) : '',
        approveAt: item.approveAt ? this.cusDate(item.approveAt) : '',
        approveId: item.approveId,
        businessId: item.businessId,
        description: item.description,
        flowRouteProvinces: item.flowRouteProvinces,
        fromDate: item.fromDate,
        fromPlace: item.fromPlace,
        goodsType: item.goodsType,
        goodsKinds: item.goodsKinds,
        goodsVolume: item.goodsVolume,
        managerId: item.managerId,
        numberPlate: item.numberPlate,
        phoneNumber: item.phoneNumber,
        reason: item.reason,
        regDate: item.regDate ? this.cusDate(item.regDate) : '',
        regDeadline: item.regDeadline ? this.cusDate(item.regDeadline, '#DD#/#MM#/#YYYY#') : '',
        identifiedCode: item.identifiedCode,
        status: item.status,
        toDate: item.toDate,
        toPlace: item.toPlace,
        unapproveAt: item.unapproveAt ? this.cusDate(item.unapproveAt) : '',
        unapproveId: item.unapproveId,
        vehicleBrand: item.vehicleBrand,
        vehicleOwner: item.vehicleOwner,
        vehicleType: item.vehicleType,
        businessBadges: item.businessBadges,
        cameraJourney: item.cameraJourney,
        images: item.images,
        drivers: item.drivers ? item.drivers : []
      }
      this.handleOpen()
    },
    updateForm() {
      const self = this
      const { reason, ID, fromDate, toDate, flowRouteProvinces, managerId } = this.editItem
      if (fromDate > toDate) {
        this.notify(null, '"Thời hạn có giá trị thẻ" ngày "bắt đầu" không được lớn hơn ngày "kết thúc"', 'warning')
        return
      }
      if (!flowRouteProvinces) {
        this.notify(null, '"Lộ trình" cho xe còn thiếu', 'warning')
        return
      }
      const params = {
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        flowRouteProvinces: flowRouteProvinces,
        reason: reason,
        managerId: managerId
      }
      axios({
        method: 'PUT',
        url: this.serverIp + 'vehicle-flow/' + ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Cập nhật thành công!', 'success')
          self.getListApprovement()
          self.handleClose()
        })
        .catch(function(err) {
          self.notify(null, `Cập nhật thất lại, lỗi: ${err}`, 'error')
        })
    },
    submitForm(status) {
      const self = this
      const { reason, ID, fromDate, toDate, flowRouteProvinces } = this.editItem
      if (status === 2 && !reason) {
        this.notify(null, 'Vui lòng nhập lý do từ chối', 'warning')
        return
      }
      if (status === 3 && !reason) {
        this.notify(null, 'Vui lòng nhập lý do thu hồi', 'warning')
        return
      }
      if (fromDate > toDate) {
        this.notify(null, '"Thời hạn có giá trị thẻ" ngày "bắt đầu" không được lớn hơn ngày "kết thúc"', 'warning')
        return
      }
      if (!flowRouteProvinces) {
        this.notify(null, '"Lộ trình" cho xe còn thiếu', 'warning')
        return
      }
      const params = {
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        flowRouteProvinces: flowRouteProvinces,
        reason: reason,
        status: status
      }
      if (status === 1) { // chap thuan
        params.approveId = this.userInfo.user_system.ID
        params.approveAt = new Date().toISOString()
      }
      if (status != 1) { // tu choi
        params.unapproveId = this.userInfo.user_system.ID
        params.unapproveAt = new Date().toISOString()
      }
      axios({
        method: 'PUT',
        url: this.serverIp + 'vehicle-flow/' + ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Phê duyệt yêu cầu thành công!', 'success')
          self.getListApprovement()
          self.handleClose()
        })
        .catch(function(err) {
          self.notify(null, `Phê duyệt yêu cầu thất lại, lỗi: ${err}`, 'error')
        })
    },
    changePage(page) {
      this.pagination.currentPage = page
      this.getListApprovement()
    },
    getListApprovement() {
      const self = this
      self.loadingTable = true
      const { status, managerId, numberPlate, userId } = this.formSearch
      const { currentPage, defaultPageSize } = this.pagination
      const params = {
        managerId: managerId,
        numberPlate: numberPlate,
        status: status,
        userId: userId ? [userId] : null,
        count: defaultPageSize,
        page: currentPage - 1
      }
      axios({
        method: 'POST',
        url: this.serverIp + 'vehicle-flow/query',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          const response = res.data.Data
          self.tableData = response.sort(
            (a, b) => Date.parse(b.CreatedAt) - Date.parse(a.CreatedAt)
          )
          self.pagination.FilteredData = res.data.FilteredData
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
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
        approveAt: null,
        approveId: null,
        businessId: null,
        description: null,
        flowRouteProvinces: [],
        fromDate: null,
        fromPlace: null,
        goodsType: null,
        goodsVolume: null,
        managerId: null,
        numberPlate: null,
        phoneNumber: null,
        purpose: null,
        reason: null,
        regDate: null,
        regDeadline: null,
        status: null,
        toDate: null,
        toPlace: null,
        unapproveAt: null,
        unapproveId: null,
        vehicleBrand: null,
        vehicleOwner: null,
        vehicleType: null
      }
      return obj
    },
    getListUser() {
      const self = this
      self.loadingGetUser = true
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
          self.ListUser = res.data.Data
          self.loadingGetUser = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingGetUser = false
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

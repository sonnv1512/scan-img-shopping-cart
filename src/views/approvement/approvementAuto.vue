<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Chờ phê duyệt</span>
      </div>
      <!-- end: header -->
      <div class="approvement-body">
        <div class="filter-section">
          <div class="filter-item">
            <label class="label-name" for="name">Đơn vị xử lý</label>
            <el-select
              v-model="formSearch.managerId"
              size="medium"
              placeholder="Chọn tất cả"
              clearable
              multiple
              filterable
            >
              <el-option
                v-for="item in ListProvince"
                :key="item.ID"
                :label="`Sở ${item.name}`"
                :value="item.ID"
              />
            </el-select>
          </div>
          <!-- <el-input
            v-model="formSearch.numberPlate"
            size="medium"
            placeholder="Nhập biển số xe"
            suffix-icon="el-icon-search"
          /> -->
          <a-button
            class="justify-start"
            type="primary"
            @click="getListApprovement"
          >Lấy dữ liệu</a-button>
          <el-input
            v-model="formSearch.secretCode"
            size="medium"
            placeholder="Nhập mã số bí mật mà bạn đã được bật mí"
            suffix-icon="el-icon-search"
          />
          <a-button
            class="justify-start"
            type="primary"
            @click="auto"
          >Cắm auto</a-button>
          <el-switch
            v-model="formSearch.activeAuto"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="Hoạt động"
            inactive-text="Tạm dừng"
          />
          <!-- <a-button
            class="justify-start"
            type="primary"
            @click="approverByCondition"
          >Từ chối hàng loạt</a-button> -->
        </div>
        <div class="action-section mobi-scroll">
          <div class="left-side">
            <div class="list-container">
              <div
                v-for="(item, index) of tableData"
                :key="index"
                :class="editItem && editItem.ID == item.ID ? 'selected' : ''"
                class="approve-item"
                @click="selectItem(item, index)"
              >
                <div class="first-line">
                  <span class="app-bks">BKS: <span class="app-bks-content">{{ item.numberPlate }}</span></span>
                  <span class="app-date">{{
                    item.CreatedAt | customDateFromDate('#hhhh#h:#mm# #DD#/#MM#/#YYYY#')
                  }}</span>
                </div>
                <div class="second-line">
                  <span
                    v-if="item.flowRouteProvinces.some(x => x.type == 1)"
                    class="app-route special"
                  >Luồng xanh quốc gia</span>
                  <span v-else class="app-route">Luồng xanh nội tỉnh</span>
                </div>
                <div v-if="item.goodsType == 1" class="third-line">
                  <i class="el-icon-box good-icon" />
                  <span class="app-goodtype">Hàng mau hỏng</span>
                </div>
              </div>
            </div>
            <div class="loadMore">
              <a-button type="link" :disabled="requestLeft === 0" @click="loadMore">
                Hiển thị thêm dữ liệu (còn {{ requestLeft | number }} đơn)
              </a-button>
            </div>
          </div>
          <div class="right-side">
            <div
              v-if="editItem"
              v-loading="loadingRightSide"
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
                    <label class="info-title" for="">BIỂN SỐ ĐĂNG KÝ</label>
                    <span class="info-content">{{ editItem.numberPlate }}</span>
                  </div>
                  <div class="vehicle-item">
                    <label class="info-title" for="">LOẠI PHƯƠNG TIỆN</label>
                    <span class="info-content">{{ editItem.vehicleType }}</span>
                  </div>
                  <div class="vehicle-item">
                    <label class="info-title" for="">KL hàng CC CP TGGT</label>
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
                    <label class="info-title" for="">Phù hiệu kinh doanh</label>
                    <span class="info-content">{{
                      editItem.businessBadges == 1 ? 'Có' : 'Không có'
                    }}</span>
                  </div>
                  <div class="vehicle-item">
                    <label class="info-title" for="">Thiết bị GSHT</label>
                    <span class="info-content">{{
                      editItem.cameraJourney == 1 ? 'Có' : 'Không có'
                    }}</span>
                  </div>
                  <div class="vehicle-item">
                    <label class="info-title" for="">Hàng hóa vận chuyển</label>
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
                  <label class="info-title" for="">Nơi đi</label>
                  <span class="info-content">{{ editItem.fromPlace }}</span>
                </div>
                <div class="place-info">
                  <label class="info-title" for="">Nơi đến</label>
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
                >Thông tin tài xế</label>
                <p class="covid-test">Giấy xét nghiệm Covid 19 (âm tính) còn hiệu lực tại thời điểm đăng ký được coi là hợp lệ</p>
                <div class="info-driver-section">
                  <div v-for="(driver, index) of editItem.drivers" :key="index+'itemDrivers'" class="info-driver-container">
                    <div class="driver-item">
                      <p class="info-title">Tên tài xế ({{ index + 1 }})</p>
                      <span class="info-content">{{ driver.name || '' }}</span>
                    </div>
                    <div class="driver-item">
                      <p class="info-title">Ngày sinh</p>
                      <span class="info-content">{{ driver.birthday || '' }}</span>
                    </div>
                    <div class="driver-item">
                      <p class="info-title">Số điện thoại</p>
                      <span class="info-content">{{ driver.phoneNumber || '' }}</span>
                    </div>
                    <div class="driver-item">
                      <p class="info-title">Số GPLX</p>
                      <span class="info-content">{{ driver.driverLicense || '' }}</span>
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
              <i
                class="warranty"
              >Tôi xin cam kết tuân thủ các nội dung về phòng, chống dịch bệnh
                Covid - 19 theo quy định của bộ y tế, các cơ quan khác có liên
                quan; cam đoan nội dung kê khai nêu trên là đúng sự thật và hoàn
                toàn chịu trách nhiệm trước pháp luật.</i>
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
                <div class="action">
                  <el-radio
                    v-model="radio"
                    class="approve"
                    :label="1"
                  >Đồng ý</el-radio>
                  <el-radio
                    v-model="radio"
                    class="reject"
                    :label="2"
                  >Từ chối</el-radio>
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
                <a-popconfirm
                  title="Xác nhận thao tác phê duyệt"
                  ok-text="Đồng ý"
                  cancel-text="Hủy"
                  @confirm="confirm($event, 'Phê duyệt')"
                  @cancel="cancel($event, 'Phê duyệt')"
                >
                  <a-button
                    class="justify-end"
                    type="primary"
                  >Phê duyệt</a-button>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="Thêm lộ trình"
      :visible.sync="dialogAddFlow"
      width="70%"
    >
      <div class="add-flow-dialog">
        <div class="filter-contain">
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
          <div class="filter-item">
            <label class="label-name" for="name">Tìm kiếm theo tên/luồng (không dấu)</label>
            <el-input
              v-model="formAddFlow.text"
              size="medium"
              placeholder="Nhập tên, ví dụ: 'quoc lo 1 ...'"
              suffix-icon="el-icon-search"
              @change="handleSelectFlow"
            />
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
import LXEMUN from '@/class/StatusType'

export default {
  data() {
    return {
      formSearch: {
        secretCode: null,
        managerId: [],
        status: [0],
        activeAuto: false
      },
      formAddFlow: {
        // type: null,
        province: null,
        text: null
      },
      pagination: {
        currentPage: 1,
        defaultPageSize: 50,
        FilteredData: 0
      },
      loadingTable: false,
      loadingSubmit: false,
      loadingRightSide: false,
      tableData: [],
      ListProvince: Province,
      editItem: null,
      radio: 1,
      // add flow
      dialogAddFlow: false,
      ListType: this.$func.FlowRouteProvince_type(),
      listFlow: {
        allFlow: [],
        filterFlow: [],
        selected: []
      },
      ListGoodType: LXEMUN.Good_type,
      refuseReason: []
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo']),
    requestLeft() {
      const res = this.pagination.FilteredData - (this.pagination.currentPage * this.pagination.defaultPageSize)
      return res > 0 ? res : 0
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
    // this.formSearch.managerId = this.userInfo.user_system.departmentId
    //   ? [this.userInfo.user_system.departmentId]
    //   : []
    this.getListApprovement()
    this.getListFlowRouteAll()
  },
  methods: {
    async auto() {
      const self = this
      if (this.formSearch.secretCode !== '123123@@') {
        return
      }
      this.formSearch.secretCode = ''
      this.formSearch.activeAuto = true
      const data = this.tableData
      for (const item of data) {
        if (!this.formSearch.activeAuto) {
          break
        }
        await new Promise((resolve, reject) => {
          const checkItem = this.checkOneItem(item)
          console.log(checkItem)
          let param
          if (checkItem.status === true) {
            param = {
              status: 1,
              approveId: this.userInfo.user_system.ID,
              approveAt: new Date().toISOString()
            }
          }
          if (checkItem.status === false) {
            param = {
              status: 2,
              unapproveId: this.userInfo.user_system.ID,
              unapproveAt: new Date().toISOString(),
              reason: checkItem.refuseReason.join(', ')
            }
          }
          axios({
            method: 'PUT',
            url: 'https://api.anvui.vn/gov/vehicle-flow/' + item.ID,
            headers: {
              Authorization: `Bearer ${self.token}`,
              'Content-Type': 'application/json'
            },
            data: param
          })
            .then(function(res) {
              self.notify(null, 'Phê duyệt yêu cầu thành công!', 'success')
              resolve()
            })
            .catch(function(err) {
              self.notify(null, `Phê duyệt yêu cầu thất lại, lỗi: ${err}`, 'error')
              reject()
            })
        })
      }
      // for await (const item of data) {
      //     const a = new Promise((resolve, reject) => {
      //         return setTimeout(() => {
      //             const abc = this.checkOneItem(item)
      //             console.log(abc)
      //             resolve()
      //         }, 1000);
      //     })
      // }
      console.log('Done with number Item: ', data.length)
      this.getListApprovement()
    },
    checkOneItem(item) {
      let status = true
      const refuseReason = []
      const numberPlate = item.numberPlate
      if (!item.regDate) {
        status = false
        refuseReason.push('Thiếu ngày đăng ký')
      }
      if (!item.identifiedCode) {
        status = false
        refuseReason.push('Thiếu CMT/CCCD hoặc MS DKKD')
      }
      if (!item.vehicleOwner) {
        status = false
        refuseReason.push('Thiếu Chủ phương tiện / Tên Doanh nghiệp')
      }
      if (!item.phoneNumber) {
        status = false
        refuseReason.push('Thiếu số điện thoại liên hệ')
      }
      if (!item.vehicleType) {
        status = false
        refuseReason.push('Thiếu loại phương tiện')
      }
      if (item.businessBadges !== 1) {
        status = false
        refuseReason.push('Thiếu phù hiệu')
      }
      if (item.cameraJourney !== 1) {
        status = false
        refuseReason.push('Thiếu thiết bị giám sát hành trình')
      }
      if (!item.numberPlate) {
        status = false
        refuseReason.push('Thiếu biển kiểm soát')
      }
      if (!item.goodsVolume) {
        status = false
        refuseReason.push('Thiếu KL hàng CC CP TGGT')
      }
      if (!item.regDeadline) {
        status = false
        refuseReason.push('Thiếu hạn đăng kiểm')
      }
      if (item.images.length < 3) {
        status = false
        refuseReason.push('Không đủ thông tin đăng ký (đơn đăng ký cấp LXVT, hình ảnh xe, giấy đăng kiểm)')
      }
      // tai xe va nguoi di cung
      if (item.drivers.length === 0) {
        status = false
        refuseReason.push('Thiếu thông tin tài xế')
      }
      if (item.drivers.some(driver => !driver.birthday)) {
        status = false
        refuseReason.push('Thiếu ngày tháng năm sinh')
      }
      if (!item.drivers.some(driver => driver.driverLicense)) {
        status = false
        refuseReason.push('Thiếu số GPLX của tài xế')
      }
      if (item.drivers.some(driver => !driver.name)) {
        status = false
        refuseReason.push('Thiếu tên tài xế')
      }
      if (item.drivers.some(driver => !driver.phoneNumber)) {
        status = false
        refuseReason.push('Thiếu số điện thoại')
      }
      if (item.drivers.some(driver => !driver.covidTestBeginDate)) {
        status = false
        refuseReason.push('Thiếu thông tin ngày làm xét nghiệm')
      }
      if (item.drivers.some(driver => !driver.covidTestExpiredDate)) {
        status = false
        refuseReason.push('Thiếu thông tin ngày hết hạn xét nghiệm')
      }
      if (item.drivers.some(driver => driver.driverImages.length === 0)) {
        status = false
        refuseReason.push('Thiếu ảnh chụp xét nghiệm covid (âm tính)')
      }
      if (!item.fromPlace) {
        status = false
        refuseReason.push('Thiếu địa chỉ nơi đi')
      }
      if (!item.toPlace) {
        status = false
        refuseReason.push('Thiếu địa chỉ nơi đến')
      }
      if (this.$func.removeVietnameseTones(item.fromPlace).toLowerCase() ===
            this.$func.removeVietnameseTones(item.toPlace).toLowerCase()) {
        status = false
        refuseReason.push('Địa chỉ nơi đi giống nơi đến')
      }
      if (item.flowRouteProvinces.length === 0) {
        status = false
        refuseReason.push('Thiếu thông tin lộ trình')
      }
      if (item.flowRouteProvinces.filter(x => x.type === 1).length > 3) {
        status = false
        refuseReason.push('Vượt quá số lộ trình quốc gia được cho phép (chọn tối đa 3)')
      }
      if (!item.flowRouteProvinces.filter(x => x.type === 0).length > 3) {
        status = false
        refuseReason.push('Vượt quá số lộ trình nội tỉnh được cho phép (chọn tối đa 3)')
      }
      if (item.goodsKinds.length === 0) {
        status = false
        refuseReason.push('Thiếu thông tin hàng hóa')
      }
      if (!item.managerId) {
        status = false
        refuseReason.push('Thiếu đơn vị xử lý')
      }

      // if (this.$func.validNumberPlate(item.numberPlate).split('')
      //         .some(x => ['a', 'b', 'g', 'e', 'f']
      //         .includes(x.toLowerCase()))
      //     ) {
      //     status = false
      //     refuseReason.push('Thiếu đơn đăng ký cấp luồng xanh')
      // }
      return { numberPlate, refuseReason, status, item }
    },
    loadMore() {
      const self = this
      self.loadingTable = true

      // plus page count
      this.pagination.currentPage += 1
      const { currentPage, defaultPageSize } = this.pagination
      const { status, managerId, numberPlate } = this.formSearch
      const params = {
        numberPlate: numberPlate,
        managerId: managerId,
        status: status,
        count: defaultPageSize,
        page: currentPage - 1
      }
      axios({
        method: 'POST',
        url: 'https://api.anvui.vn/gov/vehicle-flow/query',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.tableData = self.tableData.concat(res.data.Data)
          self.pagination.FilteredData = res.data.FilteredData
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    addFlowToItem() {
      this.editItem.flowRouteProvinces = this.editItem.flowRouteProvinces.concat(this.listFlow.selected)
      this.dialogAddFlow = false
      this.listFlow.selected = []
    },
    handleSelectFlow() {
      let filterList = this.listFlow.allFlow
      const { province, text } = this.formAddFlow
      if (!province) {
        this.listFlow.filterFlow = []
        return
      }
      filterList = filterList.filter(x => x.provinces.map(x => x.ID).includes(province))
      if (text) {
        const textSearch = this.$func.removeVietnameseTones(text)
        filterList = filterList.filter(x =>
          this.$func.removeVietnameseTones(x.name).search(textSearch) !== -1 ||
          this.$func.removeVietnameseTones(x.flowRouteProvinceName).search(textSearch) !== -1
        )
      }
      this.listFlow.filterFlow = filterList
    },
    handleSelectionChange(val) {
      this.listFlow.selected = val
    },
    getListFlowRouteAll() {
      const self = this
      axios({
        method: 'GET',
        url: 'https://api.anvui.vn/gov/flow-route-province/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(function(res) {
          self.listFlow.allFlow = res.data.Data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleRemoveFlow(index) {
      this.editItem.flowRouteProvinces.splice(index, 1)
    },
    selectItem(approvement, index) {
      this.loadingRightSide = true
      setTimeout(() => {
        this.loadingRightSide = false
      }, 300)
      const item = JSON.parse(JSON.stringify(approvement))
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
    },
    submitForm() {
      const self = this
      const { reason, ID, fromDate, toDate, flowRouteProvinces } = this.editItem
      const status = this.radio
      if (status === 2 && !reason) {
        this.notify(null, 'Vui lòng nhập lý do từ chối', 'warning')
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
      if (status === 2) { // tu choi
        params.unapproveId = this.userInfo.user_system.ID
        params.unapproveAt = new Date().toISOString()
      }
      axios({
        method: 'PUT',
        url: 'https://api.anvui.vn/gov/vehicle-flow/' + ID,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Phê duyệt yêu cầu thành công!', 'success')
          self.getListApprovement()
        })
        .catch(function(err) {
          self.notify(null, `Phê duyệt yêu cầu thất lại, lỗi: ${err}`, 'error')
        })
    },
    getListApprovement() {
      const self = this
      self.loadingTable = true
      // reset page count
      this.pagination.currentPage = 1

      const { status, managerId, numberPlate } = this.formSearch
      const { defaultPageSize } = this.pagination
      const params = {
        numberPlate: numberPlate,
        managerId: managerId,
        status: status,
        count: defaultPageSize,
        page: 0
      }
      axios({
        method: 'POST',
        url: 'https://api.anvui.vn/gov/vehicle-flow/query',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.tableData = res.data.Data
          if (res.data.Data.length !== 0) {
            self.selectItem(res.data.Data[0], 0)
          }
          self.pagination.FilteredData = res.data.FilteredData
          self.auto()
          self.loadingTable = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingTable = false
        })
    },
    openImage(link) {
      window.open(link, '_blank')
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
    confirm(e, actionName = null, data = null) {
      // console.log(e)
      this.$message.success(`Xác nhận thao tác ${actionName ? `: ${actionName}` : ''}`)
      this.submitForm()
    },
    cancel(e, actionName = null) {
      // console.log(e)
      this.$message.error(`Hủy thao tác ${actionName ? `: ${actionName}` : ''}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.approvement-body {
  display: grid;
  grid-gap: 1rem;
  .filter-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    grid-gap: 1rem;
    align-items: flex-start;
    .filter-item {
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
      .label-name {
        width: 100px;
        color: #383f47;
        font-size: 14px;
        margin-right: 3px;
        margin-top: 8px;
        font-weight: 400;
      }
    }
  }
  .action-section {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    .left-side {
      flex-basis: 0;
      flex-grow: 3;
      padding-right: 30px;
      border-right: 1px solid #ecedf1;
      .list-container {
        max-height: calc(100vh - 250px);
        overflow: hidden;
        overflow-y: scroll;
        padding-right: 10px;
        .selected {
          background: #cce9ff;
        }
        .approve-item {
          width: 100%;
          border-bottom: 1px solid #ecedf1;
          display: grid;
          grid-gap: 5px;
          padding: 10px;
          cursor: pointer;
          .first-line {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: baseline;
            .app-bks {
              color: #383f47;
              font-size: 14px;
              line-height: 22px;
              &-content {
                font-size: 16px;
                font-weight: 500;
              }
            }
            .app-date {
              color: #646d84;
              font-size: 12px;
              font-weight: 500;
              line-height: 16px;
            }
          }
          .second-line {
            .app-route {
              color: #646d84;
              font-size: 12px;
              font-weight: 500;
              line-height: 16px;
            }
            .special {
              color: #0091fe;
            }
          }
          .third-line {
            .good-icon {
              color: orange;
              margin-right: 5px;
            }
            .app-goodtype {
              color: #383f47;
              font-size: 12px;
              font-weight: 500;
              line-height: 16px;
            }
          }
        }
      }
      .list-container::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #f5f5f5;
        border-radius: 10px;
      }

      .list-container::-webkit-scrollbar {
        width: 10px;
        background-color: #f5f5f5;
      }

      .list-container::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #fff;
        background-image: -webkit-linear-gradient(
          top,
          #e4f5fc 0%,
          #bfe8f9 50%,
          #9fd8ef 51%,
          #2ab0ed 100%
        );
      }
      .loadMore {
        margin-top: 15px;
        text-align: center;
      }
    }
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
          .covid-test {
            font-size: 14px;
            color: red;
            word-break: break-word;
          }
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

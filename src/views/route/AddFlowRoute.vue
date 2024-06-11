<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Tạo lộ trình mới</span>
        <div class="justify-end">
          <!-- operation button -->
        </div>
      </div>
      <!-- end: header -->
      <div class="flow-route-contain">
        <div class="left-side form-1col">
          <div class="form-item">
            <label for="name">Tên lộ trình</label>
            <el-input
              v-model="formSubmit.customPointName"
              size="medium"
              placeholder="Nhập tên lộ trình"
            />
          </div>
          <div class="form-item">
            <label>Tỉnh xuất phát</label>
            <el-select
              v-model="formSubmit.fromProvince"
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
          <div class="form-item">
            <label>Tỉnh kết thúc</label>
            <el-select
              v-model="formSubmit.toProvince"
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
          <div class="form-item">
            <label>Điểm dừng</label>
            <div class="flowPoint-contain">
              <el-select
                v-for="(item, index) of formSubmit.flowPoint"
                :key="index+'flowPoint'"
                v-model="formSubmit.flowPoint[index]"
                size="medium"
                placeholder="Chọn điểm dừng"
                clearable
                filterable
                :loading="loadingGetPoint"
              >
                <el-option
                  v-for="point in ListPoint"
                  :key="point.ID"
                  :label="point.name"
                  :value="point.ID"
                />
              </el-select>
            </div>
          </div>
          <div>
            <a-button class="justify-baseline" type="primary" @click="addFlowPoint">
              <a-icon type="plus-circle" />Thêm điểm dừng
            </a-button>
          </div>
          <a-button class="justify-baseline" @click="saveFlow">
            Lưu lộ trình<a-icon type="right" />
          </a-button>
        </div>
        <div class="right-side">
          <p class="no-margin">Danh sách lộ trình đã lưu</p>
          <div v-for="(flow, index) of ListSubmit" :key="index+'ListSubmit'">
            <el-tag type="warning">{{ index }}</el-tag>
          </div>
          <a-button type="primary" class="justify-baseline">
            {{ `Tạo ${ListSubmit.length} lộ trình` }}
          </a-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import Province from '@/class/Province'

export default {
  name: 'Dashboard',
  data() {
    return {
      formSubmit: {
        value: null,
        customPointName: null,
        fromProvince: null,
        toProvince: null,
        flowPoint: [null],
        status: 1
      },
      ListSubmit: [],
      ListProvince: Province,
      ListPoint: [],
      loadingGetPoint: false
    }
  },
  computed: {
    ...mapGetters(['token', 'serverIp'])
  },
  mounted() {
    this.getListPoint()
  },
  methods: {
    // mix1(item) {
    // },
    saveFlow() {
      const { customPointName, fromProvince, toProvince, flowPoint } = this.formSubmit
      const params = {
        customPointName: customPointName,
        fromProvinceId: fromProvince,
        fromProvinceName: this.ListProvince.find(x => x.ID === fromProvince).name,
        toProvinceId: toProvince,
        toProvinceName: this.ListProvince.find(x => x.ID === toProvince).name,
        flowPointIds: flowPoint,
        flowPointNames: flowPoint.map(flow => this.ListPoint.find(point => point.ID === flow).name),
        status: 1
      }
      this.ListSubmit.push(params)
    },
    addFlowPoint() {
      this.formSubmit.flowPoint.push(null)
    },
    getListPoint() {
      const self = this
      self.loadingGetPoint = true
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
          self.ListPoint = res.data.Data
          self.loadingGetPoint = false
        })
        .catch(function(err) {
          console.log(err)
          self.loadingGetPoint = false
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
.flow-route-contain {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  .left-side {
    flex-basis: 0;
    flex-grow: 4;
    margin-right: 30px;
    padding-right: 30px;
    border-right: 1px solid #ECEDF1;
  }
  .right-side {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    flex-basis: 0;
    flex-grow: 5;
    justify-items: baseline;
  }
}
.flowPoint-contain {
    display: grid;
    grid-gap: 5px;
}
</style>

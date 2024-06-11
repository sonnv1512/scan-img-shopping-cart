<template>
  <div class="lx-body">
    <el-card class="box-card">
      <!-- start: header -->
      <div slot="header" class="header">
        <span class="title">Danh sách các lộ trình</span>
        <div class="justify-end">
          <a-button type="primary" @click="openAddFlowRoute">
            <a-icon type="plus-circle" />Tạo lộ trình
          </a-button>
        </div>
      </div>
      <!-- end: header -->
      <div class="filter-contain">
        <div class="filter-item">
          <label for="filter">Hiển thị theo cục</label>
          <el-select
            v-model="formSearch.value1"
            size="medium"
            placeholder="Tất cả các cục"
            disabled
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label for="filter">Hiển thị theo sở</label>
          <el-select
            v-model="formSearch.value2"
            size="medium"
            placeholder="Tất cả các sở"
            disabled
          >
            <el-option
              v-for="item in ListProvince"
              :key="item.ID"
              :label="`Sở ${item.name}`"
              :value="item.ID"
            />
          </el-select>
        </div>
      </div>
      <!-- start: table -->
      <el-table :data="tableData" :row-class-name="$func.tableRowClassName">
        <el-table-column prop="provinceName" label="Tỉnh" width="180" />
        <el-table-column prop="name" label="Tên lộ trình" />
        <el-table-column prop="flowRouteProvinceName" label="Lộ trình">
          <template slot-scope="scope">{{ scope.row.flowRouteProvinceName }}</template>
        </el-table-column>
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            <!-- <a-button
              shape="circle"
              icon="edit"
              type="warning"
              @click="handleEditFlowRoute(scope.row)"
            /> -->
            <a-button
              shape="circle"
              icon="delete"
              type="danger"
              @click="handleDeleteFlowRoute(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import Province from '@/class/Province'

export default {
  data() {
    return {
      formSearch: {
        value1: null,
        value2: null
      },
      options: [],
      tableData: [],
      loadingSubmit: false,
      loadingTable: true,
      ListProvince: Province,
      ListDivision: this.$func.renderDivision()
    }
  },
  computed: {
    ...mapGetters(['token', 'serverIp'])
  },
  mounted() {
    this.getListFlowRoute()
  },
  methods: {
    getListFlowRoute() {
      const self = this
      self.loadingTable = true
      axios({
        method: 'GET',
        url: this.serverIp + 'flow-route-province/',
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
          self.notify(null, 'Xóa lộ trình thành công!', 'success')
          self.getListFlowRoute()
        })
        .catch(function(err) {
          self.notify(null, `Xóa lộ trình thất lại, lỗi: ${err}`, 'error')
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

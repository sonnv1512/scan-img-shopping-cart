<template>
  <div class="lx-body">
    <div class="import-file">
      <h2>Import File</h2>
      <div>
        Chọn file:
        <el-tooltip
          class="item"
          effect="dark"
          :content="contentChooseFile"
          placement="top-start"
        >
          <i class="el-icon-warning" />
        </el-tooltip>
      </div>
      <input id="upload" type="file" class @change="importExcel">
      <a-button
        class="import-file-btn"
        type="primary"
        @click="handleImportData()"
      >
        Import Data to Server
      </a-button>
      <!-- table luồng -->
      <!-- <el-table :data="importData" border stripe style="width: 100%">
        <el-table-column label="STT" type="index" width="50" />
        <el-table-column prop="provinces" label="Tỉnh" />
        <el-table-column prop="name" label="Tên luồng" />
        <el-table-column prop="flowRouteProvinceName" label="Luồng" />
        <el-table-column prop="type" label="Loại luồng" />
      </el-table> -->
      <!-- table yêu cầu -->
      <el-table :data="importData" border stripe style="width: 100%">
        <el-table-column label="STT" type="index" width="50" />
        <el-table-column prop="provinces" label="Tỉnh" />
        <el-table-column prop="name" label="Tên luồng" />
        <el-table-column prop="flowRouteProvinceName" label="Luồng" />
        <el-table-column prop="type" label="Loại luồng" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import xlsx from 'xlsx'
import Province from '@/class/Province'

export default {
  name: 'ImportData',
  data() {
    return {
      contentChooseFile: null,
      importData: null,
      ListProvince: Province,
      citizenToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbm5ndXllbkBhbnZ1aS52biIsImV4cCI6MTYzMDQ5MDMxOCwiaWQiOjEzNjQzNX0.SHq2bR3hx7XzVJE-i5TEw2VUPBTxSlfZjDwIBKEHSjg'
    }
  },
  computed: {
    ...mapGetters(['token', 'name', 'userInfo', 'serverIp'])
  },
  methods: {
    handleImportData() {
      console.log('click!')
      // this.changeData(this.importData)
      // const FilterData = this.importData
      const FilterData = this.importData.filter(x => x.numberPlate)
      console.log('Filter Data, not null BKS', FilterData)
      // const data = [this.importData[0]]
      // this.saveToDb(FilterData)
    },
    async saveToDb(data) {
      const self = this
      const params = this.format(data)

      for (const task of params) {
        const driverParams = []
        for (const driver of task.drivers) {
          const rep = await new Promise((resolve, reject) => {
            const params = {
              name: driver.name,
              birthDay: null,
              driverLicense: '',
              phoneNumber: driver.phoneNumber.split('').filter(x => !isNaN(x) && x !== ' ').join(''),
              DriverImages: [],
              BusinessId: driver.businessId,
              covidTestBeginDate: null,
              covidTestExpiredDate: null
            }
            axios({
              method: 'POST',
              url: this.serverIp + 'driver/',
              headers: {
                Authorization: `Bearer ${self.citizenToken}`,
                'Content-Type': 'application/json'
              },
              data: params
            })
              .then(function(res) {
                return resolve(res)
              })
              .catch(function(err) {
                return reject(err)
              })
          })
          driverParams.push(rep)
        }
        task.drivers = driverParams

        await new Promise((resolve, reject) => {
          axios({
            method: 'POST',
            url: this.serverIp + 'vehicle-flow/',
            headers: {
              Authorization: `Bearer ${self.citizenToken}`,
              'Content-Type': 'application/json'
            },
            data: task
          })
            .then(function(res) {
              resolve()
            })
            .catch(function(err) {
              localStorage.setItem('error_' + task.index, JSON.stringify(err.response))
              console.log(err.response)
              reject(err)
            })
        })
        console.log('DONE INDEX', task.index, task)

        if (task.index === params.length - 1) {
          this.notify(null, 'Thành công', 'success')
        }
      }
    },
    format(data) {
      const params = data.map((_, ind) => {
        if (_.driverName && _.driverName.toString().includes('\n')) {
          _.driverNameArr = _.driverName.split('\n')
        } else {
          _.driverNameArr = [_.driverName || '']
        }

        if (_.phone && _.phone.toString().includes(';')) {
          _.phoneNumberArr = _.phone.split(';')
        } else {
          _.phoneNumberArr = [_.phone || '']
        }

        const listDriver = []

        _.driverNameArr.forEach((value, key) => {
          const tmp2 = {}
          tmp2.name = value
          tmp2.phoneNumber = _.phoneNumberArr[key] || ''
          tmp2.businessId = 136435

          listDriver.push(tmp2)
        })

        const params = {
          // listPhoneNumber: _.phoneNumberArr,
          // listDriverName: _.driverNameArr,
          index: ind,
          numberPlate: this.$func.validNumberPlate(_.numberPlate),
          vehicleOwner: _.name,
          vehicleType: '',
          vehicleBrand: '',
          phoneNumber: '',
          description: 'BOCONGTHUONG 02-08-2021',
          goodsVolume: parseInt(_.weigth),
          regDeadline: null,
          regDate: new Date().toISOString(),
          managerId: 1,
          businessId: 136435,
          status: 0,
          drivers: {
            name: _.driverName,
            phoneNumber: _.phoneNumber,
            businessId: 136435
          },
          businessBadges: 0,
          cameraJourney: 0,
          toDate: '2021-08-15T16:59:00.000Z',
          fromDate: '2021-08-01T17:00:00.000Z',
          purpose: _.purpose, // _.good
          goodsKinds: [{ ID: 8 }],
          fromPlace: _.fromPlace,
          toPlace: _.toPlace,
          flowRouteProvinces: [
            {
              ID: 775,
              CreatedAt: '2021-07-24T10:24:50.254852+07:00',
              UpdatedAt: '2021-07-27T15:49:19.201496+07:00',
              DeletedAt: null,
              name: 'Khu vực vành đai 3 vào trung tâm',
              flowRouteProvinceName:
                'Đường Vành đai 3 dưới đất: Đường gom Vành đai 3 (Pháp Vân – Giải Phóng) – Nghiêm Xuân Yêm – Nguyễn Xiển – Khuất Duy Tiến – Phạm Hùng – Phạm Văn Đồng – Cầu Thăng Long – Võ Văn Kiệt – Võ Chí Công – Hoàng Sa – Trường Sa – Nguyễn Văn Linh và kết nối với Hệ thống đường hướng tâm:\nNút giao Pháp Vân - Giải Phóng – Lê Duẩn;\nNút giao Thanh Xuân – Nguyễn Trãi – Tây Sơn – Nguyễn Lương Bằng - Tôn Đức Thắng;\nNút giao Thanh Xuân – Khuất Duy Tiến – Lê Văn Lương – Láng Hạ - Giảng Võ;\nNút giao Trung Hoà – Đại lộ Thăng Long – Trần Duy Hưng – Nguyễn Chí Thanh -  Liễu Giai – Văn Cao;\nNút giao Mai Dịch – Xuân Thuỷ - Cầu Giấy – Kim Mã – Nguyễn Thái Học;\nNút giao Trung tâm Quận Long Biên – Nguyễn Văn Cừ - Cầu Chương Dương;\nNút giao cầu vượt đường 5 – Đàm Quang Trung – Cầu Vĩnh Tuy.\n',
              status: 1,
              type: 0,
              provinces: [
                {
                  ID: 1,
                  CreatedAt: '2021-07-15T14:03:03+07:00',
                  UpdatedAt: '2021-07-27T15:49:19.145787+07:00',
                  DeletedAt: null,
                  code: '01  ',
                  name: 'Hà Nội',
                  unitName: 'Thành phố'
                }
              ],
              provinceIds: [1]
            },
            {
              ID: 774,
              CreatedAt: '2021-07-24T10:24:30.754656+07:00',
              UpdatedAt: '2021-07-27T15:49:18.663748+07:00',
              DeletedAt: null,
              name: 'Khu vực vành đai 2 vào trung tâm',
              flowRouteProvinceName:
                'Đường Vành đai 2: Cầu Vĩnh Tuy – Minh Khai – Đại La – Trường Chinh – đường Láng – đường Bưởi – Võ Chí Công – Cầu Nhật Tân và kết nối với Hệ thống đường hướng tâm:\nNút giao Pháp Vân - Giải Phóng – Lê Duẩn;\nNút giao Thanh Xuân – Nguyễn Trãi – Tây Sơn – Nguyễn Lương Bằng - Tôn Đức Thắng;\nNút giao Thanh Xuân – Khuất Duy Tiến – Lê Văn Lương – Láng Hạ - Giảng Võ;\nNút giao Trung Hoà – Đại lộ Thăng Long – Trần Duy Hưng – Nguyễn Chí Thanh -  Liễu Giai – Văn Cao;\nNút giao Mai Dịch – Xuân Thuỷ - Cầu Giấy – Kim Mã – Nguyễn Thái Học;\nNút giao Trung tâm Quận Long Biên – Nguyễn Văn Cừ - Cầu Chương Dương;\nNút giao cầu vượt đường 5 – Đàm Quang Trung – Cầu Vĩnh Tuy.\n',
              status: 1,
              type: 0,
              provinces: [
                {
                  ID: 1,
                  CreatedAt: '2021-07-15T14:03:03+07:00',
                  UpdatedAt: '2021-07-27T15:49:19.145787+07:00',
                  DeletedAt: null,
                  code: '01  ',
                  name: 'Hà Nội',
                  unitName: 'Thành phố'
                }
              ],
              provinceIds: [1]
            },
            {
              ID: 773,
              CreatedAt: '2021-07-24T10:22:00.158582+07:00',
              UpdatedAt: '2021-07-27T15:49:09.327427+07:00',
              DeletedAt: null,
              name: 'Khu vực vành đai 1 vào trung tâm',
              flowRouteProvinceName:
                'Đường Vành đai 1: An Dương Vương – Âu Cơ – Nghi Tàm – Yên Phụ - Trần Nhật Duật – Trần Quang Khải – Trần Khánh Dư - Đê Nguyễn Khoái – Trần Khát Chân – Đại Cồ Việt – La Thành và kết nối với Hệ thống đường hướng tâm:\nNút giao Pháp Vân - Giải Phóng – Lê Duẩn;\nNút giao Thanh Xuân – Nguyễn Trãi – Tây Sơn – Nguyễn Lương Bằng - Tôn Đức Thắng;\nNút giao Thanh Xuân – Khuất Duy Tiến – Lê Văn Lương – Láng Hạ - Giảng Võ;\nNút giao Trung Hoà – Đại lộ Thăng Long – Trần Duy Hưng – Nguyễn Chí Thanh -  Liễu Giai – Văn Cao;\nNút giao Mai Dịch – Xuân Thuỷ - Cầu Giấy – Kim Mã – Nguyễn Thái Học;\nNút giao Trung tâm Quận Long Biên – Nguyễn Văn Cừ - Cầu Chương Dương;\nNút giao cầu vượt đường 5 – Đàm Quang Trung – Cầu Vĩnh Tuy.\n',
              status: 1,
              type: 0,
              provinces: [
                {
                  ID: 1,
                  CreatedAt: '2021-07-15T14:03:03+07:00',
                  UpdatedAt: '2021-07-27T15:49:19.145787+07:00',
                  DeletedAt: null,
                  code: '01  ',
                  name: 'Hà Nội',
                  unitName: 'Thành phố'
                }
              ],
              provinceIds: [1]
            }
          ],
          goodsType: 1,
          identifiedCode: ''
        }

        if (listDriver.length >= 0) {
          params.drivers = listDriver
        }

        return params
      })

      // check record not valid !
      // params = params.filter(_ => _.listPhoneNumber.length != _.listDriverName.length)
      // console.log(params)

      return params
    },
    importExcel(e) {
      const files = e.target.files
      //   const files = e;
      if (!files.length) {
        this.listSMfromExcel = []
        return
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        return alert(
          'The upload format is incorrect. Please upload xls or xlsx format'
        )
      }
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const XLSX = xlsx
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const wsname = workbook.SheetNames[0] // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // Generate JSON table content，wb.Sheets[Sheet名]    Get the data of the first sheet
          const excellist = [] // Clear received data
          // Edit data
          for (var i = 0; i < ws.length; i++) {
            excellist.push(ws[i])
          }
          // At this point, you get an array containing objects that need to be processed
          // console.log('Read results', excellist)
          this.importData = excellist.map(x => {
            return {
              name: x['Tên DN'],
              numberPlate: x['BKS'],
              vehicleType: x['Loại phương tiện'],
              weigth: x['Trọng tải'],
              // good: x['Hàng hóa'],
              managerId: x['Đơn vị tiếp nhận'],
              driverName: x['Họ tên lái xe'],
              phone: x['Điện thoại'],
              toPlace: x['Nơi đi'],
              fromPlace: x['Nơi đến'],
              businessBadges: x['Phù hiệu'],
              cameraJourney: x['Cam hành trình'],
              purpose: x['Đề xuất, kiến nghị (nếu có)']
              // toDate: x['Thời hạn cấp phép Từ Ngày'],
              // fromDate: x['Thời hạn cấp phép Đến Ngày'],
            }
          })
          console.log(JSON.parse(JSON.stringify(this.importData)))
        } catch (e) {
          return alert('Read failure!')
        }
      }
      fileReader.readAsBinaryString(files[0])
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
.import-file {
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
}
</style>

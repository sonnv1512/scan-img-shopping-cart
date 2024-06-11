<template>
  <div class="lx-body">
    <div class="import-file">
      <h2>Change version</h2>
      <a-input v-model="formSubmit.version" class="import-file-input" />
      <a-button type="primary" @click="submit()">
        Nhấn
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
        version: null
      },
      ListProvince: Province
    }
  },
  computed: {
    ...mapGetters(['token', 'name', 'userInfo', 'serverIp'])
  },
  mounted() {
    this.getVersion()
  },
  methods: {
    submit() {
      const self = this
      const params = {
        // ID: 1,
        description: this.formSubmit.version
      }
      axios({
        method: 'PUT',
        url:
          self.serverIp + 'system_info/' + 1,
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(
            null,
            'Cập nhật thành công',
            'success'
          )
        })
        .catch(function(err) {
          self.notify(
            null,
            `Cập nhật version thất lại, lỗi: ${err}`,
            'error'
          )
        })
    },
    getVersion() {
      const self = this
      axios({
        method: 'GET',
        url: self.serverIp + 'system_info/',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(function(res) {
          console.log(res.data.Data)
          self.formSubmit.version = res.data.Data.find(x => x.ID === 1) ? res.data.Data.find(x => x.ID === 1).description : null
        })
        .catch(function(err) {
          console.log(err)
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

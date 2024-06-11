<template>
  <div class="change-password">
    <h2>Đổi mật khẩu</h2>
    <el-input
      v-model="password"
      class="change-password-input"
      placeholder="Nhập mật khẩu mới"
      show-password
    />
    <el-input
      v-model="verifyPassword"
      class="change-password-input"
      placeholder="Nhập lại mật khẩu"
      show-password
    />
    <a-button class="change-password-btn" type="primary" @click="changePassword">
      Cập nhật
    </a-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'ChangePassword',
  data() {
    return {
      password: null,
      verifyPassword: null
    }
  },
  computed: {
    ...mapGetters(['token', 'name', 'userInfo', 'serverIp'])
  },
  methods: {
    changePassword() {
      const self = this
      if (this.password.length < 6) {
        this.notify(null, 'Mật khẩu phải dài ít nhất 6 ký tự', 'warning')
        return
      }
      if (this.password !== this.verifyPassword) {
        this.notify(null, 'Mật khẩu không giống nhau, vui lòng kiểm tra lại', 'warning')
        return
      }
      const params = {
        password: this.password,
        // salt: this.$func.renderRandomStr(10)
      }
      axios({
        method: 'POST',
        url: this.serverIp + 'crm/update',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          self.notify(null, 'Cập nhật mật khẩu mới thành công!', 'success')
          setTimeout(() => {
            self.logout()
          }, 1000)
        })
        .catch(function(err) {
          self.notify(null, `Cập nhật mật khẩu mới thất lại, lỗi: ${err}`, 'error')
        })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
.change-password {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  justify-content: center;
  &-input {
    width: 300px;
  }
  &-btn {
    margin-top: 10px;
  }
  &-input+&-input {
    margin-top: 10px;
  }
}
</style>

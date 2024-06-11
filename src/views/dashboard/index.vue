<template>
  <div class="dashboard-container">
    <img class="dashboard-image" src="@/assets/logo.png">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserLevel from '@/class/UserLevel'

export default {
  name: 'Dashboard',
  data() {
    return {
      UserLevel: UserLevel
    }
  },
  computed: {
    ...mapGetters(['name', 'userInfo']),
    currentUserLevel() {
      const userLevel = this.userInfo && this.userInfo.user_system ? this.userInfo.user_system.userLevel : null
      return userLevel
    },
    currentUserLocation() {
      let response = ''
      const userLevel = this.currentUserLevel
      if (userLevel === UserLevel.superAdmin) {
        response = this.userInfo && this.userInfo.user_system ? `Tài khoản hệ thống` : null
      }
      if (userLevel === UserLevel.admin) {
        response = this.userInfo && this.userInfo.user_system ? `Cục đường thủy nội địa` : null
      }
      if (userLevel === UserLevel.staff) {
        response = this.userInfo && this.userInfo.user_system ? this.userInfo.user_system.departmentName : null
      }
      if (userLevel === UserLevel.employee) {
        response = this.userInfo && this.userInfo.user_system ? this.userInfo.user_system.departmentName : null
      }
      return response
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80vh;
    justify-content: center;
  }
  &-image {
    margin-bottom: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    color: #084388;
    font-weight: bold;
    text-transform: uppercase;
  }
  &-user-login {
    font-size: 20px;
    color: #717180;
    line-height: 32px;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>

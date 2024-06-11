<template>
  <div class="lx-body">
    <div class="page-title">
      <h3>Báo cáo</h3>
    </div>
    <report-chart />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReportChart from './chart.vue'

export default {
  name: 'ReportApprovement',
  components: { ReportChart },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['token', 'userInfo']),
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
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>

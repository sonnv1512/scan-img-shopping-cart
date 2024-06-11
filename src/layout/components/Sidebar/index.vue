<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div class="sidebar-tip">
      <img v-if="!isCollapse" src="@/assets/logo-anvui.png" class="sidebar-logo">
      <!-- <p v-if="!isCollapse">Nền tảng được
        <span class="link-anvui" @click="gotoAnVuiWebsite">AN VUI</span>
        phát triển theo yêu cầu của Cục đường thủy nội địa Việt Nam
      </p> -->
      <span v-else class="link-anvui" @click="gotoAnVuiWebsite">AN VUI</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    gotoAnVuiWebsite() {
      window.open('https://www.anvui.vn/', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-tip {
  position: relative;
  width: 100%;
  height: 150px;
  background: transparent;
  text-align: left;
  overflow: hidden;
  font-size: 12px;
  color: #646D84;
  padding: 20px;
  display: grid;
  align-content: flex-end;
  grid-gap: 10px;
}
.link-anvui {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
</style>

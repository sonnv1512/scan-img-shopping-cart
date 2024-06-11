<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" src="@/assets/logodrvn-mini.png" class="sidebar-logo"> -->
        <!-- <h1 v-else class="sidebar-title">{{ title }} </h1> -->
        <img src="@/assets/logo.png" class="sidebar-logo">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img src="@/assets/logo.png" class="sidebar-logo-full"> -->
        <img src="@/assets/logo.png" class="sidebar-logo-full">
        <span class="title">CRM Luồng Xanh</span>
        <!-- <div class="sidebar-titlesvg">
          <drvn-name />
        </div> -->
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Luồng xanh',
      logo: '@/assets/logodrvn-mini.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #0d4835;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    & .sidebar-logo-full {
      width: 40px;
      height: auto;
      vertical-align: middle;
    }
    & .sidebar-titlesvg {
      display: inline-block;
      vertical-align: middle;
      height: 32px;
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.title {
  text-transform: uppercase;
  color: white;
  font-size: 12px;
  font-weight: bold;
}
</style>

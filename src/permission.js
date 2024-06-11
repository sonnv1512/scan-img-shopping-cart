import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getVersion, setVersion } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import axios from 'axios'
import StatusType from '@/class/StatusType'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // check version
  const isRunning = store.state.app.isRunning
  if(!isRunning) {
    await store.dispatch('app/activeProgram')
    setInterval(() => {
      const getVersionFromLocal = getVersion() || null
      const currentVersion = JSON.parse(JSON.stringify(getVersionFromLocal))
      axios({
        method: 'GET',
        url: StatusType.serverIp + 'system_info/',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then(function(res) {
          const newVersion = res.data.Data.find(x => x.ID === 1) ? res.data.Data.find(x => x.ID === 1).description : null
  
          const isNewVersion = currentVersion && newVersion && currentVersion !== newVersion
          // console.log('newVersion: ', newVersion, currentVersion, isNewVersion)
  
          setVersion(newVersion)
          if (isNewVersion) {
            console.log('Get new version, reload now!!!')
            location.reload()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    }, StatusType.reloadTimeOut)
  }
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

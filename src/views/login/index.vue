<template>
  <div class="login-section">
    <div class="body">
      <div class="login-container">
        <div class="logo-container">
          <login-drvn-logo />
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Tài khoản"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Mật khẩu"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <!-- <template v-if="captchaObj">
            <div class="captcha">
              <a-spin :spinning="loadingCaptcha">
                <img class="captcha-img" :src="captchaObj" alt="captcha">
              </a-spin>
              <i title="Lấy mã captcha mới" class="el-icon-refresh captcha-refresh" @click="callGetCaptcha" />
            </div>
            <el-form-item style="width:200px" prop="verifyValue">
              <el-input
                ref="captcha"
                v-model="loginForm.verifyValue"
                placeholder="Nhập mã xác thực"
                name="captcha"
                type="text"
                size="small"
                tabindex="3"
                auto-complete="off"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
          </template> -->

          <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">Đăng nhập</el-button>
        </el-form>
        <!-- <div class="tips-container">
          <span>Nền tảng được AN VUI phát triển theo yêu cầu của Cục đường thủy nội địa Việt Nam</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { validUsername } from '@/utils/validate'
import loginDrvnLogo from './loginlogo.vue'

export default {
  name: 'Login',
  components: { loginDrvnLogo },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Tên đăng nhập không hợp lệ'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('Mật khẩu phải dài ít nhất 6 ký tự'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('Mã xác thực không hợp lệ'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captchaId: null,
        verifyValue: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyValue: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      captchaObj: null,
      loadingCaptcha: false
    }
  },
  computed: {
    ...mapGetters(['serverIp'])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // this.callGetCaptcha()
  },
  methods: {
    callGetCaptcha() {
      const self = this
      this.loadingCaptcha = true
      const params = {
        'captchaType': 'math',
        // math(cong. tru`) //string(ca chu ca so) //audio(voice) //digit(so)
        'DriverAudio': {
          'Length': 6,
          'Language': 'en'
        },
        'DriverString': {
          'Height': 60,
          'Width': 240,
          'ShowLineOptions': 0,
          'NoiseCount': 0,
          'Source': '1234567890qwertyuioplkjhgfdsazxcvbnm',
          'Length': 6,
          'Fonts': [
            'wqy-microhei.ttc'
          ],
          'BgColor': {
            'R': 0,
            'G': 0,
            'B': 0,
            'A': 0
          }
        },
        'DriverMath': {
          'Height': 60,
          'Width': 240,
          'ShowLineOptions': 0,
          'NoiseCount': 0,
          'Length': 6,
          'Fonts': [
            'wqy-microhei.ttc'
          ],
          'BgColor': {
            'R': 0,
            'G': 0,
            'B': 0,
            'A': 0
          }
        },
        'DriverDigit': {
          'Height': 80,
          'Width': 240,
          'Length': 5,
          'MaxSkew': 0.7,
          'DotCount': 80
        }
      }
      axios({
        method: 'POST',
        url: self.serverIp + 'captcha/generate',
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          setTimeout(() => {
            self.captchaObj = res.data.data
            self.loginForm.captchaId = res.data.captchaId
            self.loadingCaptcha = false
          }, 1000)
        })
        .catch(function(err) {
          self.notify(null, `gọi captcha thất lại, lỗi: ${err}`, 'error')
          self.loadingCaptcha = false
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // if (!this.captchaObj) {
      //   this.callGetCaptcha()
      //   return
      // }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: '/' })
            // this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            // this.callGetCaptcha() // lấy lại mã captcha
            this.$notification['warning']({
              message: 'Đăng nhập thất bại',
              description: 'Thông tin đăng nhập không đúng'
            })
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          this.$notification['warning']({
            message: 'Đăng nhập thất bại',
            description: 'Thiếu thông tin đăng nhập'
          })
          return false
        }
      })
    },
    notify(object, content, type) {
      const self = this
      self.$notification[type]({
        message: object || 'Thông báo',
        description: content || ''
      })
    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #52555f;
      font-weight: 600;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
        border-radius: 5px;
        margin-left: 5px;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-section {
  min-height: 100%;
  .header {
    background: #0870F3;
    padding: 15px;
    display: flex;
    grid-gap: 15px;
    justify-content: center;
    img {
      height: 25px;
      width: auto;
    }
    .divide {
      border-right: 1px solid white;
    }
  }
  .body {
    min-height: 100vh;
    background:  white;
    // background: url('~@/assets/loginPage/login-background.png');
    // background-size: cover;
    // background-attachment: fixed;
    // background-position: 50%;
    // background-repeat: no-repeat;
  }
  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: transparent;
    overflow: hidden;
    display: grid;
    grid-gap: 8px;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    .logo-container {
      position: relative;
      width: 1000px;
      max-width: 100%;
      // padding: 100px 35px 0;
      // margin: 0 auto 30px;
      overflow: hidden;
      background: transparent;
      text-align: center;
    }
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding:35px;
      margin: 0 auto;
      overflow: hidden;
      background: white;
      // border-radius: 4px;
      // box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    }

    .tips-container {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #646D84;
      // margin-bottom: 10px;

      position: relative;
      width: 1000px;
      max-width: 100%;
      padding: 0 35px 0;
      // margin: 0 auto 30px;
      overflow: hidden;
      background: transparent;
      text-align: center;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      width: 1000px;
      max-width: 100%;
      // margin: 0 auto;
      overflow: hidden;
      background: transparent;

      .title {
        font-size: 20px;
        color: #084388;
        // margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
      }
      .caution {
        font-size: 26px;
        color: #923030;
        // margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .captcha {
      margin-bottom: 22px;
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-gap: 1rem;
      align-items: baseline;
      &-img {
        width: 240px;
      }
      &-refresh {
        font-size: 25px;
        color: #409EFF;
        cursor: pointer;
        outline: none;
      }
    }
  }
  .footer {
    background: #565B61;
    padding: 20px;
    display: flex;
    grid-gap: 2rem;
    justify-content: center;
    align-items: center;
    img {
      height: 50px;
      width: auto;
    }
    .divide {
      border-right: 1px solid #c9cbcd;
      align-self: stretch;
    }
    .power-by {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: #c9cbcd;
      display: grid;
      grid-gap: 4px;
    }
  }
}
</style>

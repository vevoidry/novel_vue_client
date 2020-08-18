<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-tabs v-model="activeName">
          <el-tab-pane label="登录" name="loginName">
            <el-form ref="form" :model="formDataOfLogin" label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="formDataOfLogin.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="formDataOfLogin.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="login">登录</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="registerName">
            <el-form ref="form" :model="formDataOfRegister" label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="formDataOfRegister.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="formDataOfRegister.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="register">注册</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { authenticatedRequest } from '@/network/authenticatedRequest'
import { anonymousRequest } from '@/network/anonymousRequest'
import store from '@/store'

export default {
  name: 'LoginRegister',
  data: function () {
    return {
      activeName: 'loginName',
      formDataOfLogin: {
        username: null,
        password: null
      },
      formDataOfRegister: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    login () {
      anonymousRequest({
        url: 'oauth/token',
        method: 'POST',
        headers: {
          Authorization: 'Basic dnVlOjEyMzQ1Ng=='// base64(vue:123456)
        },
        params: {
          username: this.$data.formDataOfLogin.username,
          password: this.$data.formDataOfLogin.password,
          grant_type: 'password',
          scope: 'vue_scope'
        }
      }).then(res => {
        store.state.tokenData = res.data
        authenticatedRequest({
          url: 'api/me',
          method: 'GET'
        }).then(res => {
          this.$store.state.user = res.data.data
          this.$router.push('/home/homeCenter')
          this.$message({
            showClose: true,
            message: '登录成功',
            type: 'success'
          })
        })
      })
    },
    register () {
      anonymousRequest({
        url: '/api/user',
        method: 'POST',
        params: {
          username: this.formDataOfRegister.username,
          password: this.formDataOfRegister.password
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
      })
    }
  }
}
</script>

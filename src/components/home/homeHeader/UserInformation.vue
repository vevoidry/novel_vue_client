<template>
  <div>
    <el-button v-if="$store.state.tokenData == null" @click="$router.push('/home/loginRegister')">登录/注册</el-button>
    <el-dropdown v-else>
      <span class="el-dropdown-link">
        <el-link :underline="false">{{$store.state.user.nickname}}</el-link>
      </span>
      <el-dropdown-menu slot="dropdown">
        <div @click="$router.push({path: '/home/user',query: {id: $store.state.user.id}})">
          <el-dropdown-item>主页</el-dropdown-item>
        </div>
        <div @click="logout">
          <el-dropdown-item>退出</el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'UserInformation',
  methods: {
    logout: function () {
      this.$store.state.tokenData = null
      this.$store.state.user = null
      this.$router.push('/home/homeCenter')
    }
  }
}
</script>

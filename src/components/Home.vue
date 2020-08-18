<template>
  <div>
    <el-backtop><i class="el-icon-top"></i></el-backtop>
    <div>
      <HomeHeader/>
    </div>
    <div>
      <router-view/>
    </div>
    <div>
      <HomeFooter/>
    </div>
  </div>
</template>

<script>
import HomeFooter from '@/components/home/HomeFooter'
import HomeHeader from '@/components/home/HomeHeader'

export default {
  name: 'Home',
  components: {
    HomeFooter,
    HomeHeader
  },
  mounted () {
    this.$router.push('/home/homeCenter')
  }
}
</script>

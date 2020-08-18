<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <Main/>
        <Advertisement/>
        <RankRoom/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Main from '@/components/home/homeCenter/Main'
import Advertisement from '@/components/home/homeCenter/Advertisement'
import RankRoom from '@/components/home/homeCenter/RankRoom'
export default {
  name: 'HomeCenter',
  components: {
    Main,
    Advertisement,
    RankRoom
  }
}
</script>

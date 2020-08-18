<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <RankWithoutImage rankTitle="总排行榜" :rankArray="rankArrayOfAll"></RankWithoutImage>
      </el-col>
      <el-col :span="12">
        <template>
          <el-carousel :interval="4000" type="card" height="600px">
            <el-carousel-item v-for="(item,i) in rankArrayOfAll" :key="i">
              <h3 style="text-align: center">{{item.name}}</h3>
              <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill" @click="$router.push({path: '/home/novel',query: {id: item.id}})"></el-image>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-col>
      <el-col :span="6">
        <RankWithoutImage rankTitle="总排行榜" :rankArray="rankArrayOfAll"></RankWithoutImage>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RankWithoutImage from '@/components/common/RankWithoutImage'
import { anonymousRequest } from '@/network/anonymousRequest'
export default {
  name: 'Main',
  components: {
    RankWithoutImage
  },
  data: function () {
    return {
      rankArrayOfAll: null
    }
  },
  methods: {
    getRankOfAll: function () {
      anonymousRequest({
        url: 'api/novel/rank',
        method: 'GET',
        params: {
          day_count: 365 * 100,
          limit_count: 10
        }
      }).then(res => {
        this.rankArrayOfAll = res.data.data
      })
    }
  },
  mounted () {
    this.getRankOfAll()
  }
}
</script>

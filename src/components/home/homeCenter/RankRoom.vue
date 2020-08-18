<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <RankWithoutImage rankTitle="日排行榜" :rankArray="rankArrayOfDay" :hasSummary="true" :hasDivider="true"></RankWithoutImage>
      </el-col>
      <el-col :span="6">
        <RankWithoutImage rankTitle="周排行榜" :rankArray="rankArrayOfWeek" :hasSummary="true" :hasDivider="true"></RankWithoutImage>
      </el-col>
      <el-col :span="6">
        <RankWithImage rankTitle="月排行榜" :rankArray="rankArrayOfMonth"></RankWithImage>
      </el-col>
      <el-col :span="6">
        <RankWithImage rankTitle="年排行榜" :rankArray="rankArrayOfYear"></RankWithImage>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RankWithoutImage from '@/components/common/RankWithoutImage'
import RankWithImage from '@/components/common/RankWithImage'
import { anonymousRequest } from '@/network/anonymousRequest'
export default {
  name: 'RankRoom',
  components: {
    RankWithoutImage,
    RankWithImage
  },
  data: function () {
    return {
      rankArrayOfDay: null,
      rankArrayOfWeek: null,
      rankArrayOfMonth: null,
      rankArrayOfYear: null
    }
  },
  methods: {
    getRankArrayOfDay: function () {
      anonymousRequest({
        url: 'api/novel/rank',
        method: 'GET',
        params: {
          day_count: 1,
          limit_count: 10
        }
      }).then(res => {
        this.rankArrayOfDay = res.data.data
      })
    },
    getRankArrayOfWeek: function () {
      anonymousRequest({
        url: 'api/novel/rank',
        method: 'GET',
        params: {
          day_count: 7,
          limit_count: 10
        }
      }).then(res => {
        this.rankArrayOfWeek = res.data.data
      })
    },
    getRankArrayOfMonth: function () {
      anonymousRequest({
        url: 'api/novel/rank',
        method: 'GET',
        params: {
          day_count: 30,
          limit_count: 10
        }
      }).then(res => {
        this.rankArrayOfMonth = res.data.data
      })
    },
    getRankArrayOfYear: function () {
      anonymousRequest({
        url: 'api/novel/rank',
        method: 'GET',
        params: {
          day_count: 365,
          limit_count: 10
        }
      }).then(res => {
        this.rankArrayOfYear = res.data.data
      })
    }
  },
  mounted () {
    this.getRankArrayOfDay()
    this.getRankArrayOfWeek()
    this.getRankArrayOfMonth()
    this.getRankArrayOfYear()
  }
}
</script>

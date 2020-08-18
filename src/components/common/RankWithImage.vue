<template>
  <div>
    <el-card class="box-card">
      <h2 style="text-align: center">{{rankTitle}}</h2>
      <div v-for="(item,i) in rankArray" :key="i">
        <el-row>
          <el-col :span="18">
            <el-link :underline="false">
              <h3 @click="$router.push({path: '/home/novel',query: {id: item.id}})"><el-tag>{{i+1}}</el-tag>{{getSimpleTitle(item.name)}}</h3>
            </el-link>
            <h5>{{getSimpleSummary(item.summary)}}</h5>
          </el-col>
          <el-col :span="6">
            <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RankWithImage',
  props: {
    rankTitle: null,
    rankArray: null
  },
  methods: {
    getSimpleTitle: function (title) {
      if (title.length > 15) {
        return title.substring(0, 14) + '...'
      } else {
        return title
      }
    },
    getSimpleSummary: function (summary) {
      if (summary.length > 25) {
        return summary.substring(0, 24) + '......'
      } else {
        return summary
      }
    }
  }
}
</script>

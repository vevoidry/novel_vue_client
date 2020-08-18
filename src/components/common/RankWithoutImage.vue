<template>
  <div>
    <el-card class="box-card">
      <h2 style="text-align: center">{{rankTitle}}</h2>
      <div v-for="(item,i) in rankArray" :key="i">
        <el-link :underline="false">
          <h3 @click="$router.push({path: '/home/novel',query: {id: item.id}})"><el-tag>{{i+1}}</el-tag>{{getSimpleTitle(item.name)}}</h3>
        </el-link>
        <h5 v-if="hasSummary == true">{{getSimpleSummary(item.summary)}}</h5>
        <el-divider v-if="hasDivider == true"></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RankWithoutImage',
  props: {
    rankTitle: null,
    rankArray: null,
    hasSummary: null,
    hasDivider: null
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

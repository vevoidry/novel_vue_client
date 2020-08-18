<template>
  <div>
    <div>
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item,i) in novelList" :key="i">
          <el-card>
            <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
            <div>
              <h3 @click="$router.push({path: '/home/novel',query: {id: item.id}})">{{item.name}}</h3>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { anonymousRequest } from '@/network/anonymousRequest'
export default {
  name: 'NovelDisplay',
  data: function () {
    return {
      categoryId: this.$route.query.categoryId,
      searchData: this.$route.query.searchData,
      novelList: null
    }
  },
  methods: {
    getNovelList: function () {
      anonymousRequest({
        url: 'api/novel',
        method: 'GET',
        params: {
          category_id: this.categoryId,
          searchName: this.searchData
        }
      }).then(res => {
        this.novelList = res.data.data
      })
    }
  },
  mounted () {
    this.getNovelList()
  },
  watch: {
    $route: function () {
      this.categoryId = this.$route.query.categoryId
      this.searchData = this.$route.query.searchData
      this.getNovelList()
    }
  }
}
</script>

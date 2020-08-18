<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button @click="$router.push('/home/homeCenter')">非常小说网</el-button>
      </el-col>
      <el-col :span="10">
        <el-dropdown v-for="(item,i) in categoryList" :key="i">
          <span class="el-dropdown-link" @mouseover="getChildCategory(item.id)">
            <span style="font-size: 1.2em">{{item.name}}</span>
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item2,i2) in childCategoryList" :key="i2" >
              <div @click="getNovelList(item2.id)">{{item2.name}}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="请输入小说名称" v-model="searchData">
          <el-button slot="append" icon="el-icon-search" @click="searchNovelList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <UserInformation/>
      </el-col>
    </el-row>
    <el-divider></el-divider>
  </div>
</template>

<script>
import UserInformation from '@/components/home/homeHeader/UserInformation'
import { anonymousRequest } from '@/network/anonymousRequest'
export default {
  name: 'HomeHeader',
  data: function () {
    return {
      searchData: null,
      categoryList: null,
      childCategoryList: null
    }
  },
  components: {
    UserInformation
  },
  methods: {
    getCategoryList: function () {
      anonymousRequest({
        url: 'api/category',
        method: 'GET',
        params: {
          rank: 1
        }
      }).then(res => {
        this.categoryList = res.data.data
      })
    },
    getChildCategory: function (id) {
      anonymousRequest({
        url: 'api/category',
        method: 'GET',
        params: {
          parent_id: id
        }
      }).then(res => {
        this.childCategoryList = res.data.data
      })
    },
    getNovelList: function (id) {
      this.$router.push(
        {
          path: '/home/novelDisplay',
          query: {
            categoryId: id
          }
        }
      )
    },
    searchNovelList: function () {
      this.$router.push({ path: '/home/novelDisplay', query: { searchData: this.searchData } })
    }
  },
  mounted () {
    this.getCategoryList()
  }
}
</script>

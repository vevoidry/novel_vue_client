<template>
  <div>
    <el-row>
      <el-col :span="16" :offset="4">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/home/homeCenter' }">主页</el-breadcrumb-item>
          <el-breadcrumb-item>{{categoryParent.name}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/home/novelDisplay', query: {categoryId: category.id} }">{{category.name}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/home/novel', query: {id: novel.id} }">{{novel.name}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{volume.name}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{chapter.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <h2 style="text-align: center">{{chapter.title}}</h2>
        <el-row>
          <el-col :span="6" offset="6">
            <el-button style="width: 100%;" @click="lastChapter">上一章</el-button>
          </el-col>
          <el-col :span="6">
            <el-button style="width: 100%;" @click="nextChapter">下一章</el-button>
          </el-col>
        </el-row>
        <el-input type="textarea" v-model="chapterContent" readonly autosize></el-input>
        <el-row>
          <el-col :span="6" offset="6">
            <el-button style="width: 100%;" @click="lastChapter">上一章</el-button>
          </el-col>
          <el-col :span="6">
            <el-button style="width: 100%;" @click="nextChapter">下一章</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { anonymousRequest } from '@/network/anonymousRequest'
export default {
  name: 'Chapter',
  data: function () {
    return {
      id: this.$route.query.id,
      chapter: null,
      chapterContent: null,
      volume: null,
      novel: null,
      category: null,
      categoryParent: null,
      user: null
    }
  },
  methods: {
    getChapter: function () {
      anonymousRequest({
        url: 'api/chapter/' + this.id,
        method: 'GET'
      }).then(res => {
        this.chapter = res.data.data
        this.getChapterContent()
        this.getVolume()
      })
    },
    getChapterContent: function () {
      anonymousRequest({
        url: 'api/chapter/content',
        method: 'GET',
        params: {
          content: this.chapter.content
        }
      }).then(res => {
        this.chapterContent = res.data.data
      })
    },
    getVolume: function () {
      anonymousRequest({
        url: 'api/volume/' + this.chapter.volume_id,
        method: 'GET'
      }).then(res => {
        this.volume = res.data.data
        this.getNovel()
      })
    },
    getNovel: function () {
      anonymousRequest({
        url: 'api/novel/' + this.volume.novel_id,
        method: 'GET'
      }).then(res => {
        this.novel = res.data.data
        this.getUser()
        this.getCategory()
      })
    },
    getUser: function () {
      anonymousRequest({
        url: 'api/user/' + this.novel.user_id,
        method: 'GET'
      }).then(res => {
        this.user = res.data.data
      })
    },
    getCategory: function () {
      anonymousRequest({
        url: 'api/category/' + this.novel.category_id,
        method: 'GET'
      }).then(res => {
        this.category = res.data.data
        this.getCategoryParent()
      })
    },
    getCategoryParent: function () {
      anonymousRequest({
        url: 'api/category/' + this.category.parent_id,
        method: 'GET'
      }).then(res => {
        this.categoryParent = res.data.data
      })
    },
    lastChapter: function () {
      anonymousRequest({
        url: 'api/chapter/' + this.id + '/last',
        method: 'GET'
      }).then(res => {
        if (res.data.data == null) {
          this.$message({
            showClose: true,
            message: '没有上一章了',
            type: 'error'
          })
        } else {
          this.$router.push({ path: '/home/chapter', query: { id: res.data.data.id } })
        }
      })
    },
    nextChapter: function () {
      anonymousRequest({
        url: 'api/chapter/' + this.id + '/next',
        method: 'GET'
      }).then(res => {
        if (res.data.data == null) {
          this.$message({
            showClose: true,
            message: '没有下一章了',
            type: 'error'
          })
        } else {
          this.$router.push({ path: '/home/chapter', query: { id: res.data.data.id } })
        }
      })
    }
  },
  mounted () {
    this.getChapter()
  },
  watch: {
    $route: function () {
      this.id = this.$route.query.id
      this.getChapter()
    }
  }
}
</script>

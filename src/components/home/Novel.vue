<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-image :src="'http://localhost:9090/images/'+novel.image" fit="fill" :preview-src-list="['http://localhost:9090/images/'+novel.image]"></el-image>
          </el-col>
          <el-col :span="12">
            <h2>{{novel.name}}</h2>
            <el-link :underline="false">
              <h4 @click="goToUser">作者：{{user.nickname}}</h4>
            </el-link>
            <h4>类型：<el-link :underline="false" disabled><span>{{categoryParent.name}}-</span></el-link><el-link :underline="false"><span @click="$router.push({path: '/home/novelDisplay', query: {categoryId: category.id}})">{{category.name}}</span></el-link></h4>
            <div>{{recommendCount}}人推荐</div>
            <div>{{collectionCount}}人收藏</div>
            <el-button v-if="!hasCollected" @click="postCollection">收藏</el-button>
            <el-button v-else @click="deleteCollection">取消收藏</el-button>
            <el-button v-if="!hasRecommended" @click="postRecommend">推荐</el-button>
            <el-button v-else @click="deleteRecommend">取消推荐</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="16" :offset="4">
        <el-tabs v-model="activeName">
          <el-tab-pane label="概述" name="summary">{{novel.summary}}</el-tab-pane>
          <el-tab-pane label="卷和章节" name="volumeAndChapter">
            <el-row>
              <el-col :span="6">
                <el-card class="box-card">
                  <div v-for="(item,i) in volumeList" :key="i" @click="getChapterList(item.id)">
                    <el-divider content-position="left">第{{i+1}}卷</el-divider>
                    <el-link :underline="false">
                      <h3>{{item.name}}</h3>
                    </el-link>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="18">
                <el-card class="box-card">
                  <div v-for="(item,i) in chapterList" :key="i" @click="$router.push({ path: '/home/chapter', query: { id: item.id } })">
                    <el-divider content-position="left">第{{i+1}}章</el-divider>
                    <el-link :underline="false">
                      <h4>{{item.title}}</h4>
                    </el-link>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comment">
            <el-button @click="dialogVisible = true;">评论</el-button>
            <div>共{{commentCount}}条评论</div>
            <el-card class="box-card">
              <div v-for="(item,i) in commentList" :key="i">
                <el-divider></el-divider>
                {{item.content}}
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="60%">
      <el-input type="textarea" v-model="commentContent" placeholder="评论内容" autosize></el-input>
      <el-button @click="postComment">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { authenticatedRequest } from '@/network/authenticatedRequest'
import { anonymousRequest } from '@/network/anonymousRequest'
export default {
  name: 'Novel',
  data: function () {
    return {
      id: this.$route.query.id,
      novel: null,
      category: null,
      categoryParent: null,
      user: null,
      volumeList: null,
      chapterList: null,
      hasCollected: false,
      hasRecommended: false,
      commentContent: null,
      dialogVisible: false,
      commentList: null,
      collectionCount: null,
      recommendCount: null,
      commentCount: null,
      activeName: 'summary'
    }
  },
  methods: {
    getNovel: function () {
      anonymousRequest({
        url: 'api/novel/' + this.id,
        method: 'GET'
      }).then(res => {
        this.novel = res.data.data
        this.getUser()
        this.getCategory()
        this.getVolumeList()
        this.getCollection()
        this.getRecommend()
        this.getCommentList()
        this.getCollectionCount()
        this.getRecommendCount()
        this.getCommentCount()
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
    getVolumeList: function () {
      anonymousRequest({
        url: 'api/volume',
        method: 'GET',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.volumeList = res.data.data
      })
    },
    getChapterList: function (id) {
      anonymousRequest({
        url: 'api/chapter',
        method: 'GET',
        params: {
          volume_id: id
        }
      }).then(res => {
        this.chapterList = res.data.data
      })
    },
    getCollection: function () {
      if (this.$store.state.tokenData != null) {
        authenticatedRequest({
          url: '/api/collection',
          method: 'GET',
          params: {
            novel_id: this.id,
            user_id: this.$store.state.user.id
          }
        }).then(res => {
          if (res.data.data == null) {
            this.hasCollected = false
          } else {
            this.hasCollected = true
          }
        })
      }
    },
    getRecommend: function () {
      if (this.$store.state.tokenData != null) {
        authenticatedRequest({
          url: '/api/recommend',
          method: 'GET',
          params: {
            novel_id: this.id,
            user_id: this.$store.state.user.id
          }
        }).then(res => {
          if (res.data.data == null) {
            this.hasRecommended = false
          } else {
            this.hasRecommended = true
          }
        })
      }
    },
    postCollection: function () {
      authenticatedRequest({
        url: '/api/collection',
        method: 'POST',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getCollection()
        this.getCollectionCount()
      })
    },
    postRecommend: function () {
      authenticatedRequest({
        url: '/api/recommend',
        method: 'POST',
        data: {
          novel_id: this.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getRecommend()
        this.getRecommendCount()
      })
    },
    deleteCollection: function () {
      authenticatedRequest({
        url: '/api/collection',
        method: 'DELETE',
        params: {
          novel_id: this.id,
          user_id: this.$store.state.user.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getCollection()
        this.getCollectionCount()
      })
    },
    deleteRecommend: function () {
      authenticatedRequest({
        url: '/api/recommend',
        method: 'DELETE',
        params: {
          novel_id: this.id,
          user_id: this.$store.state.user.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getRecommend()
        this.getRecommendCount()
      })
    },
    getCollectionCount: function () {
      anonymousRequest({
        url: '/api/collection/count',
        method: 'GET',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.collectionCount = res.data.data
      })
    },
    getRecommendCount: function () {
      anonymousRequest({
        url: '/api/recommend/count',
        method: 'GET',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.recommendCount = res.data.data
      })
    },
    getCommentCount: function () {
      anonymousRequest({
        url: '/api/comment/count',
        method: 'GET',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.commentCount = res.data.data
      })
    },
    postComment: function () {
      this.dialogVisible = false
      authenticatedRequest({
        url: '/api/comment',
        method: 'POST',
        data: {
          novel_id: this.id,
          content: this.commentContent
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getCommentList()
        this.getCommentCount()
      })
    },
    getCommentList: function () {
      anonymousRequest({
        url: '/api/comment',
        method: 'GET',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.commentList = res.data.data
      })
    },
    goToUser: function () {
      this.$router.push({
        path: '/home/user',
        query: {
          id: this.user.id
        }
      })
    }
  },
  mounted () {
    this.getNovel()
  }
}
</script>

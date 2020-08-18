<template>
  <div>
    <el-row>
      <el-col :span="6" :offset="4">
        <el-image :src="'http://localhost:9090/images/'+user.image" fit="fill"></el-image>
      </el-col>
      <el-col :span="8" :offset="2">
        <h2>昵称：{{user.nickname}}</h2>
        <h4>简介：{{user.profile}}</h4>
        <h4>手机：{{user.phone}}</h4>
        <h4>邮箱：{{user.email}}</h4>
        <el-button v-if="($store.state.user == null || $store.state.user.id != id) && hasFollow === false" @click="postFollow">关注</el-button>
        <el-button v-if="($store.state.user == null || $store.state.user.id != id) && hasFollow === true" @click="deleteFollow">取消关注</el-button>
        <el-button v-if="$store.state.user == null || $store.state.user.id != id">私信（待定）</el-button>
        <el-button v-if="$store.state.user != null && $store.state.user.id == id" @click="dialogVisible = true;userForm.nickname = $store.state.user.nickname;userForm.profile = $store.state.user.profile;userForm.phone = $store.state.user.phone;userForm.email = $store.state.user.email;">编辑</el-button>
        <el-button v-if="$store.state.user != null && $store.state.user.id == id" @click="$router.push('/home/novelManagement')">作品管理</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="'作品' + novelList.length" name="work">
            <el-card class="box-card">
              <el-row :gutter="20" v-for="(item,i) in  novelList" :key="i">
                <el-col :span="3">
                  <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
                </el-col>
                <el-col :span="21">
                  <el-tooltip :content="getNovelData(item.id)" placement="top" effect="light">
                    <div>
                      <el-link :underline="false"><h3 @click="$router.push({path: '/home/novel',query: {id: item.id}})">{{item.name}}</h3></el-link>
                      <h5>{{item.summary}}</h5>
                    </div>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="'收藏' + +collectionNovelList.length" name="collection">
            <el-card class="box-card">
              <el-row :gutter="20" v-for="(item,i) in  collectionNovelList" :key="i">
                <el-col :span="3">
                  <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
                </el-col>
                <el-col :span="21">
                  <el-tooltip :content="getNovelData(item.id)" placement="top" effect="light">
                    <div>
                      <el-link :underline="false"><h3 @click="$router.push({path: '/home/novel',query: {id: item.id}})">{{item.name}}</h3></el-link>
                      <h5>{{item.summary}}</h5>
                    </div>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="'推荐' + recommendNovelList.length" name="recommend">
            <el-card class="box-card">
              <el-row :gutter="20" v-for="(item,i) in  recommendNovelList" :key="i">
                <el-col :span="3">
                  <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
                </el-col>
                <el-col :span="21">
                  <el-tooltip :content="getNovelData(item.id)" placement="top" effect="light">
                    <div>
                      <el-link :underline="false"><h3 @click="$router.push({path: '/home/novel',query: {id: item.id}})">{{item.name}}</h3></el-link>
                      <h5>{{item.summary}}</h5>
                    </div>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="'评论' + commentList.length" name="comment">
            <div v-for="(item,i) in commentList" :key="i">
              <div>{{item.content}}</div>
              <el-divider></el-divider>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'关注' + followingUserList.length" name="idol">
            <el-card class="box-card">
              <el-row :gutter="20" v-for="(item,i) in followingUserList" :key="i">
                <el-col :span="2">
                  <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
                </el-col>
                <el-col :span="22">
                  <el-link :underline="false">
                    <div @click="$router.push({path: '/home/user',query: {id: item.id}})">{{item.nickname}}</div>
                  </el-link>
                </el-col>
                <el-divider></el-divider>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="'粉丝' + followerUserList.length" name="fan">
            <el-card class="box-card">
              <el-row :gutter="20" v-for="(item,i) in followerUserList" :key="i">
                <el-col :span="2">
                  <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill"></el-image>
                </el-col>
                <el-col :span="22">
                  <el-link :underline="false">
                    <div @click="$router.push({path: '/home/user',query: {id: item.id}})">{{item.nickname}}</div>
                  </el-link>
                </el-col>
                <el-divider></el-divider>
              </el-row>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="60%">
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userForm.profile"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="updateUser">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { authenticatedRequest } from '@/network/authenticatedRequest'
import { anonymousRequest } from '@/network/anonymousRequest'

export default {
  name: 'User',
  data: function () {
    return {
      id: this.$route.query.id,
      user: null,
      novelList: null,
      activeName: 'work',
      dialogVisible: false,
      userForm: {
        nickname: null,
        profile: null,
        phone: null,
        email: null
      },
      hasFollow: true,
      followerUserList: null,
      followingUserList: null,
      collectionNovelList: null,
      recommendNovelList: null,
      commentList: null
    }
  },
  methods: {
    getUser: function () {
      anonymousRequest({
        url: 'api/user/' + this.id,
        method: 'GET'
      }).then(res => {
        this.user = res.data.data
        this.getNovelList()
      })
    },
    getNovelList: function () {
      anonymousRequest({
        url: 'api/novel',
        method: 'GET',
        params: {
          user_id: this.id
        }
      }).then(res => {
        this.novelList = res.data.data
      })
    },
    getNovelData: function (i) {
      return '该小说的统计数据'
    },
    updateUser: function () {
      this.dialogVisible = false
      authenticatedRequest({
        url: 'api/user',
        method: 'PUT',
        params: {
          nickname: this.userForm.nickname,
          profile: this.userForm.profile,
          phone: this.userForm.phone,
          email: this.userForm.email
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.$store.state.user = res.data.data
        this.getUser()
      })
    },
    getFollow: function () {
      if (this.$store.state.tokenData != null) {
        authenticatedRequest({
          url: 'api/follow',
          method: 'GET',
          params: {
            follower_id: this.$store.state.user.id,
            following_id: this.id
          }
        }).then(res => {
          if (res.data.data != null) {
            this.hasFollow = true
          } else {
            this.hasFollow = false
          }
        })
      } else {
        this.hasFollow = false
      }
    },
    postFollow: function () {
      authenticatedRequest({
        url: 'api/follow',
        method: 'POST',
        data: {
          following_id: this.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getFollow()
        this.getFollowerUser()
      })
    },
    deleteFollow: function () {
      authenticatedRequest({
        url: 'api/follow',
        method: 'DELETE',
        params: {
          following_id: this.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getFollow()
        this.getFollowerUser()
      })
    },
    getFollowerUser: function () {
      anonymousRequest({
        url: 'api/follow',
        method: 'GET',
        params: {
          following_id: this.id
        }
      }).then(res => {
        this.followerUserList = res.data.data
      })
    },
    getFollowingUser: function () {
      anonymousRequest({
        url: 'api/follow',
        method: 'GET',
        params: {
          follower_id: this.id
        }
      }).then(res => {
        this.followingUserList = res.data.data
      })
    },
    getCollectionNovelList: function () {
      anonymousRequest({
        url: 'api/collection/novel',
        method: 'GET',
        params: {
          user_id: this.id
        }
      }).then(res => {
        this.collectionNovelList = res.data.data
      })
    },
    getRecommendNovelList: function () {
      anonymousRequest({
        url: 'api/recommend/novel',
        method: 'GET',
        params: {
          user_id: this.id
        }
      }).then(res => {
        this.recommendNovelList = res.data.data
      })
    },
    getCommentList: function () {
      anonymousRequest({
        url: 'api/comment',
        method: 'GET',
        params: {
          user_id: this.id
        }
      }).then(res => {
        this.commentList = res.data.data
      })
    }
  },
  mounted () {
    this.getUser()
    this.getFollow()
    this.getFollowerUser()
    this.getFollowingUser()
    this.getCollectionNovelList()
    this.getRecommendNovelList()
    this.getCommentList()
  },
  watch: {
    $route: function () {
      this.id = this.$route.query.id
      this.getUser()
      this.getFollow()
      this.getFollowerUser()
      this.getFollowingUser()
      this.getCollectionNovelList()
      this.getRecommendNovelList()
      this.getCommentList()
    }
  }
}
</script>

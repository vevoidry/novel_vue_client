<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" :offset="2">
        <el-divider>小说列表</el-divider>
        <div style="text-align: center">
          <el-button @click="dialogVisibleOfInsertNovel = true">新增小说</el-button>
        </div>
        <el-card class="box-card">
          <div v-for="(item,i) in novelList" :key="i">
            <el-link :underline="false" @click="selectedVolume = null; chapterList = null;getSelectNovel(item.id)">{{item.name}}</el-link>
            <el-divider></el-divider>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-divider>小说详情</el-divider>
        <el-row v-if="selectedNovel != null">
          <el-col :span="12">
            <el-row>
              <el-col :span="16">
                <el-image :src="'http://localhost:9090/images/'+selectedNovel.image" fit="fill"></el-image>
              </el-col>
              <el-col :span="8"><el-button @click="dialogVisibleOfImage = true">修改</el-button></el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="16">小说名称：{{selectedNovel.name}}</el-col>
              <el-col :span="8"><el-button @click="dialogVisibleOfName = true;dialogDataOfName = selectedNovel.name">修改</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="16">小说概述：{{selectedNovel.summary}}</el-col>
              <el-col :span="8"><el-button @click="dialogVisibleOfSummary = true;dialogDataOfSummary = selectedNovel.summary">修改</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="16">小说分类：{{categoryParent.name}}-{{category.name}}</el-col>
              <el-col :span="8"><el-button @click="dialogVisibleOfCategory_id = true">修改</el-button></el-col>
            </el-row>
<!--            <el-row>-->
<!--              <el-col :span="16">推荐系数：{{selectedNovel.multiplier}}</el-col>-->
<!--              <el-col :span="8"><el-button @click="dialogVisibleOfMultiplier = true;dialogDataOfMultiplier = selectedNovel.multiplier">修改</el-button></el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="16">推荐常数：{{selectedNovel.addend}}</el-col>-->
<!--              <el-col :span="8"><el-button @click="dialogVisibleOfAddend = true;dialogDataOfAddend = selectedNovel.addend">修改</el-button></el-col>-->
<!--            </el-row>-->
          </el-col>
        </el-row>
        <el-divider>卷和章节</el-divider>
        <el-row v-if="volumeList != null" :gutter="10">
          <el-col :span="12">
            <div style="text-align: center">
              <el-button @click="dialogVisibleOfInsertVolume = true">新增卷</el-button>
            </div>
            <el-card class="box-card">
              <div v-for="(item,i) in volumeList" :key="i">
                <el-divider>第{{i+1}}卷</el-divider>
                <el-link :underline="false" @click="selectedVolume = item;getChapterList(item.id)">{{item.name}}</el-link>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" v-if="chapterList != null">
            <div>
              <el-button @click="dialogVisibleOfPatchVolumeName = true;dialogDataOfNameOfVolume = selectedVolume.name">修改卷名</el-button>
              <el-button @click="dialogVisibleOfPatchVolumeSummary = true;dialogDataOfSummaryOfVolume = selectedVolume.summary">修改概述</el-button>
            </div>
            <div>{{selectedVolume.summary}}</div>
            <div style="text-align: center">
              <el-button @click="dialogVisibleOfInsertChapter = true">新增章节</el-button>
            </div>
            <el-card class="box-card">
              <div v-for="(item,i) in chapterList" :key="i">
                <el-divider>第{{i+1}}章</el-divider>
                <el-link :underline="false" @click="$router.push({ path: '/home/chapter', query: { id: item.id } })">{{item.title}}</el-link>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="请输入新的novel" :visible.sync="dialogVisibleOfInsertNovel" width="80%">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form ref="form" :model="formData" label-width="100px">
            <el-form-item label="小说名称">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="小说类型">
              <el-cascader v-model="formData.category_ids" :props="props"></el-cascader>
            </el-form-item>
            <el-form-item label="是否已完结">
              <el-switch v-model="formData.is_complete"></el-switch>
            </el-form-item>
            <el-form-item label="小说概述">
              <el-input type="textarea" v-model="formData.summary"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="postNovel">新增小说</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="请输入新的volume" :visible.sync="dialogVisibleOfInsertVolume" width="60%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="卷名">
          <el-input v-model="newVolumeName" placeholder="卷名"></el-input>
        </el-form-item>
        <el-form-item label="概述">
          <el-input type="textarea" v-model="newVolumeSummary" placeholder="概述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="postVolume">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的chapter" :visible.sync="dialogVisibleOfInsertChapter" width="60%">
      <el-form>
        <el-form-item>
          <el-input v-model="newChapterTitle" placeholder="章节的标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="newChapterContent" placeholder="章节的内容" :autosize="{ minRows: 15 }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="postChapter">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的image" :visible.sync="dialogVisibleOfImage" width="21%">
      <el-upload class="upload-demo" action="http://localhost:9090/api/novel/image" :headers="{authorization: 'bearer '+$store.state.tokenData.access_token}" :limit="1" :file-list="dialogDataOfImageList" :on-success="postImageSuccess" :on-error="postImageError">
        <el-button>点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png文件</div>
      </el-upload>
    </el-dialog>
    <el-dialog title="请输入新的name" :visible.sync="dialogVisibleOfName" width="40%">
      <el-input v-model="dialogDataOfName"></el-input>
      <el-button @click="patchName">确定</el-button>
    </el-dialog>
    <el-dialog title="请输入新的summary" :visible.sync="dialogVisibleOfSummary" width="40%">
      <el-input type="textarea" autosize v-model="dialogDataOfSummary"></el-input>
      <el-button @click="patchSummary">确定</el-button>
    </el-dialog>
    <el-dialog title="请输入新的volume的name" :visible.sync="dialogVisibleOfPatchVolumeName" width="60%">
      <el-input autosize v-model="dialogDataOfNameOfVolume"></el-input>
      <el-button @click="patchVolumeName">确定</el-button>
    </el-dialog>
    <el-dialog title="请输入新的volume的summary" :visible.sync="dialogVisibleOfPatchVolumeSummary" width="60%">
      <el-input type="textarea" autosize v-model="dialogDataOfSummaryOfVolume"></el-input>
      <el-button @click="patchVolumeSummary">确定</el-button>
    </el-dialog>
    <el-dialog title="请输入新的category_id" :visible.sync="dialogVisibleOfCategory_id" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-cascader v-model="dialogDataOfCategory_ids" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchCategory_id">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
<!--    <el-dialog title="请输入新的multiplier" :visible.sync="dialogVisibleOfMultiplier" width="40%">-->
<!--      <el-input type="number" v-model="dialogDataOfMultiplier"></el-input>-->
<!--      <el-button @click="patchMultiplier">确定</el-button>-->
<!--    </el-dialog>-->
<!--    <el-dialog title="请输入新的addend" :visible.sync="dialogVisibleOfAddend" width="40%">-->
<!--      <el-input type="number" v-model="dialogDataOfAddend"></el-input>-->
<!--      <el-button @click="patchAddend">确定</el-button>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import { authenticatedRequest } from '@/network/authenticatedRequest'
import { anonymousRequest } from '@/network/anonymousRequest'

export default {
  name: 'NovelManagement',
  data: function () {
    return {
      novelList: null,
      selectedNovel: null,
      selectedVolume: null,
      category: null,
      categoryParent: null,
      volumeList: null,
      chapterList: null,
      dialogVisibleOfInsertNovel: false,
      dialogVisibleOfInsertVolume: false,
      dialogVisibleOfInsertChapter: false,
      dialogVisibleOfPatchVolumeName: false,
      dialogVisibleOfPatchVolumeSummary: false,
      dialogDataOfNameOfVolume: null,
      dialogDataOfSummaryOfVolume: null,
      newVolumeName: null,
      newVolumeSummary: null,
      newChapterTitle: null,
      newChapterContent: null,
      formData: {
        name: null,
        category_ids: null,
        is_complete: false,
        summary: null
      },
      dialogVisibleOfImage: false,
      dialogVisibleOfName: false,
      dialogDataOfName: null,
      dialogVisibleOfSummary: false,
      dialogDataOfSummary: null,
      dialogVisibleOfCategory_id: false,
      dialogDataOfCategory_ids: null,
      // dialogVisibleOfMultiplier: false,
      // dialogDataOfMultiplier: null,
      // dialogVisibleOfAddend: false,
      // dialogDataOfAddend: null,
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          let rank = 1
          let parentId = 0
          if (node.level !== 0) {
            rank = 2
            parentId = node.value
          }
          anonymousRequest({
            url: '/api/category',
            method: 'GET',
            params: {
              rank: rank,
              parent_id: parentId
            }
          }).then(res => {
            const nodes = res.data.data.map(item => ({
              value: item.id,
              label: item.name,
              leaf: item.rank === 2
            }))
            resolve(nodes)
          })
        }
      }
    }
  },
  methods: {
    getNovelList: function () {
      authenticatedRequest({
        url: '/api/novel',
        method: 'GET',
        params: {
          user_id: this.$store.state.user.id
        }
      }).then(res => {
        this.novelList = res.data.data
      })
    },
    getSelectNovel: function (id) {
      anonymousRequest({
        url: '/api/novel/' + id,
        method: 'GET'
      }).then(res => {
        this.selectedNovel = res.data.data
        this.getCategory()
        this.getVolumeList()
      })
    },
    getCategory: function () {
      anonymousRequest({
        url: '/api/category/' + this.selectedNovel.category_id,
        method: 'GET'
      }).then(res => {
        this.category = res.data.data
        this.getCategoryParent()
      })
    },
    getCategoryParent: function () {
      anonymousRequest({
        url: '/api/category/' + this.category.parent_id,
        method: 'GET'
      }).then(res => {
        this.categoryParent = res.data.data
      })
    },
    getVolumeList: function () {
      authenticatedRequest({
        url: '/api/volume',
        method: 'GET',
        params: {
          novel_id: this.selectedNovel.id
        }
      }).then(res => {
        this.volumeList = res.data.data
      })
    },
    getChapterList: function (volumeId) {
      authenticatedRequest({
        url: '/api/chapter',
        method: 'GET',
        params: {
          volume_id: volumeId
        }
      }).then(res => {
        this.chapterList = res.data.data
      })
    },
    postImageSuccess: function (response) {
      this.$message({
        showClose: true,
        message: '上传成功',
        type: 'success'
      })
      authenticatedRequest({
        url: '/api/novel/image',
        method: 'PATCH',
        data: {
          image: response.data,
          novel_id: this.selectedNovel.id
        }
      }).then(res => {
        this.dialogVisibleOfImage = false
        this.getNovelList()
        this.getSelectNovel(this.selectedNovel.id)
      })
    },
    postImageError: function () {
      this.$message({
        showClose: true,
        message: '上传失败，请稍后再试',
        type: 'error'
      })
    },
    patchName: function () {
      this.dialogVisibleOfName = false
      authenticatedRequest({
        url: '/api/novel/' + this.selectedNovel.id,
        method: 'PATCH',
        data: {
          name: this.dialogDataOfName
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getNovelList()
        this.getSelectNovel(this.selectedNovel.id)
      })
    },
    patchSummary: function () {
      this.dialogVisibleOfSummary = false
      authenticatedRequest({
        url: '/api/novel/' + this.selectedNovel.id,
        method: 'PATCH',
        data: {
          summary: this.dialogDataOfSummary
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getNovelList()
        this.getSelectNovel(this.selectedNovel.id)
      })
    },
    patchCategory_id: function () {
      this.dialogVisibleOfCategory_id = false
      if (this.dialogDataOfCategory_ids == null) {
        this.$message('小说类型不可为null')
        return
      }
      authenticatedRequest({
        url: '/api/novel/' + this.selectedNovel.id,
        method: 'PATCH',
        data: {
          category_id: this.dialogDataOfCategory_ids[1]
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getNovelList()
        this.getSelectNovel(this.selectedNovel.id)
      })
    },
    // patchMultiplier: function () {
    //   this.dialogVisibleOfMultiplier = false
    //   authenticatedRequest({
    //     url: '/api/novel/' + this.selectedNovel.id,
    //     method: 'PATCH',
    //     data: {
    //       multiplier: this.dialogDataOfMultiplier
    //     }
    //   }).then(res => {
    //     this.$message({
    //       showClose: true,
    //       message: res.data.message,
    //       type: 'success'
    //     })
    //     this.getNovelList()
    //     this.getSelectNovel(this.selectedNovel.id)
    //   })
    // },
    // patchAddend: function () {
    //   this.dialogVisibleOfAddend = false
    //   authenticatedRequest({
    //     url: '/api/novel/' + this.selectedNovel.id,
    //     method: 'PATCH',
    //     data: {
    //       addend: this.dialogDataOfAddend
    //     }
    //   }).then(res => {
    //     this.$message({
    //       showClose: true,
    //       message: res.data.message,
    //       type: 'success'
    //     })
    //     this.getNovelList()
    //     this.getSelectNovel(this.selectedNovel.id)
    //   })
    // },
    postNovel: function () {
      if (this.formData.category_ids == null) {
        this.$message('小说类型不可为null')
        return
      }
      authenticatedRequest({
        url: '/api/novel',
        method: 'POST',
        data: {
          user_id: this.$store.state.user.id,
          category_id: this.formData.category_ids[1],
          name: this.formData.name,
          summary: this.formData.summary,
          image: 'default_novel_image.png',
          is_complete: this.formData.is_complete
        }
      }).then(res => {
        this.dialogVisibleOfInsertNovel = false
        this.getNovelList()
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
      })
    },
    postVolume: function () {
      authenticatedRequest({
        url: '/api/volume',
        method: 'POST',
        data: {
          novel_id: this.selectedNovel.id,
          name: this.newVolumeName,
          summary: this.newVolumeSummary
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getVolumeList()
        this.dialogVisibleOfInsertVolume = false
      })
    },
    postChapter: function () {
      authenticatedRequest({
        url: '/api/chapter',
        method: 'POST',
        data: {
          volume_id: this.selectedVolume.id,
          title: this.newChapterTitle,
          chapterContent: this.newChapterContent
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.dialogVisibleOfInsertChapter = false
        this.getChapterList(this.selectedVolume.id)
      })
    },
    patchVolumeName: function () {
      authenticatedRequest({
        url: '/api/volume/' + this.selectedVolume.id,
        method: 'PATCH',
        data: {
          name: this.dialogDataOfNameOfVolume
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.dialogVisibleOfPatchVolumeName = false
        this.getVolumeList()
        authenticatedRequest({
          url: '/api/volume/' + this.selectedVolume.id,
          method: 'GET'
        }).then(res => {
          this.selectedVolume = res.data.data
          this.getChapterList(this.selectedVolume.id)
        })
      })
    },
    patchVolumeSummary: function () {
      authenticatedRequest({
        url: '/api/volume/' + this.selectedVolume.id,
        method: 'PATCH',
        data: {
          summary: this.dialogDataOfSummaryOfVolume
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.dialogVisibleOfPatchVolumeSummary = false
        this.getVolumeList()
        authenticatedRequest({
          url: '/api/volume/' + this.selectedVolume.id,
          method: 'GET'
        }).then(res => {
          this.selectedVolume = res.data.data
          this.getChapterList(this.selectedVolume.id)
        })
      })
    }
  },
  mounted () {
    this.getNovelList()
  }
}
</script>

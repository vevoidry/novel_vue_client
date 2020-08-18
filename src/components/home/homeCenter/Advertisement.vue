<template>
  <div>
    <el-carousel height="250px">
      <el-carousel-item v-for="(item,i) in advertisementList" :key="i">
        <a :href="item.url">
          <el-image :src="'http://localhost:9090/images/'+item.image" fit="fill" style="width: 100%"></el-image>
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'Advertisement',
  data: function () {
    return {
      advertisementList: [
        {
          image: 'tanwanlanyue.png',
          url: 'http://wwww.baidu.com'
        },
        {
          image: 'tanwanlanyue.png',
          url: 'http://wwww.baidu.com'
        },
        {
          image: 'tanwanlanyue.png',
          url: 'http://wwww.baidu.com'
        }
      ]
    }
  }
}
</script>

<template>
  <div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted () {
    this.$router.push('/home')
  }
}
</script>

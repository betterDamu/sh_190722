<template>
  <div class="card">
    <a :href="item.repHref" target="_blank">
      <img :src="item.avatarSrc" style='width: 100px'/>
    </a>
    <p class="card-text">{{item.userName}}</p>
  </div>
</template>

<script>
    export default {
        name: "item",
        props:{
          item:Object
        }
    }
</script>

<style scoped>
  .card {
    float: left;
    width: 33.333%;
    padding: .75rem;
    margin-bottom: 2rem;
    border: 1px solid #efefef;
    text-align: center;
  }

  .card > img {
    margin-bottom: .75rem;
    border-radius: 100px;
  }

  .card-text {
    font-size: 85%;
  }

</style>

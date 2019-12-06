<template>
  <div id="app">
    <div class="row">
      <div class="col-xs-offset-2 col-xs-8">
        <div class="page-header"><h2>Router Basic - 01</h2></div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-2 col-xs-offset-2">
        <div class="list-group">
          <div @click="GotoAbout" class="list-group-item" :class="{active:aboutActive}">Go to About</div>
          <div @click="GotoHome" class="list-group-item" :class="{active:homeActive}">Go to Home</div>
          <div @click="GotoUser" class="list-group-item" :class="{active:userActive}">Go to User</div>
         <!-- <router-link to="/about" class="list-group-item">Go to About</router-link>
          <router-link to="/home" class="list-group-item">Go to Home</router-link>
          <router-link to="/user" class="list-group-item">Go to User</router-link>-->
         <!--
          <a href="#/about" class="list-group-item active">About</a>
          <a href="#/home" class="list-group-item">Home</a>
          -->
        </div>
      </div>
      <div class="col-xs-6">
        <div data-v-957c9522="" class="col-xs-6">
          <div data-v-957c9522="" class="panel">
            <div data-v-957c9522="" class="panel-body">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "App",
        data(){
          return {
            aboutActive:true,
            homeActive:false,
            userActive:false,
          }
        },
        methods:{
          GotoAbout(){
            this.aboutActive = true;
            this.homeActive = false;
            this.userActive = false;
            this.$router.push("/about")
          },
          GotoHome(){
            this.aboutActive = false;
            this.homeActive = true;
            this.userActive = false;
            this.$router.push("/home")
          },
          GotoUser(){
            this.aboutActive = false;
            this.homeActive = false;
            this.userActive = true;
            this.$router.push("/user")
          }
        }
    }
</script>

<style scoped>

</style>

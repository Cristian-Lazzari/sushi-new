<script>
  import { state } from "../state.js";
  import axios from "axios";
  import AppMain from "../components/MainAboutUs.vue";
  export default {
    components: { AppMain },

    data() {
      return {
        state,
      };
    },
    methods:{

    },
    created(){
      this.state.post_p = 2
      this.state.getSetting(); 
    }
  };
</script>

<template>
  <div class="container">
    <AppMain />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles/general.scss" as *;


</style>
 
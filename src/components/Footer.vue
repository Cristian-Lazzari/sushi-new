<script>
  import { state } from "../state.js";
  import axios from "axios";
  export default {
    components: {  },

    data() {
      return {
        state,
      };
    },
    methods:{

    },
  };
</script>

<template>
  <footer>
    <div class="legal">
      <h4>Informazioni legali: </h4>
      <a href="https://www.iubenda.com/privacy-policy/89654778">Privacy Policy</a>
      <a href="https://www.iubenda.com/privacy-policy/89654778/cookie-policy">Cookie Policy</a>
      <a href="https://future-plus.it">Creato da Future plus</a>
    </div>
  </footer>

</template>

<style scoped lang="scss">
@use "../assets/styles/general.scss" as *;
footer{
  background-color: $c1;
  padding: 2em;
  color: $cText;
  h4{
    color: rgba(255, 255, 255, 0.564);
  }
  a{
    color: $c7;
    text-decoration: none;
  }
  .legal{
    width: 100%;
    display: flex;
    gap: 6px;
    align-items: baseline;
    justify-content: flex-end;
  }
}

@media (max-width: $bp_sm) {
  footer{
    padding: 2px 10px;
    height: $d_foo ;
    h4{
      display: none;
    }
    display: flex;
    font-size: 12px;
    
    justify-content:flex-end;
    gap: 6px;
    align-items: center;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;

  }
  
}
</style>

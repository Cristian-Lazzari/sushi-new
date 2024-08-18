<script>
  import { state } from "../state.js";
  import axios from "axios";
  import AppMessaggio from "../components/Message.vue";
  export default {
    components: { AppMessaggio },

    data() {
      return {
        state,
        content: [
          {
            'title' : 'Scopri il nostro menu pieno di golosità',
            'img' : state.domain + '/img/pizza-1.png',
            'p' : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic obcaecati blanditiis iste quos facilis nemo alias! Obcaecati aut omnis cupiditate asperiores eos, dolor ipsum, debitis exercitationem excepturi ab quibusdam hic!',
            'cta' : 'Vedi menu',
            'cta_destination' : 'menu',  //1 asporto 2 tavoli 3 menu 4 contatti 5 about us
          },
          {
            'title' : 'Prenota subito un tavolo',
            'img' : state.domain + '/img/pizza-2.png',
            'p' : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic obcaecati blanditiis iste quos facilis nemo alias! Obcaecati aut omnis cupiditate asperiores eos, dolor ipsum, debitis exercitationem excepturi ab quibusdam hic!',
            'cta' : 'Prenota tavolo',
            'cta_destination' : 'check-out',  //1 asporto 2 tavoli 3 menu 4 contatti 5 about us
          },
          {
            'title' : 'Ordina a domicilio o d\'asporto',
            'img' : state.domain + '/img/pizza-3.png',
            'p' : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic obcaecati blanditiis iste quos facilis nemo alias! Obcaecati aut omnis cupiditate asperiores eos, dolor ipsum, debitis exercitationem excepturi ab quibusdam hic!',
            'cta' : 'Prenota Asporto',
            'cta_destination' : 'ordina',  //1 asporto 2 tavoli 3 menu 4 contatti 5 about us
          },
        ]
      };
    },
    methods:{
      navigate_to(w){
        if(w == 'check-out'){
          this.state.checkOut_t = 1
          localStorage.setItem('checkOut_t', this.state.checkOut_t)
        }
        this.$router.replace(w)
      }
    },
    created(){
      this.state.getSetting();
    }
  };
</script>

<template>
  <div id="home" class="cont">
    <AppMessaggio />
    <section v-for="par in content" :key="par.title">
      <div class="img-sect">
        <img :src="par.img" alt="">
      </div>
      <div class="text">
        <h2>{{par.title}}</h2>
        <p>{{ par.p }}</p>
        <div @click="navigate_to(par.cta_destination)" class="btn_1">{{ par.cta }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles/general.scss" as *;

.cont{

  
  padding: 0 !important;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  section{
    scroll-snap-align: start;
    background-color: $c7;
    color: $cText;
    display: flex;
    width: 100%;
    height: 100% ;
    .img-sect{
      flex-shrink: 0;
      width: 64%;
      img{
        object-fit: cover;
        background-size: cover;
        width: 100%;
        height: 100%;
        box-shadow: 20px 0px 40px rgba(0, 0, 0, 0.438);
      }
    }
    .text{
      flex-shrink: 1;
      padding: 8%;
      display: flex;
      flex-direction: column;
      gap: 2em;
      text-align: right;
      align-items: flex-end;
      p{
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.719);
        font-size: $fs_sm;
      }
      h2{
        font-size: $fs_lg;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.495);
      }
    }
  }
  section:nth-child(even){
    flex-flow: row-reverse;
    background-color: $c6;
    .text{
      align-items: flex-start;
      text-align: left;
    }
    img{
      box-shadow: -20px 0px 40px rgba(0, 0, 0, 0.434);
    }
  }
}

@media (max-width: $bp_md) {
  
  section{
    margin-bottom: 500px;
    height: 90% !important;
    flex-direction: column;
    .img-sect{
      height: clamp(180px, 34%, 320px);
      flex-grow: 1;
      flex-shrink: 1;
      width: 100%!important;
    }
    .text{
      flex-grow: 1;
      padding: 1.2rem !important;
      gap: 1rem !important;
      
    }
  }
  section:nth-child(even){
    flex-flow: column !important;
  }
  
}

</style>

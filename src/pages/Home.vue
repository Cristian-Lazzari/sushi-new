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
            'img' : state.domain + '/img/sushi-1.png',
            'p' : 'Scopri la nostra ampia selezione di piatti, dai classici nigiri ai roll più innovativi. Sfoglia il menù e trova il piatto che risveglierà i tuoi sensi.',
            'cta' : 'Vedi menu',
            'cta_destination' : 'menu',  //1 asporto 2 tavoli 3 menu 4 contatti 5 about us
          },
          {
            'title' : 'Prenota subito un tavolo',
            'img' : state.domain + '/img/sushi-2.png',
            'p' : 'Vuoi goderti l’atmosfera rilassante del nostro ristorante? Prenota un tavolo e vivi un’esperienza unica, dove ogni dettaglio è curato per farti sentire speciale. Che sia per una cena romantica o una serata tra amici, ti aspettiamo per deliziarti con il meglio del sushi.',
            'cta' : 'Prenota tavolo',
            'cta_destination' : 'contatti',  //1 asporto 2 tavoli 3 menu 4 contatti 5 about us
          },
          {
            'title' : 'Ordina a domicilio o d\'asporto',
            'img' : state.domain + '/img/sushi-3.png',
            'p' : 'Hai voglia di sushi fresco e autentico? Con un paio di click, porta l’eccellenza direttamente a casa tua. Ordina online e lasciati sorprendere dai nostri sapori unici.',
            'cta' : 'Prenota d\' Asporto',
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
    background: linear-gradient($c1 40%, rgba(75, 12, 12, 0) 80%) ;
    color: $cText;
    display: flex;
    width: 100%;
    height: 100% ;
    .img-sect{
      flex-shrink: 0;
      width: 60%;
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
      gap: .7rem;
      text-align: right;
      align-items: flex-end;
      h2{
        font-size: $fs_xlg;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.495);
      }
      p{
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.719);
        font-size: $fs_md;
        opacity: .8;
      }
      .btn_1{
        margin-top: 1rem;
      }
    }
  }
  section:nth-child(even){
    flex-flow: row-reverse;
    //background-color: $c6;
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
      gap: .7rem !important;
      margin-right: 29px;
      
    }
  }
  section:nth-child(even){
    flex-flow: column !important;
  }
  
}

</style>

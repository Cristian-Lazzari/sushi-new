<script>
  import { state } from "../state.js";
  import axios from "axios";
  import AppMessage from "../components/Message.vue";
  export default {
    components: { AppMessage },

    data() {
      return {
        state,
        day : '',
        days : [],
        month : '',
        time : '',
        year : [],
        av : '',
        domicilio : false,
        indirizzi : [],

        loading : false,
        error:{
          calendar : '',
          n_person : '',

          name : '',
          surname : '',
          phone : '',
          email : '',
          
          cv : '',
          via : '',
          comune : '',
          tc : '',
        },
        user:{
          name : '',
          surname : '',
          phone : '',
          email : '',
          message : '',
          tc : 0,

          cv : '',
          via : '',
          comune : '',
          news_letter : 0,
        },
        
        today: 0,
        first_day_w: 0,
        n_person: 0,

        typeOfOrdering : 1,
      };
    },
    methods:{
      async sendOrder(){
        let date_slot = this.day.date + ' ' + this.time.time
        // console.log(date_slot)
        // console.log(this.user)
        console.log(this.user.comune)
        this.error.name =''
        this.error.surname =''
        this.error.email =''
        this.error.cv =''
        this.error.via =''
        this.error.comune =''
        this.error.tc =''
        if(this.state.validation(this.state.checkOut_t, this.typeOfOrdering, this.user, this.error)){
          this.loading = true
          if(this.state.checkOut_t == 1){
            let body = {
              date_slot,
              name : this.user.name,
              surname : this.user.surname,
              email : this.user.email,
              phone : this.user.phone,
              message : this.user.message,
              news_letter : this.user.news_letter,
              n_person : String(this.n_person),
            }
            
            let reservation = await axios.post(state.baseUrl + "api/reservations", body, { headers: {'Content-Type': 'application/json'}});
            if(reservation.data.success && reservation){
              this.state.message.title = 'Prenotazione avvenuta con successo!'
              this.state.message.text = 'Grazie per esserti affidato a Nome locale. Controlla la tua email per rivedere i dettagli della tua prenotazione'
              this.year = []
              this.time = ''
              this.month = ''
              this.day = ''
              this.days = []
              this.getDay(this.state.checkOut_t)
              this.$router.replace("/")
              this.loading = false

            }else{
              this.state.message.title = 'Ops...'
              this.state.message.text = reservation.data.message
              this.year = []
              this.time = ''
              this.month = ''
              this.day = ''
              this.days = []
              this.getDay(this.state.checkOut_t)
              this.loading = false
            }

          }else if(this.state.checkOut_t == 2){
            let cart = this.state.getServerCart() 
            let body = {
              date_slot,
              name : this.user.name,
              surname : this.user.surname,
              email : this.user.email,
              phone : this.user.phone,
              message : this.user.message,
              news_letter : this.user.news_letter,
              cart : JSON.stringify(cart),
              npezzi_c1 : this.state.npezzi_c1,
              npezzi_c2 : this.state.npezzi_c2,
            }
            let order = await axios.post(state.baseUrl + "api/orders", body, { headers: {'Content-Type': 'application/json'}});
            if(order.data.success && order){
              this.state.message.title = 'Ordine avvenuto con successo!'
              this.state.message.text = 'Grazie per esserti affidato a Nome locale. Controlla la tua email per rivedere i dettagli del tuo ordine'
              this.year = []
              this.time = ''
              this.month = ''
              this.day = ''
              this.days = []
              this.getDay(this.state.checkOut_t)
              this.state.cart.products = []
              this.state.getTotCart()
              this.$router.replace("/ordina")
              this.loading = false

            }else{
              this.state.message.title = 'Ops...'
              this.state.message.text = order.data.message
              this.year = []
              this.time = ''
              this.month = ''
              this.day = ''
              this.days = []
              this.getDay(this.state.checkOut_t)
              this.loading = false
            }

          }else if(this.state.checkOut_t == 3){
            let cart = this.state.getServerCart()
            let body = {
              date_slot,
              name : this.user.name,
              surname : this.user.surname,
              email : this.user.email,
              phone : this.user.phone,
              message : this.user.message,
              news_letter : this.user.news_letter,
              cv : this.user.cv,
              comune : this.user.comune,
              via : this.user.via,
              cart : JSON.stringify(cart),
              npezzi_c1 : this.state.npezzi_c1,
              npezzi_c2 : this.state.npezzi_c2,
            }
            let order = await axios.post(state.baseUrl + "api/orders", body, { headers: {'Content-Type': 'application/json'}});
            if(order.data.success && order){
              this.state.message.title = 'Ordine avvenuto con successo!'
              this.state.message.text = 'Grazie per esserti affidato a Nome locale. Controlla la tua email per rivedere i dettagli del tuo ordine'
              this.year = []
              this.time = ''
              this.month = ''
              this.day = ''
              this.days = []
              this.getDay(this.state.checkOut_t)
              this.state.cart.products = []
              this.state.getTotCart()
              this.$router.replace("/ordina")
              this.loading = false

            }else{
              this.state.message.title = 'Ops...'
              this.state.message.text = order.data.message
              this.year = []
              this.time = ''
              this.month = ''
              this.day = ''
              this.days = []
              this.getDay(this.state.checkOut_t)
              this.loading = false
            }

          }
        }
      },

      modNperson(a_r){
        this.error.n_person = ''
        if (a_r) {
          if(this.n_person < this.av.table){
            this.n_person ++
          }else{
            this.error.n_person = 'Non possiamo ricevere piu di queste persone in questo orario'
          }
        }else{
          if(this.n_person > 1){
            this.n_person --
          }

        }

      },

      //calendar f
      fillDay(){
        let arr = []
        let max = this.days[0].day
        let dw = this.days[0].day_w
        if(max !== 1){
          for (let i = 1; i < max ; i++) {
            arr.push(i)  
          }
        }
        if(dw !== 1){
          for (let i = 1; i < dw; i++) {
            arr.push(i)  
          }
        }
        //s.log(arr)
        return arr
      },
      adjustC(month) {
        let maxdaymese = state.giorniPerMese[month - 1];
        if (this.days.length === 0) {
            return; // Non fare nulla se non ci sono giorni in this.days
        }
        let newDays = [];
        this.first_day_w = this.days[0].day_w
        newDays.push(this.days[0]);
        for (let i = 1; i < this.days.length; i++) {
            let prevDay = this.days[i - 1].day;
            let currentDay = this.days[i].day;

            for (let j = prevDay + 1; j < currentDay; j++) {
                if (j > maxdaymese) break;
                newDays.push({ day: j });
            }
            
            newDays.push(this.days[i]);
        }
        // Se necessario, aggiungi giorni fino al massimo giorno del mese
        let lastDay = newDays[newDays.length - 1].day;
        for (let k = lastDay + 1; k <= maxdaymese; k++) {
            newDays.push({ day: k, year:0 });
        }
        this.days = newDays;
      },
      async getDay(filter){
        let year = await axios.get(state.baseUrl + "api/getDays", {
					params: {
						filter : filter,
				  }})
        if(year.data.results == []){

        }
        this.typeOfOrdering = year.data.typeOfOrdering
        for (let i = 1; i <= year.data.count; i++) {
          const element = year.data.results[i]
          this.year.push(element)  
        }
        this.month = this.year[0].month
        this.days = this.year[0].days
        this.adjustC(this.month)
      },
      modMonth(a_r){
        let n_mesi = this.year.length 
        
        let f_mese = this.year[0].month
        let l_mese = this.year[n_mesi - 1].month
        if(a_r == 'add'){
          if(this.month == l_mese){
            this.month = f_mese
          }else if(this.month == 12 && this.month !== l_mese ){
            this.month = 1
          }else{
            this.month ++
          }
        }else if(a_r == 'rem'){
          if(this.month == f_mese){
            this.month = l_mese
          }else if(this.month == 1){
            this.month = 12
          }else{
            this.month --
          }
        }else{
          this.month = a_r
        }
        this.year.forEach(m => {
          if(m.month == this.month){
            this.days = m.days
            this.adjustC(this.month)
          }
        });
      },
      checkType(f){
        this.av = ''
        this.year = []
        this.days = []
        this.day = ''
        this.time = ''
        this.getDay(f)
        this.state.checkOut_t = f
        if(this.state.checkOut_t == 3){
          this.indirizzi = state.settings[7].property
          console.log(this.indirizzi)
        }
      },
      classDay(d,av, date){
        if(this.day !== ''){
          let giornom = date;
          let daym = this.day.date
          if (giornom == daym ) {
            return 'day active'
          } else if(date == this.today) {
            return 'day currentDay'
          } else if(av == undefined) {
            return 'day filling'
          }else{
            return 'day '
          } 
        }else{
          if(date == this.today) { 
            return 'day currentDay'
          } else if(av == undefined) {
            return 'day filling'
          }else{
            return 'day '
          } 

        }
        
      },
      selectDay(d, av){
        this.av = ''
        this.time = ''
        this.error.calendar = ''
        if (av !== undefined) {
          this.day = d 
        }
      },
      selectTime(t, av){
        this.av = undefined 
        if (av !== undefined) {
          this.error.calendar = ''
          this.time = t 
          this.av = av 
          this.n_person = 0
          if(av.cucina_2 < this.state.npezzi_c2 && av.cucina_1 < this.state.npezzi_c1){
            this.error.calendar = 'Il tuo ordine comprende: ' + this.state.npezzi_c1 + ' pezzi al taglio e ' + this.state.npezzi_c2 + ' pizze al piatto... Per quest\'orario non riusciamo a provvedere alla quantita di prodotti richiesti!'
            this.av = '' 
            setTimeout(() => {
              this.time = '' 
            }, 1000); 
          }else if(av.cucina_2 < this.state.npezzi_c2){
            this.error.calendar = 'Il tuo ordine comprende: ' + this.state.npezzi_c2 + ' pizze al piatto... Per quest\'orario non riusciamo a provvedere alla quantita di prodotti richiesti!'
            this.av = '' 
            setTimeout(() => {
              this.time = '' 
            }, 1000);
          }else if(av.cucina_1 < this.state.npezzi_c1){    
            this.error.calendar = 'Il tuo ordine comprende: ' + this.state.npezzi_c1 + ' pezzi al taglio... Per quest\'orario non riusciamo a provvedere alla quantita di prodotti richiesti!'
            this.av = '' 
            setTimeout(() => {
              this.time = ''            
            }, 1000);
          }
          
        }
      },
      getArr(){
        if (this.first_day_w) {
          return this.first_day_w - 1
        }else{
          return []
        }
      },
      //leggermente modificata
      removeItem(p){
        this.state.cart.products.splice(p, 1)
        if(this.state.cart.products.length == 0){
          this.cartOpen = false
        }
        this.state.getTotCart();
        if(!this.state.cart.products.length){
          this.$router.replace( '/ordina')
        }
        this.state.setNpezzi();
        this.state.saveCart()
      },
    },

    async created(){
      await this.state.getSetting();
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1; // getMonth() ritorna un valore da 0 a 11
      let year = today.getFullYear();
      let dayOfWeek = today.getDay(); // Ottiene il giorno della settimana (0-6)
      this.state.checkOut_t = localStorage.getItem('checkOut_t')
      const cart = localStorage.getItem('cart');
      if (cart && this.state.checkOut_t > 1) {
        this.state.cart = JSON.parse(cart);
        this.state.setNpezzi();
      } 

      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      this.today = `${day}/${month}/${year}`;
      this.first_day_w = dayOfWeek;
      
      await this.getDay(state.checkOut_t)
      this.domicilio = state.settings[6].status

   
     
    },
    
  };
</script>

<template>
  <div class="container">
    <AppMessage  />

    <h1 v-if="(state.checkOut_t == 2 || state.checkOut_t == 3)" >Completa il tuo ordine</h1>
    <h1 v-else >Prenota il tuo tavolo</h1>
    <section v-if="(state.checkOut_t == 2 || state.checkOut_t == 3) && domicilio">
      <h3>Scegli come vuoi ordinare</h3>
      <div class="card choice">
        <span @click="checkType(2)" :class="state.checkOut_t == 2 ? 'active' :''">Asporto</span>
        <span @click="checkType(3)" :class="state.checkOut_t == 3 ? 'active' :''">Domicilio</span>
      </div>
    </section>
    <section>
      <h3>Scegli il giorno</h3>
      <div class="card calendar">
        <div class="months">
          <h4 
            v-for="m in year" :key="m.month"
            :class="m.month == month ? 'active' : ''">
            {{ state.mesi[m.month] }}
          </h4>
        </div>
        <div class="day_week">
          <span>L</span><span>M</span>
          <span>M</span><span>G</span>
          <span>V</span><span>S</span>
          <span>D</span>
        </div>
        <div class="days">
          <div class="filling day" v-for="d in getArr()" :key="d" ></div>
          <div 
          v-for="d in days"
          :key="d.day" 
          :class="classDay(d.day, d.av, d.date)"
          @click="selectDay(d ,d.av)"
          >
            <span>{{ d.day }}</span>
            <span>{{ d.month }}</span>
          </div>
        </div>
        <svg @click="modMonth('add')" v-if="year.length > 1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left-square next" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
        <svg @click="modMonth('rem')" v-if="year.length > 1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left-square previus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </div>
    </section>
    <section v-if="day">
      <h3 v-if="(state.checkOut_t == 2 || state.checkOut_t == 3)" >Scegli l'orario per il ritiro</h3>
      <h3 v-else >Scegli la fascia oraria</h3>
      <div class="card times">
        <div class="back"></div>
        <h3 v-if="day.date !== today" >{{ day.date }} {{ time ? '- ' + time.time : ''}}</h3>
        <h3 v-else >Oggi</h3>
        <div class="time-cont">
          <div v-for="t in day.times" :key="t.time" @click="selectTime(t, t.av)" :class="time === t ? 'active time' : 'time'">
            <h4>{{ t.time }}</h4>
            <p v-if="typeOfOrdering || state.checkOut_t== 1">
              <span v-if="state.checkOut_t == 1" >{{ t.av.table }} coperti disponibili</span>
              <span v-if="state.checkOut_t == 2 || state.checkOut_t == 3" >{{ t.av.cucina_1 }} pezzi al taglio disponibili, 
                {{ t.av.cucina_2 }} pizze al piatto disponibili
              </span>
            </p>
          </div>
        </div>
      </div>
      <p v-if="error.calendar" class="error">{{ error.calendar }} 
        <router-link :to="{ name: 'ordina' }" class="router">Rivedi il tuo ordine</router-link
      >
      </p>
    </section>
    <section v-if="time && state.checkOut_t == 1 " >
      <h3>Indica il numero di persone del tavolo</h3>
      <div class="card n_person">
        <div class="minus" @click="modNperson(0)">
          <div class="line l1"></div>
          <div class="line"></div>
        </div>
        <div class="person">{{ n_person }}</div>
        <div class="plus" @click="modNperson(1)">
          <div class="line"></div>
        </div>
      </div>
      <p v-if="error.n_person" class="error">{{ error.n_person }}</p>

    </section>
    <section v-if="av && (n_person || state.checkOut_t == 2 || state.checkOut_t == 3)" >
      <h3>Inserici i tuoi dati</h3>
      <div class="card dati-g">
        <div class="split">
          <div class="input-group">
            <label for="name">Nome</label>
            <input v-model="user.name" type="text" id="name" placeholder="Il tuo nome">
          </div>
          <div class="input-group">
            <label for="surname">Cognome</label>
            <input v-model="user.surname" type="text" id="surname" placeholder="Il tuo cognome">
          </div>
        </div>
        <div class="input-group">
          <label for="phone">Telefono</label>
          <input v-model="user.phone" type="text" id="phone" placeholder="Il tuo telefono">
        </div>
        <div class="input-group">
          <label for="mail">E-mail</label>
          <input v-model="user.email" type="text" id="mail" placeholder="La tua e-mail">
        </div>
        <div class="input-group large">
          <label for="message">Messaggio</label>
          <textarea name="message" id="message" cols="30" rows="10" :value="user.message"></textarea>
        </div>
      </div>
      <p v-if="error.name" class="error">{{ error.name }}</p>
      <p v-if="error.n_person" class="error">{{ error.n_person }}</p>
      <p v-if="error.surname" class="error">{{ error.surname }}</p>
      <p v-if="error.email" class="error">{{ error.email }}</p>
    </section>

    <section v-if="state.checkOut_t ==3 && time">
      <h3>Inserici la via per la consegna</h3>
      <div class="card dati-g">
        <div class="input-group">
          <label for="via">Via</label>
          <input v-model="user.via" type="text" id="via" placeholder="La tua via">
        </div>
        <div class="split-2">
          <div class="input-group more">
            <label for="name">Comune</label>
            <select name="comune" v-model="user.comune" id="comune">
              <option v-for="i in indirizzi" :key="i.name">
                {{ i.comune }} - {{ i.provincia }}
              </option>
            </select>
          </div>
          <div class="input-group less">
            <label for="phone">Civico</label>
            <input v-model="user.cv" type="text" id="phone" placeholder="N^, interno, scala...">
          </div>
        </div>
        <p v-if="error.via" class="error">{{ error.via }}</p>
        <p v-if="error.comune" class="error">{{ error.comune }}</p>
        <p v-if="error.cv" class="error">{{ error.cv }}</p>
        
      </div>
    </section>
    <section v-if="state.checkOut_t == 2 || state.checkOut_t == 3" class="show-c"  >
      <div class="top-c">
        <h3>Prodotti:</h3>
        
        <img  class="close" src="../../public/img/close-x.png" alt=""></div>
      <div class="prod-c">
        <div v-for="(p, i) in state.cart.products" :key="p.id" class="prod">
          <div class="head">
            <span class="count">
              * {{ p.counter }}
            </span>
            <span>{{ p.name }}</span>
            <span class="price" >€ {{ p.price / 100}}</span>
            <span @click="removeItem(i)" class="mod">Rimuovi</span>
          </div>
          <div class="body">
            <div class="top" v-if="p.options.length !== 0">
              <h4>Opzioni:</h4>
              <span @click="editProd(0, 'opt', i, p)" v-for="i in p.options" :key="i.name">+ {{ i.name }},</span>
            </div>
            <div class="bottom"  v-if="p.add.length !== 0">
              <h4>Extra:</h4>
              <span @click="editProd(0, 'add', i, p)" v-for="i in p.add" :key="i.name">+ {{ i.name }}</span>
            </div>
            <div class="bottom"  v-if="p.removed.length !== 0">
              <h4>Rimossi:</h4>
              <span @click="editProd(0, 'rem', i, p)" v-for="i in p.removed" :key="i.name">- {{ i.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="top-c">
        <h3>Totale: </h3>
        <h3>€{{ state.cart.totprice / 100 }}</h3>
      </div>
      <p>
        <span v-if="state.npezzi_c1" > Pezzi al taglio: {{ state.npezzi_c1 }}</span>
        <span v-if="state.npezzi_c2" > Pizze al piatto: {{ state.npezzi_c2 }}</span>
      </p>
      
      <div class="btn_3 add_p" @click="$router.replace('ordina')">Aggiungi altri prodotti</div>
      
    </section>
    <section v-if="av && (n_person || state.checkOut_t == 2 || state.checkOut_t == 3)">
      <p class="t-c">
        <label class="ui-check">
          <input v-model="user.news" type="checkbox">
          <svg viewBox="0 0 64 64" height="2em" width="2em">
            <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
          </svg>
        </label>
        <span>Voglio essere aggiornato su le novita di Nome locale</span>
      </p>
      <p class="t-c">
        <label class="ui-check">
          <input v-model="user.tc" type="checkbox">
          <svg viewBox="0 0 64 64" height="2em" width="2em">
            <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
          </svg>
        </label>
        <span>Confermo di aver letto la privacy e di accettare termini e condizioni</span>
      </p>
      <p v-if="error.tc" class="error">{{ error.tc }}</p>

    </section>
    
    <div v-if="av && (n_person || state.checkOut_t == 2 || state.checkOut_t == 3) && !loading" @click="sendOrder" class="btn_3 go">CONFERMA</div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles/general.scss" as *;
.container{
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.error{
  text-align: center;
  font-size: $fs_xsm;
  width: 100%;
  padding: 1rem;
  background-color: rgba(188, 42, 42, 0.254);
  border-radius: 20px;
  color: rgb(236, 105, 105);
  .router{
    color: rgb(236, 105, 105);

  }
}
.add_p{
  margin: 0 auto;
}
.t-c{
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 900px;
  font-size: $fs_sm;
}
section{
  h3{
    font-size: $fs_lg;
    text-align: center;
  }
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: $c5;
  width: 100%;
  max-width: 900px;
  position: relative;
  .card{
    display: flex;
    background-color: $c4;
    padding: 1rem;
    border-radius: 15px;
  }
  .choice{
    justify-content: space-between;
    gap: 5px;
    span{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: $fs_xsm;
      flex-grow: .4;
      padding: 10px ;
      border-radius: 10px;
      transition:all .2s ease-in;
    }
    .active{
      flex-grow: 1;
      font-size: $fs_md;
      padding: 15px ;
      background-color: $c2;
      transition:all .2s ease-in;
    }
  }
  .calendar{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    .months{
      width: 70%;
      display: flex;
      justify-content: space-around;
      font-size: $fs_sm;
      text-transform: capitalize;
      padding: 1rem;
      h4{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: .4;
        text-align: center;
        opacity: .4;
        transition:all .2s ease-in;
      }
      .active{
        opacity: 1;
        flex-grow: 1;
        font-size: $fs_lg;
        transition:all .2s ease-in;
      }
    }
    .days, .day_week{
      transition:all .2s ease-in;
      width: 80%;
      font-size: $fs_md;
      text-align: center;
      display: grid;
      justify-content: center;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 6px;
      row-gap: 6px;
      column-gap: 6px;
      align-content: center; 
    }
    .next, .previus{
      position: absolute;
      top: 50%;
      height: 30px;
      width: 30px;
      background-color: $c6;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
    }
    .next{
      transform: translate(50%,-50%) rotateZ(180deg);
      right: 6%;
    }
    .previus{
      transform: translate(-50%,-50%);
      left: 6%;
    }

    
  }
  .days, .time-cont{
    transition: all .2s ease-in-out;
      .day{
        display: flex;
        justify-content: center;
        align-content: center;
        border-radius: 6px;
        background-color: $c6;
        width: 100%;
        aspect-ratio: 1;
        flex-wrap: wrap;
        font-size: $fs_sm;
        span{
          height: auto;
        }
      }
      .currentDay{
        background-color: rgba(66, 6, 6, 0.414);
      }
      .active{
        background-color: $c2 !important;
        color: $c5;
        font-size: $fs_lg;
        transition: all .2s ease-in-out;
        h4{
          font-size: $fs_lg;
          margin-left: 4px;
        }
      }
      .filling{
        opacity: .4;
      }
    }
  .times{
    display: flex;
    gap: 10px;
    flex-direction: column;
    position: relative;
    h3{
      font-size: $fs_lg;
    }
    .time-cont{
      display: flex;
      flex-direction: column;
      gap: 4px;
      .time{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: $c6;
        padding: .6rem;
        font-size: $fs_sm;
        border-radius: 5px;
        p{
          font-size: $fs_xsm;
        }
      }
    }
  }
  .n_person{
    padding: 3rem 0 ;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    .person{
      font-size: $fs_lg;
    }
    
  }
  .dati-g{
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: .9rem;
    .split{
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      div{
        flex-grow: 1;
      }
    }
    .split-2{
      display: flex;
      justify-content: space-between;
      gap: 2rem;
      .more{
        flex-grow: 1;
      }
      .less{
        flex-grow: .1;
      }
    }
    .large{
      textarea{
        height: 10vh;
        padding: 1rem !important;

      }
    }
    .input-group{
      font-size: $fs_md;
      display: flex;
      flex-direction: column;
      gap: .4rem;
      label{
        margin: 0 5px;
      }

      input, select, textarea{
        background-color: $c6;
        border: none;
        padding: .6rem 1.3rem;
        border-radius: 8px;
        font-size: $fs_xsm;
        color: $c5;
        appearance: none;
      }
      input::placeholder, select::placeholder {
            color: $c7;
        }
      input:-internal-autofill-selected ,
      select:-internal-autofill-selected{
        appearance: none;
        background-image: none !important;
        background-color: $c4 !important;
        color: $c5 !important;
      }
    }
  }
  
}
.go{
  max-width: 600px;
  width: 60%;
  text-align: center;
  margin: 2rem auto;
  font-size: $fs_xlg;
  border-radius: 14px;
  padding: 1rem 2rem;
}

</style>

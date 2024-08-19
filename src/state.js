import { reactive } from "vue";
import axios from "axios";

export const state = reactive({
  link_review: "http://google",
  baseUrl:"https://db.kojo-sushi.it/",
  //baseUrl: "http://127.0.0.1:8000/",
  domain: "https://glistening-blini-19d288.netlify.app/",
  getImageUrl(image) {
    return this.baseUrl + "public/storage/" + image;
  },

  //---1-Gestione interfaccia grafica
  
  navMobile: false,
  checkOut_t: 1,
  message : {
    title : '',
    text : ''
  },
  post_p : 1,
  
  //---2-Gestione order

  cart:{
    'totprice' : 0,
    'products' : [],
  },
  npezzi_c1 : 0,
  npezzi_c2 : 0,
  
  //---3-Gestione interfaccia date
  mesi :['', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  days_weeks :[' ','lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
  giorniPerMese : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  //---4-Gestione interfaccia setting
  settings : [
    {
      'name' : 'tavoli',
      'status' : 0,
      'property' : null,
    },
    {
      'name' : 'asporto',
      'status' : 0,
      'property' : null,
    },
    {
      'name' : 'ferie',
      'status' : 0,
      'property' : {
        'from': '--/--/---',
        'to': '--/--/---'
      },
    },
    {},{},{},
    {
      'name' : 'domicilio',
      'status' : 0,
      'property' : null,
    },
    {
      'name' : 'comuni per il domicilio',
      'status' : 0,
      'property' : [],
    },

  ],
  //-----4-a-Dati
  ferie: {
    status : false
  },
  contact : {},
  position : {},
  orari_aperture:[], 
  //---5-Funzioni 
  validation(ct, too, us, error){
    let check = false;
    if(ct == 3 ){
      if(!us.comune){
        error.comune = 'Il campo "comune" è necessario';
        check = true;
      }
      if(!us.via){
        error.via = 'Il campo "via" è necessario';
        check = true;
      }
      if(!us.cv){
        error.cv = 'Il campo "civico" è necessario';
        check = true;
      }  
    }
    
    if(!us.tc){
      error.tc = 'Per ordinare e necessariio accettare i termini e le condizioni';
      check = true;
    }
    //nome
    if(!us.name){
      error.name = 'Il campo "nome" è necessario';
      check = true;
    }
    //cognome
    if(!us.surname){
      error.surname = 'Il campo "cognome" è necessario';
      check = true;
    }
    // Email
    if (!us.email) {
      error.email='Il campo "email" è richiesto!';
      check = true;
    } else if (!us.email.includes('@')) {
      error.email='Il campo "email" deve includere "@"';
      check = true;
    } else if (!(us.email.endsWith('.com') || us.email.endsWith('.it'))) {
      error.email='Il campo "email" deve terminare con ".com" o ".it"';
      check = true;
    } else if (us.email.length < 5) {
      error.email='Il campo "email" deve contenere almeno 5 caratteri';
      check = true;
    }
    us.phone = us.phone.toString()
    if(!us.phone){
      error.phone = 'Il campo "telefono" è richiesto';
      check = true;
      phone
    } else if(us.phone.length < 10){
      error.phone = 'Il campo "email" deve contenere almeno 10 caratteri';
      check = true;
    }
    if(!check){
      return true;
    }else {
      return false;
    }
  },
  getServerCart(){
    let newcart = []
    this.cart.products.forEach(prod => {
      let newo = []
      prod.options.forEach(o => {
        newo.push(o.name)
      });
      let newr = []
      prod.removed.forEach(o => {
        newr.push(o.name)
      });
      let newa = []
      prod.add.forEach(o => {
        newa.push(o.name)
      });
      let product = {
        id : prod.id,
        name : prod.name,
        add : newa,
        remove : newr,
        option : newo,
        price : prod.price,
        counter : prod.counter,
      }
      newcart.push(product)
      
    });
    return newcart
  },
  setNpezzi(){
    this.npezzi_c1 = 0
    this.npezzi_c2 = 0
    this.cart.products.forEach(p => {
      if(p.type_plate == 1){
        this.npezzi_c1 += (p.counter * p.slot_plate) 
      }else if(p.type_plate == 2) {
        this.npezzi_c2 += (p.counter * p.slot_plate) 
      }
    });    
  },
  getTotCart(){
    this.cart.totprice = 0
    this.cart.products.forEach(e => {
      this.cart.totprice += e.price
    });
    this.saveCart();
  },
  saveCart(){
    const newcart = JSON.stringify(this.cart);
    localStorage.setItem('npezzi_c1', this.npezzi_c1);
    localStorage.setItem('npezzi_c2', this.npezzi_c2);
    localStorage.setItem('cart', newcart);
  },
  async getSetting() {
    const settings = await axios.get(this.baseUrl + "api/setting", {});
    this.settings = settings.data.results;
    this.orari_aperture = this.settings[3].property;
    this.position = this.settings[4].property;
    this.contact = this.settings[5].property;

    this.ferie = this.settings[2].property;
    this.ferie.status = this.settings[2].status;
  },
  getImage(img){
    if (img !== null) {
      let link = 'background-image: url(' + this.getImageUrl(img) + ')'
      return link
    }else{
      let link = 'background-image: url(' + this.domain + '/img/default.png' + ')'
      return link
    }
    
  },

  //---3-Dati Prenotazioni








  //---4-Dati Ordini






  //---5-Gestione Carrello

  //-----5-a-Dati Carrello

  //-----5-b-Funzioni Carrello



});

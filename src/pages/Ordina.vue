<script>
  import { state } from "../state.js";
  import axios from "axios";
  import AppMessage from "../components/Message.vue";
  export default {
    components: { AppMessage },

    data() {
      return {
        state,
        cartOpen: false,
        products: [],
        allergens: [],
        ingredients: [],
        options: [],
        categories: [],
        openCategory: false,
        category: {
          id : '0',
          name : 'Tutti',
          icon : ''                                                                                 
        },
        selectedItem: {
          opened: false,
          x_: false,

          x_opt: true,
          x_ext: false,
          x_ing: false,
          x_details: false,

          image: '',
          id: '',
          name: '',
          price: 0,
          image: '',
          description: '',
          category_name: '',
          ingredients: [],
          allergens: [],
          special: [],
          
          options: [],
          add: [],
          removed: [],
          extra_price: 0,
          counter: 1,
          category_id: 0,
          
          type_plate: 0,
          slot_plate: 0,
          tag_set: 0,

        },
      };
    },
    methods:{
      goCheckOut(){
        this.state.checkOut_t = 2
        localStorage.setItem('checkOut_t', this.state.checkOut_t);
        console.log(state.cart.products)
        this.$router.replace("/check-out")
      },


      editProd(a_r, type, ing, si){
        //console.log(ing)
        let checkRicalcolo = false
        this.state.cart.products.forEach(e => {
          if(si === e){
            checkRicalcolo = true
          }
        });
        if (type == 'add') {
          if(a_r){
            si.price = (si.counter * ing.price) + si.price
            si.add.push(ing)
          }else{
            si.price = si.price - (si.counter * ing.price)
            let newarr = []
            si.add.forEach(e => {
              if( e.name !== ing.name){
                newarr.push(e)
              }
            }); 
            si.add = newarr
          }    
        }else if(type == 'rem'){
          if(a_r){
            si.removed.push(ing)
          }else{
            let newarr = []
            si.removed.forEach(e => {
              if( e.name !== ing.name){
                newarr.push(e)
              }
            }); 
            si.removed = newarr
          }    
        }else if(type == 'opt'){
          if(a_r){
            si.options.push(ing)
            si.price = (si.counter * ing.price) + si.price
          }else{
            si.price = si.price - (si.counter * ing.price)
            let newarr = []
            si.options.forEach(e => {
              if( e.name !== ing.name){
                newarr.push(e)
              }
            }); 
            si.options = newarr 
          }    
        }
        if(checkRicalcolo){
          const newproducts = this.state.cart.products
          this.state.cart.products = []
          newproducts.forEach(element => {
            this.addToCart(element)
          });
        }
      },
      classIng(type, i){
        let check = false
        if (type == 'add') {
          this.selectedItem.add.forEach(e => {
            if(e.name == i.name){ 
                check = true;
                  return
              }
          })  
        }else if(type == 'rem'){
          this.selectedItem.removed.forEach(e => {
            if(e.name == i.name){ 
                check = true;
                  return
              }
          })     
        }else if(type == 'opt'){
          this.selectedItem.options.forEach(e => {
            if(e.name == i.name){ 
                check = true;
                  return
              }
          })  
        }
       
        return check

      },

      addToCart(si){
        let itemCart = {
          id : si.id,
          name : si.name,
          counter : si.counter,
          options : si.options,
          add : si.add,
          removed : si.removed,
          type_plate : si.type_plate,
          slot_plate : si.slot_plate,
          price : si.price,
        }
        console.log(itemCart)
        
        let check = this.checkProd(itemCart)
        if (check == 0) {
          this.state.cart.products.push(itemCart)
        }else{
          this.state.cart.products.forEach(e => {
            if(e.name == check.name && e.options == check.options && e.add == check.add && e.removed == check.removed){
              e.counter = itemCart.counter + e.counter
              e.price = itemCart.price + e.price
            }
          });
        }
        this.state.getTotCart()
        this.closeShow(this.selectedItem) 
        console.log(this.state.cart.products)
        this.state.setNpezzi()
        console.log(this.state.npezzi_c1)
        console.log(this.state.npezzi_c2)
      },
      checkProd(i){
        let marstercheck = 0;
        let p = 0;
        this.state.cart.products.forEach(e => {
          if((i.name == e.name) && (i.add.length == e.add.length) && (i.options.length == e.options.length) && (i.removed.length == e.removed.length)){
            let check = 0
            let sumcheck = 0

            console.log('forse uguale')


            i.add.forEach(ia => {
              e.add.forEach(ea => {
                if(ia.name == ea.name){
                  check ++
                }
              });
            });
            if(i.add.length !== check){
              sumcheck ++
            }

            check = 0
            i.options.forEach(ia => {
              e.options.forEach(ea => {
                if(ia.name == ea.name){
                  check ++
                }
              });
            });
            if(i.options.length !== check){
              sumcheck ++
            }

            check = 0
            i.removed.forEach(ia => {
              e.removed.forEach(ea => {
                if(ia.name == ea.name){
                  check ++
                }
              });
            });
            if(i.removed.length !== check){
              sumcheck ++
            }

            console.log('sumcheck: ' + sumcheck)
            if(sumcheck == 0){
              p = e
              console.log(e)
              return;
              
            }
            console.log('diverso')
            return 0;
          }
          
          
        });
        // console.log('fa il cazzo che gli pare')
        if (p !== 0) {
          return p
        }
        return 0;
      },
      

      removeItem(p){
        this.state.cart.products.splice(p, 1)
        if(this.state.cart.products.length == 0){
          this.cartOpen = false
        }
        this.state.getTotCart()
      },

      modCounter(a_r, si){
        if(!a_r && si.counter > 1){
          si.price = (si.price / si.counter) * (si.counter-1)
          si.counter --
        }else if(a_r){
          
          si.price = (si.price / si.counter) * (si.counter+1)
          si.counter ++
        }
      },

      openCart(){
        this.cartOpen = !this.cartOpen
      },
      //gestione show prodotto
      open_x(n, catId, option){
        let oc = false;
        if(n == 1){
          this.selectedItem.x_opt = !this.selectedItem.x_opt 
          if (this.selectedItem.x_opt) {
            this.selectedItem.x_=true; oc = true
          }else{
            this.selectedItem.x_=false
          }
          this.selectedItem.x_details = false 
          this.selectedItem.x_ext = false 
          this.selectedItem.x_ing = false 
        } else if(n==2){
          this.selectedItem.x_ext = !this.selectedItem.x_ext 
          if (this.selectedItem.x_ext) {
            this.selectedItem.x_=true; oc = true
          }else{
            this.selectedItem.x_=false
          }
          this.selectedItem.x_details = false 
          this.selectedItem.x_ing = false                       
          this.selectedItem.x_opt = false 
        } else if(n==3){
          this.selectedItem.x_ing = !this.selectedItem.x_ing 
          if (this.selectedItem.x_ing) {
            this.selectedItem.x_=true;
          }else{
            this.selectedItem.x_=false
          }
          this.selectedItem.x_details = false 
          this.selectedItem.x_ext = false 
          this.selectedItem.x_opt = false 
        }
         else if(n==4){
           this.selectedItem.x_details = !this.selectedItem.x_details 
          if (this.selectedItem.x_details) {
            this.selectedItem.x_=true;
          }else{
            this.selectedItem.x_=false
          } 
          this.selectedItem.x_ing = false 
          this.selectedItem.x_ext = false 
          this.selectedItem.x_opt = false 
        }
        
      },
      async openShow(p, si){
        if(this.cartOpen){
          return
        }
        if(this.selectedItem.opened){
          return
        }
        this.ingredients = []
        si.opened = true

        si.id = p.id
        si.name = p.name
        si.image = p.image
        si.description = p.description
        si.price = p.price
        si.special = p.special
        si.ingredients = p.ingredients
        si.allergens = p.allergens
        
        si.category_name = p.category.name
        si.category_id = p.category.id
        
        si.tag_set = p.tag_set
        si.slot_plate = p.slot_plate
        si.type_plate = p.type_plate
        si.x_ing = false 
        si.x_ext = false 
        si.x_details = false 
        //metto allergeni giusti negli ingredienti del prodotto
        si.ingredients.forEach(e => {
          let oldallergens = []
          if (typeof e.allergens === 'string'){
            oldallergens = JSON.parse(e.allergens)
          }else{ 
            oldallergens = e.allergens
          }
          e.allergens = []
          e.special = []
          let newallergens = oldallergens.map(p => this.allergens[p])
          for (let i = 0; i < newallergens.length; i++) {
            let el = newallergens[i];
            if(el.special == 0){
              e.allergens.push(el)
            }else{
              e.special.push(el)
            }       
          }
        });

        if(si.tag_set >= 2){
          // se si puo aggiungiere chiedo e imposto le options
          let options = await axios.get(state.baseUrl + "api/getIngredient", {
					params: {
						category: p.category.id,
						option: 'yes',
				  }})
          this.options = options.data.results
          this.options.forEach(e => {    
            let oldallergens = JSON.parse(e.allergens, true)
            e.allergens = []
            e.special = []
            let newallergens = oldallergens.map(p => this.allergens[p])
            for (let i = 0; i < newallergens.length; i++) {
              let el = newallergens[i];
              if(el.special == 0){
                e.allergens.push(el)
              }else{
                e.special.push(el)
              }       
            }
          })
          let ingredients = await axios.get(state.baseUrl + "api/getIngredient", {
            params: {
              category: p.category_id,
              option: '0',
          }})
          this.ingredients = ingredients.data.results
          this.ingredients.forEach(e => {
            let oldallergens = JSON.parse(e.allergens, true)
            e.allergens = []
            e.special = []
            let newallergens = oldallergens.map(p => this.allergens[p])
            for (let i = 0; i < newallergens.length; i++) {
              let el = newallergens[i];
              if(el.special == 0){
                e.allergens.push(el)
              }else{
                e.special.push(el)
              }       
            }
          });
        }
        if(si.tag_set == 1 && this.selectedItem.ingredients.length !== 0 ){
            si.x_ = true 
            si.x_ing = true 
          }else if(si.tag_set > 1 && this.options.length !== 0 ){
            si.x_ = true 
            si.x_opt = true 
          }else if(si.tag_set > 1 && this.ingredients.length !== 0 ){
            si.x_ = true 
            si.x_ext = true 
          }
      },
      closeShow(si){
        si.opened = false
        si.name = ''
        si.image = ''
        si.description = ''
        si.price = 0
        si.counter = 1
        si.id = ''
        si.ingredients = []
        si.removed = []
        si.options = []
        si.add = []
        si.allergens = []
        si.special = []
        si.type_plate = 0
        si.tag_set = 0
        si.x_ = false
        si.x_opt = false
        si.x_ext = false
        si.x_ing = false
        si.x_details = false
        this.ingredients = []
        this.getProduct(this.category.id)
      },
      //funzioni per testo ingredienti
      capitalizeFirstLetter(string) {
        if (typeof string !== 'string' || string.length === 0) {
          return string; // Gestisce il caso in cui l'input non è una stringa o è una stringa vuota
        }
        
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      },
      fixtag(arr){
        let arrtag='';
        arr.forEach((element, i) => {
          if( i+1 ==arr.length){  
            arrtag = arrtag + element.name + '.'
          }else{
            arrtag = arrtag + element.name + ', '
            if(i == 0){
              arrtag = this.capitalizeFirstLetter(arrtag)
            }
            
          }
        });
        return arrtag
      },
      //filtraggio ingredienti
      async getProduct(c_Id){
        this.openCategory = false
        this.products = []
        this.allergens = []
        let products = await axios.get(state.baseUrl + "api/products", {
        params: {
          category: c_Id,
        }})
        this.products = products.data.results
        this.allergens = products.data.allergens
        this.categories.forEach(c => {
          if(c.id == c_Id){
            this.category = c
          }else if(c_Id == null){
            this.category= {
              'id' : '0',
              'name': 'Tutti',
              'icon' : ''                                                                                 
            }
          }
        });
        this.products.forEach(e => {         
          e.special = []
          let oldallergens = JSON.parse(e.allergens, true)
          e.allergens = []
          let newallergens = oldallergens.map(p => this.allergens[p])
          for (let i = 0; i < newallergens.length; i++) {
            let el = newallergens[i];
            if(el.special == 0){
              e.allergens.push(el)
            }else{
              e.special.push(el)
            }       
          }
        });  
      }
    },
    async mounted() {
      
      const categories = await axios.get(state.baseUrl + "api/categories", {})
      this.categories = categories.data.results
      this.categories.shift()

      this.getProduct(0);
      const cart = localStorage.getItem('cart');
      if (cart) {
        this.state.cart = JSON.parse(cart);
      } 
     
    },
    created(){
      this.state.getSetting(); 
    }
  };
</script>

<template>
  <div class="container-m" :class="openCategory ? 'container-m-over' : ''" :style="openCategory ? 'overflow: hidden !important' : ''">
    <AppMessage  />
    <div class="top-c" v-if="!state.navMobile && !selectedItem.opened && !cartOpen">
      <h1 v-if="!openCategory" >Ordina</h1>
      <div class=""  :class="openCategory ? 'category-on' : 'category'">
        <div class="body" @click="openCategory = !openCategory">
          <p class="cat_active"><span>{{ category.name }}</span> - Scegli la categoria</p>
        </div>
        <div class="cont">
          <div class="head">
            <h3>Scegli una categoria</h3>
            <img class="close" @click="openCategory = false" src="../../public/img/close-x.png" >
          </div>
          <div class="cat-cont">
            <div @click="getProduct(null)" class="tutti">Tutti</div>
            <div @click="getProduct(c.id)" v-for="c in categories" :key="c.id" >{{ c.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <h2>Categoria : {{category.name}}</h2>
    <div class="cont-p" >
      <div class="product-card" v-for="p in products" :key="p.id" @click="openShow(p, selectedItem)">
        <div class="image-cont" :style="state.getImage(p.image)">
          <div class="allergens">
            <img  v-for="a in p.special" :key="a.name" :src="a.img" alt="">
          </div>
        </div>
        <div class="text">
          <h3>{{ p.name }}</h3>
          <p class="description">
            {{ fixtag(p.ingredients) }}
          </p>
          
        </div>
        <p class="price">€ {{ p.price / 100 }}</p>
      </div>

    </div>


    <div :class="!selectedItem.opened ? 'show-p' : 'show-p show-p-active'">
      <div class="show-close" @click="closeShow(selectedItem)">torna al menu</div>
      <div class="image-c" :style="state.getImage(selectedItem.image)">
        <h3>{{ selectedItem.name }}</h3>
        <div class="bottom">
          <div class="allergens">
            <img v-for="a in selectedItem.special" :key="a.name" :src="a.img" >
          </div>
          <span>{{ selectedItem.category_name }}</span>
        </div>
      </div>
      <div class="center-scroll">
        <div class="sect" v-if="(!selectedItem.x_ || selectedItem.x_opt) && (selectedItem.tag_set > 1 && options.length !== 0)">
          <div @click="open_x(1, selectedItem.category_id, 'yes')" :class="selectedItem.x_opt ? 'closer' : ''" class="head">
            <div class="name">Scegli le opzioni</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="opener bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </div>
          <div v-if="selectedItem.x_opt" class="body">
            <div class="ing" v-for="i in options" :key="i.name">
               <div v-if="classIng('opt',i)" @click="editProd(0,'opt', i, selectedItem)" class="active">
                  <div class="name">{{ i.name }}</div>
                  <div class="allergens">
                    <img v-for="a in i.special" :key="a.name" :src="a.img" >
                  </div>
                  <div class="price">+ €{{ i.price  / 100}}</div>
               </div>

               <div v-else @click="editProd(1,'opt', i, selectedItem)" class="not_act">
                  <div class="name">{{ i.name }}</div>
                  <div class="allergens">
                    <img v-for="a in i.special" :key="a.name" :src="a.img" >
                  </div>
                  <div class="price">+ €{{ i.price  / 100}}</div>
               </div>
            </div>
          </div>
          
        </div>
        <div class="sect" v-if="(!selectedItem.x_ || selectedItem.x_ext) && (selectedItem.tag_set > 1 && ingredients.length !== 0)">
          <div @click="open_x(2, selectedItem.category_id, false)" :class="selectedItem.x_ext ? 'closer' : ''" class="head">
            <div class="name">Aggiungi ingredienti</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="opener bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </div>
          <div v-if="selectedItem.x_ext" class="body">
            <div class="ing" v-for="i in ingredients" :key="i.name">
               <div v-if="classIng('add',i)" @click="editProd(0,'add', i, selectedItem)" class="active">
                  <div class="name">{{ i.name }}</div>
                  <div class="allergens">
                    <img v-for="a in i.special" :key="a.name" :src="a.img" >
                  </div>
                  <div class="price">+ €{{ i.price  / 100}}</div>
               </div>

               <div v-else @click="editProd(1,'add', i, selectedItem)" class="not_act">
                  <div class="name">{{ i.name }}</div>
                  <div class="allergens">
                    <img v-for="a in i.special" :key="a.name" :src="a.img" >
                  </div>
                  <div class="price">+ €{{ i.price  / 100}}</div>
               </div>
            </div>
          </div>

          
        </div>
        <div class="sect" v-if="(!selectedItem.x_ || selectedItem.x_ing && selectedItem.ingredients.length !== 0)  && (selectedItem.tag_set == 1 || selectedItem.tag_set == 3)" >
          <div @click="open_x(3, selectedItem.category_id, false)" :class="selectedItem.x_ing ? 'closer' : ''" class="head">
            <div class="name">Rimuovi ingredienti</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="opener bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </div>
          <div v-if="selectedItem.x_ing" class="body">
            <div class="ing" v-for="i in selectedItem.ingredients" :key="i.name">
               <div v-if="!classIng('rem',i)" @click="editProd(1,'rem', i, selectedItem)" class="active">
                  <div class="name">{{ i.name }}</div>
                  <div class="allergens">
                    <img v-for="a in i.special" :key="a.name" :src="a.img" >
                  </div>
               </div>

               <div v-else @click="editProd(0,'rem', i, selectedItem)" class="not_act">
                  <div class="name">{{ i.name }}</div>
                  <div class="allergens">
                    <img v-for="a in i.special" :key="a.name" :src="a.img" >
                  </div>
               </div>
            </div>
          </div>
        </div>
        <div class="sect" v-if="!selectedItem.x_ || selectedItem.x_details">
          <div @click="open_x(4, selectedItem.category_id, false)" :class="selectedItem.x_details ? 'closer' : ''" class="head">
            <div class="name">Descrizione e allergeni</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="opener bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </div>
          <div v-if="selectedItem.x_details" class="body allergens">
            <p>{{ selectedItem.description }}</p>
            <div class="al-c">
              <img  v-for="a in selectedItem.allergens" :key="a.name" :src="a.img" alt="">
            </div>
            <p v-if="selectedItem.allergens.length == 0" >Nessun allergene presente.</p>
          </div>
        </div>

      </div>

      <div class="bottom-bar">
        <div @click="addToCart(selectedItem)" class="btn_3">Aggiungi al carrello</div>
        <div class="counter">
          <div @click="modCounter(0, selectedItem)" class="cell minus">-</div>
          <h4>{{ selectedItem.counter }}</h4>
          <div @click="modCounter(1, selectedItem)" class="cell plus">+</div>

        </div>
        <div class="price">€{{( selectedItem.price) / 100 }}</div>
      </div>
      
    </div>
    <div class="cart-c" v-if="state.cart.products.length !==0">
      <div v-if="!cartOpen" @click="goCheckOut" class="next btn_3">Completa Ordine</div>
      <div v-if="!cartOpen" class="cart" @click="openCart">
        <h3>CARRELLO</h3>
        <span>{{ state.cart.products.length }}</span>
        <p>Totale: € {{ state.cart.totprice / 100}}</p>
      </div>
      <div v-if="cartOpen" class="show-c"  >
        <div class="top-c"><h3>Prodotti:</h3>
          <img class="close" @click="openCart" src="../../public/img/close-x.png" alt=""></div>
        <div class="prod-c">
          <div v-for="(p, i) in state.cart.products" :key="p.id" class="prod">
            <div class="head">
              <span class="count">
                * {{ p.counter }}
              </span>
              <span>{{ p.name }}</span>
              <span class="price">€{{ p.price / 100}}</span>
              <span @click="removeItem(i)" class="mod">Rimuovi</span>
            </div>
            <div class="body">
              <div class="top" v-if="p.options.length !== 0">
                Opzioni:
                <span @click="editProd(0, 'opt', i, p)" v-for="i in p.options" :key="i.name">{{ i.name }},</span>
              </div>
              <div class="bottom"  v-if="p.add.length !== 0">
                <span @click="editProd(0, 'add', i, p)" v-for="i in p.add" :key="i.name">+ {{ i.name }}</span>
              </div>
              <div class="bottom"  v-if="p.removed.length !== 0">
                <span @click="editProd(0, 'rem', i, p)" v-for="i in p.removed" :key="i.name">- {{ i.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-c">
          <div @click="goCheckOut" class="next btn_3">Completa Ordine</div>
          <p>Totale: <strong>€ {{ state.cart.totprice / 100 }}</strong> </p>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped lang="scss">
@use "../assets/styles/general.scss" as *;


.show-p{
  // .center-scroll{
  //   overflow: scroll;
  //   height: 100%;
  // }
  .body{
    display: flex;
    flex-direction: column;
    gap: .4rem;
    overflow: auto !important;
    max-height: 25vh !important;
    .ing{
      .active, .not_act{
        background-color: $c2;
        padding: 0 0 0 5%;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        //align-items: center;
        gap: 1rem;
        //overflow: hidden;
      }
      .not_act{
        opacity: .3;
      }
      .allergens{
        flex-shrink: 0.5;
        padding:  0.4rem 3px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        flex-grow: 1;

        img{
          width:30px;
        }
      }
      .name{
        flex-shrink: 1;
        flex-grow: 1;
        padding: 0.2rem 0;
        font-size: $fs_sm;
      }
      .price{
        flex-shrink: 0;
        width: 20%;
        text-align: center;
        font-size: $fs_md;
        padding: .5rem;
        background-color: $c4;
        border-top-right-radius:10px ;
        border-bottom-right-radius:10px ;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .al-c{
      width: 100%;
      display: flex;
      gap: 5px;
      justify-content: center;
    }
  }
  
  .bottom-bar{
    //position: relative;
    .price{
      font-size: $fs_xlg;
    }
    .counter{
      
      display: flex;
      gap: 1rem;
      align-items: center;
      .cell, h4{
        border: none;
        height: 40px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: $fs_lg;
      }
      .cell{
        width: 40px;
        background-color: $c7;
        color: $c5;
        transition: all .2s ease-in-out;
      }
      .cell:hover{
        scale: .9;
        background-color: $c5;
        color: $c2;
        transition: all .2s ease-in-out;
        
      }
    }
  }
}

.show-c{
  width: 90%;
  margin: 10px auto;
  background:linear-gradient($c2 70%, $c1 95%) ;
  border: 2px solid $c7;
  .prod-c{
    
    background-color: $c4;
  }
  .close{
    width: 30px;
  }
}

  .cart{
   // box-shadow: 0 0 12px rgba(0, 0, 0, 0.43);
    //box-shadow: 0 0 10px rgba(0, 0, 0, 0.389), inset 0 0 20px $c2;
    border:  2px solid $c7;
    position: relative;
    background-color: $c-nav !important;
    height: auto !important;
    width: auto !important;
    padding: .6rem 2.6rem .6rem 1.5rem!important;
    border-radius: 12px;
    align-items: flex-start !important;
    font-size: $fs_sm;
    p{
      font-size: $fs_xsm;
      
    }
    h3{
      font-size: $fs_md;
      display: block;
    }
    span{
      font-size: $fs_xsm;
      border-bottom-left-radius: 6px !important;
      border-bottom-right-radius: 6px !important;
      //border-radius: 10px!important;
      padding: 4px !important;
      position: absolute !important;
      top: 0;
      right: 10px;
    }
}
@media (min-width:$bp_sm) {
  .cart-c{
    bottom: 80px !important;
  }
}

</style>

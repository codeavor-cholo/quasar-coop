<template>
  <q-layout>

    <div class="q-pa-md">
      <q-carousel
        arrows
        animated
        infinite
        v-model="slide"
        height="400px"
        >

        <q-carousel-slide 
          v-for="item in carouselslide" 
          :key="item.name"
          :name="item.name" 
          :img-src="item.image"
          >
            
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">{{ item.title }}</div>
            <div class="text-subtitle1">{{ item.subtext }}</div>
          </div>
        </q-carousel-slide>  
      </q-carousel>
    </div>

    <div class="q-pa-md doc-container">
      <div class="row">
        <div 
          class="col-xs-12 col-sm-6 col-md-3 q-pa-md"
          v-for="card in cards"
          :key="card.title"
          >

          <q-card
          class="my-card text-white"
          style="background-image: linear-gradient(#0ba360 100%, #3cba92 0%); height: 300px; opacity: 0.9;"
          inline
          >
           
              <q-card-section>
                 <q-icon style="font-size: 4.4em;" :name="card.icon" class="full-width"/>
                  <div class="text-h6 text-center">{{card.title}}</div>
              </q-card-section>

              <q-card-section class="q-pt-none text-center text-justify">
                {{ card.desc }}
              </q-card-section>
          </q-card>
        </div>
      </div>    
    </div> 

    <div>
      <div class = "col-xs-12 col-sm-6 col-md-4 q-pa-md" >
            <q-card class="q-pa-md doc-container">
              <q-card-section>
                  <div class="text-h6">New GSIS Transport Service Cooperative</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                  <div class="text-subtitle2">"Earn the Cooperative Way"</div>
              </q-card-section>
              
               <q-video
                :ratio="16/9"
                src="https://www.youtube.com/embed/G3v1Gnr5V1o"
              />
            </q-card>
        </div>      
      </div>

    <div>
      <q-parallax
      :height="400" :speed="0.5"
      src="https://i.ibb.co/6rQ9Vz0/46756794-313910292539323-4635071982210121728-o.jpg"
      >
      <div class = "col-xs-12 col-sm-6 col-md-6 q-pa-md">
            <q-card class="q-pa-md doc-container" style="opacity: 0.7;">
              <q-card-section>
                  <div class="text-h6">New GSIS Transport Cooperative</div>
              </q-card-section>
            
              <q-card-section class="q-pt-none text-center text-justify">
                <div class="text-subtitle2">We are New GSIS Transport Cooperative. 
                    Our Cooperative is duly registered with the Cooperative Development Authority (CDA), 
                    the regulatory agency of the Government of the Republic of the Philippines
                     over matters concerning the development of cooperatives in the country.
              </div>
              </q-card-section>
            </q-card>
      </div>
      </q-parallax>      
    </div>

  </q-layout>
</template>  

<script>
const cards =  [
{
  icon: 'mdi-piggy-bank', 
  title: 'Savings', 
  link: '/about',
  desc: 'Members can deposit their savings in the cooperative, in any amount they desire. It can be withdrawn anytime.'
},
{
  icon: 'mdi-credit-card-clock', 
  title: 'Cash Advances', 
  link: '/services',
  desc: 'Members are allowed to withdraw parts of their share-capital. In case of emergency members can opt to withdraw even if they have outstanding balances. '
},
{
  icon: 'mdi-gift', 
  title: 'Benefits', 
  link: '/services',
  desc: 'Members are rewarded with various benefits, including monetary assistance on License Renewal and emergencies, documentary assistance on franchise renewals and groceries on holidays.'
},
{
  icon: 'mdi-account-cash',
  title: 'Account Inquiry',
  link: '/login',
  desc: 'Members are rewarded with various benefits, including monetary assistance on License Renewal and emergencies, documentary assistance on franchise renewals and groceries on holidays.'
}
]

export default {
  data () {
    return {
      slide: "first",
      step: 1,
      lorem: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Accusamus autem ratione animi aut quidem ducimus quo. Necessitatibus dicta porro in maiores. Voluptatem rem vel voluptatum vitae harum dolorum dignissimos eaque?',
      cards,
      carouselslide: [
          {
            name:'first', 
            image:'http://tempo.com.ph/wp-content/uploads/2018/08/fuel-cards.jpg',
            title:'Pantawid Pasada', 
            subtext:'You can claim your cards now'
          },
          {
            name:'second', 
            image:'https://businessmirror.com.ph/wp-content/uploads/2018/06/top02-061918.jpg',
            title:'PUV Modernization', 
            subtext:'The future of transportation'
          }
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .5)
</style>
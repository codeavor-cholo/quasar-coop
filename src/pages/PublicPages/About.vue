<template>
<div>
    <div class="q-pa-md">
        <q-card class="my-card">
            <q-card-section class="text-teal text-uppercase text-h3">About us
            </q-card-section>
            <q-separator/>
            <q-card-section class="line-height">
                    <q-carousel
                        class="aboutus"
                        animated
                        v-model="slide"
                        navigation
                        infinite
                        autoplay
                        arrows
                        :fullscreen.sync="fullscreen"
                        transition-prev="slide-right"
                        transition-next="slide-left"
                        >
                        <q-carousel-slide :name="1" img-src="../../statics/icons/BarangayGsis.jpg" />
                        <q-carousel-slide :name="2" img-src="../../statics/icons/Jeep.jpg" />
                        <q-carousel-slide :name="3" img-src="../../statics/icons/Jeep2.jpg" />
                        <q-carousel-slide :name="4" img-src="../../statics/icons/Jeep3.jpg" />

                    </q-carousel>
                <q-separator/>
                <div class="text-h6 q-pa-md text-teal-4">
                    NEW GSIS COOPEARATIVE PROVIDE THE 
                    SERVICES OF TRANSPORT TO ITS MEMBER AT LOWER RATES.  
                    THE COOPERATIVES MAY BE ORGANIZED TO MEET THE DEMAND FOR SERVICES IN 
                    LOWER-DENSITY RURAL AREAS, OR IN AREAS THAT CROSS GEOGRAPHIC JURISDICTIONAL BOUNDARIES
                </div>
           <q-separator inset />
          <div class="text-teal text-h5 q-pa-md">CONTACT</div>
          
                <div class="text-h6 q-mr-md">
                  <div class="text-h6 text-teal-4 q-ml-lg">Address <br>
                        - # 65-C Shorthorn St, Project 8, Quezon City, 1106 Metro Manila</div>
                  <div class="text-h6 text-teal-4 q-ml-lg">Phone <br>
                        - Phone: (02) 3454 7314</div>
           </div>
            </q-card-section>
        </q-card>
    </div>
</div>
</template>  
<script>
export default {
    data() {
        return {
            slide: 1,
            fullscreen: false,
        }
    },
}
</script>
<style scoped>
.line-height {
    line-height: 20px;
}
.aboutus{
    height: 800px;
}
</style>
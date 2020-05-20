<template>
  <div>
    <q-card class="my-card" flat bordered>
      
      <q-card-section horizontal id="idpage">
      <div class="id-card-tag"></div>
        <div class="id-card-tag-strip"></div>
        <div class="id-card-hook"></div>
        <div class="id-card-holder">
          <div class="id-card">
            <div class="header">
                  <strong>New GSIS Transport Service Cooperative</strong>
            </div>
            <div class="photo">
                  <img
                  style="height:80px; width:80px; border-radius: 50%;"
                  class="rounded-borders"
                  :src="MemberData.imageUrlPro"
                  />
            </div>
            <strong>{{MemberData.FirstName +' '+ MemberData.LastName }}</strong>
            <br>
            {{ penRegId }}
            <div class="qr-code">
                <qrcode :value="qrvalue" tag="img"></qrcode>
            </div>
            <h3>www.newgsistsc.com</h3>
            <hr>
            <p><strong>"PENGG"</strong>HOUSE,4th Floor, TC 11/729(4), Division Office Road <p>
            <p>Near PMG Junction, Thiruvananthapuram Kerala, India <strong>695033</strong></p>
            <p>Ph: 9446062493 | E-ail: info@onetikk.info</p>
        </div>
	    </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <!-- <q-btn color="secondary" class="full-width" @click="printDiv('idpage')">
          Print
        </q-btn> -->
        <q-btn class="full-width" icon="print" color="secondary" v-print="'#idpage'">Print</q-btn>        
      </q-card-actions>

    </q-card>
  </div>
</template>
<script>
import { firebaseDb } from 'boot/firebase'
import Vue from 'vue'
import Print from 'vue-print-nb'
import VueQrcode from '@chenfengyuan/vue-qrcode'


Vue.use(Print)

// Vue.component(VueQrcode.name, VueQrcode);

export default {
  components: {
    VueQrcode
  },
  props: {
    qrvalue: {
      type: String,
      required: true,
      default: ''
    },
    penRegId: {
      type: String,
      required: true,
      default: ''
    },
    MemberData: {
      type: Object,
      required: true,
      default: () => {
        return {
          imageUrlPro: '',
          FirstName: '',
          LastName: '',
        }
      }
    }
  },
  firestore () {
    return {
      Units: firebaseDb.collection('Units')
    }
  },
  data () {
    return {
      // qrvalue: ''
    }
  },
  methods: {
    
  }
}
</script>
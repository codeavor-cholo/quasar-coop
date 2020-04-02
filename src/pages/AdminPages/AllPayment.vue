<template>
<div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Payment<q-icon name="mdi-arrow-right-box" /> All Payment</h6>
          <q-input class="q-ma-md" @input="QueryDate();" v-model="date" outlined type="date" hint="Native date" />

    <q-separator />
      <!-- <div v-if="loading">
        <q-spinner-oval
        color="teal"
        size="200px"
        :thickness="5"
        class="fixed-center"
        />
      </div> -->
    <div class="q-pa-md col-xs-12 col-sm-12 col-md-12">
      <q-markup-table separator="horizontal" flat bordered>
      <template>
        <thead color="secondary">
          <tr>
            <th class="text-left">MemberID</th>
            <th class="text-left">TransactionID</th>
            <th class="text-left">OrNo</th>
            <th class="text-left">Total</th>
            <th class="text-left">Timestamp</th>
            <th class="text-left"></th>
          </tr>
        </thead>
      </template>
      <template>
        <div v-if="loading">
        <q-spinner-oval
        color="teal"
        :thickness="5"
        class="fixed-center"
        size="3em"
        />
      </div>
        <tbody v-else>
          <tr v-for="(data, id) in Transactions" :key="id">
            <td class="text-left">{{data.MemberID}}</td>
            <td class="text-left">{{data.TransactionID}}</td>
            <td class="text-left">{{data.OrNo}}</td>
            <td class="text-left">{{data.Total}}</td>
            <td class="text-left">{{data.timestamp.toDate()}}</td>

            <td class="text-left">
              <q-btn flat 
              color="secondary"
              icon-right="mdi-arrow-right" 
              label="View Receipt" 
              />
            </td>
          </tr>
        </tbody>
      </template>
      </q-markup-table>
    </div>
    </div>
</template>

<script>
import { firebaseDb } from 'boot/firebase';

export default {
  data () {
    return {
      loading: false,
      datetodaydata: '',
      date:'',      
      Transactions: {}
    }
  },
  firestore () {
        return {
            // Doc
            Transactions: firebaseDb.collection('Transactions')
        }
      },
  methods: {
    QueryDate(){
      this.loading = true
        var dt = this.date.toString()
        var TransactionData = {}
        this.$firestore.Transactions.doc(dt).collection("Payment")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                TransactionData[doc.id] = doc.data();
                // console.log(doc.id, " => ", doc.data());
            })
        })
        .then(() => {
          this.Transactions = TransactionData
          this.loading = false
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
    },
    datetoday(){
        var myDate = new Date();
        var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
        var date = ('0' + myDate.getDate()).slice(-2);
        var year = myDate.getFullYear();
        var formattedDate = year + '-' + month + '-' + date;
        this.datetodaydata = formattedDate;
    },

  },
  mounted () {
      this.datetoday()
      // this.date = this.datetodaydata
      // // Binding Collections
      // this.$bindCollectionAsObject("Transactions", firebaseDb.collection('Transactions').doc(this.datetodaydata).collection('Payment'))
      // .then((Transactions) => {
      //   this.loading = false
      // })
    },
    computed: {

    }
     
    
}
</script>

<style scoped>
.q-field{
  width: 205px;
}
</style>
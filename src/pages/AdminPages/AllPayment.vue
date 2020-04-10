<template>
<div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Payment<q-icon name="mdi-arrow-right-box" /> All Payment</h6>
          <!-- <q-input class="q-ma-md" @input="QueryDate();" v-model="date" outlined type="date" hint="Native date" /> -->
          <div class="q-ma-md">
            <q-input filled v-model="dateToday" mask="date" :rules="['date']">
               <template v-slot:append>
                 <q-icon name="event" class="cursor-pointer">
                   <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                     <q-date v-model="dateToday" @input="onChangeDate" :options="optionsFn"/>
                   </q-popup-proxy>
                 </q-icon>
               </template>
             </q-input>
             <!-- <q-btn label="test" @click="test"/> -->
          </div>


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
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: true,
      datetodaydata: '',
      date:'',
      Transactions: {},
      dateToday: '2019/02/01'
    }
  },
  firestore () {
        return {
            // Doc
            lastTransaction: firebaseDb.collection('Transactions').orderBy('timestamp', 'asc').limit(1),
            firstTransaction: firebaseDb.collection('Transactions').orderBy('timestamp', 'desc').limit(1)
        }
      },
  methods: {

    test () {
      var dateParam = 'Fri Apr 10 2020 00:00:00 GMT+0800 (Philippine Standard Time)'

      let dateChange = new Date(this.dateToday)
      console.log(dateChange)
      // let dateVal = new Date(dateParam)
      // console.log(dateVal, 'date')
      // var month = ('0' + (dateVal.getMonth() + 1)).slice(-2);
      // var date = ('0' + dateVal.getDate()).slice(-2);
      // var year = dateVal.getFullYear();
      // var formattedDate = year + '-' + month + '-' + date;
      // console.log(formattedDate, 'formattedDate')
    },
    async onChangeDate (val) {
      this.$refs.qDateProxy.hide() // default

      let dateChangeStart = new Date(val)
      let dateChangeEnd = new Date(val)
      dateChangeEnd.setHours(23, 59, 59, 999)

      let dataTransactions = []
      let query = firebaseDb.collection('Transactions')
                  .where('timestamp', '>', dateChangeStart)
                  .where('timestamp', '<', dateChangeEnd)
                  .where('TransactionType', '==', 'Payment')

      await query.get().then(snapshot => {
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            dataTransactions.push({
              ['.key']: doc.id,
              ...doc.data()
            })
          })
        } else {
          console.log('empty transactions')
        }
      })

      this.Transactions = dataTransactions
    },
    optionsFn (date) {
      if (this.lastTransaction.length != 0) {
        var lastTransactionDate = this.lastTransaction[0].timestamp.toDate()
        var firstTransactionDate = this.firstTransaction[0].timestamp.toDate()
        return date <= this.formatStringDate(firstTransactionDate) && date >= this.formatStringDate(lastTransactionDate)
      }
    },
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
    datetoday () {
      var myDate = new Date();
      var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
      var date = ('0' + myDate.getDate()).slice(-2);
      var year = myDate.getFullYear();
      var formattedDate = year + '-' + month + '-' + date;
      this.dateToday = formattedDate;
    },

  },
  mounted () {
      this.datetoday()
      // this.date = this.datetodaydata
      // // Binding Collections
      var datenow = new Date();
      datenow.setHours(0, 0, 0, 0)
      this.$binding('Transactions', firebaseDb.collection('Transactions').where('timestamp', '>', datenow).where('TransactionType', '==', 'Payment'))
        .then((Transactions) => {
          console.log(Transactions, 'tasd')
          this.loading = false
        })
    },
    computed: {
      ...mapGetters('subModules', [ 'formatStringDate' ])
    }


}
</script>

<style scoped>
.q-field{
  width: 205px;
}
</style>

<template>
<div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Payment<q-icon name="mdi-arrow-right-box" /> All Payment</h6>
          <q-input class="q-ma-md" @input="QueryDate()" v-model="date" outlined type="date" hint="Native date" />

    <q-separator />
      <!-- <div v-if="loading">
        <q-spinner-oval
        color="teal"
        size="200px"
        :thickness="5"
        class="fixed-center"
        />
      </div> -->
    <div class="q-pa-md col-xs-12 col-sm-12 col-md-12" v-if="!loading">
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
        <tbody>
          <tr v-for="(data, id) in Transactionstbl" :key="id">
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
      loading: true,
      datetodaydata: '',
      date:'',
      Transactions: {}
    }
  },
  props: ['penRegId'],
  firestore () {
        return {
            // Doc
            Transactionss: firebaseDb.collection('Transactions'),
            posts: []
        }
      },
  methods: {
    log(){
      console.log(this.penRegId)
    },
    QueryDate(){
        var dt = this.date.toString()
        // var t = this.Transactions
        this.$firestore.Transactionss.doc(dt).collection("Payment").where('MemberID', '==', this.penRegId )
        .get()
        .then(function(querySnapshot) {
          let postsArray = []
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                let post = doc.data()
                post.id = doc.id
                postsArray.push(post)
                // console.log(doc.id, " => ", doc.data());
                // t[doc.id]=doc.data()
            });
            // console.log('posts', postsArray)
            this.posts = postsArray;
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
    }
  },
  mounted () {
      this.datetoday()
      this.date = this.datetodaydata
      // Binding Collections
      this.$bindCollectionAsObject("Transactions", firebaseDb.collection("Transactions")
      .doc(this.datetodaydata)
      .collection('Payment')
      .where('MemberID', '==', this.penRegId))
      .then((Transactions) => {
        this.loading = false
      })
    },
    computed: {
      Transactionstbl(){
        return this.posts
      }
    }
     
    
}
</script>

<style scoped>
.q-field{
  width: 205px;
}
</style>
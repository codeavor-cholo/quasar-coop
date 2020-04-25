<template>
  <div>
    <q-table
      title="Savings Applications"
      :data="SavingsApplications"
      :columns="columns"
      :loading="tableLoading"
      :pagination.sync="pagination"
      row-key="['.key']"
    >

      <template v-slot:body-cell-date="props">
        <q-tr :props="props">
          <q-td key="timestamp" :props="props" >
            {{props.row.timestamp.toDate()}}
          </q-td>
        </q-tr>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-tr :props="props">
          <q-td key="actions" :props="props" class="q-gutter-xs">
            <q-btn dense color="positive" no-caps icon="mdi-check">Approve</q-btn>
            <q-btn dense color="negative" no-caps icon="mdi-close">Declined</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- <q-btn label="test" @click="test"></q-btn> -->
  </div>
</template>

<script>
import { firebaseDb } from 'boot/firebase'
import { differenceBy } from 'lodash'

export default {
  // async mounted () {
  //   this.tableLoading = true
  //   var datenow = new Date();
  //   datenow.setHours(0, 0, 0, 0)
  //   await this.$binding('TodayTransactions', firebaseDb.collection('Transactions').where('timestamp', '>', datenow).where('TransactionType', '==', 'Payment'))
  //     .then((trans) => {
        
  //       this.$binding('PaidMembers', firebaseDb.collection('MemberData'))
  //         .then((data) => {
            
  //           let transactions = trans
  //           let members = data

  //           let paidMembers = []
  //           for (var i = 0; i < transactions.length; i++) {
  //             for  (var j = 0; j < members.length; j++) {
  //               if (transactions[i].MemberID === members[j]['.key']) {
  //                 paidMembers.push(members[j])
  //               }
  //             }
  //           }
  //           this.tableLoading = false
  //           this.PaidMembers = paidMembers
  //         })
  //     })
  // },
  firestore () {
    return {
      SavingsApplications: {
        ref: firebaseDb.collection('WithdrawalApplications'),
        object: true,
        resolve: (data) => {
          console.log(data)
        }
      }
    }
  },
  data () { 
    return {
      pagination: {
        sortBy: 'desc',
        descending: false,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      tableLoading: false,
      SavingsApplications: [], // this tends to prevent undentified instance when loading
      // Start of Operating Units //
      columns: [
        { name: 'date', align: 'center', label: 'Date', field: 'timestamp', sortable: true},
        {
          name: 'memberid',
          required: true,
          label: 'MemberID',
          align: 'left',
          field: 'MemberID',
          sortable: true
        },
        { name: 'lastname', align: 'center', label: 'Last name', field: 'LastName', sortable: true },
        { name: 'firstname', align: 'center', label: 'First name', field: 'FirstName', sortable: true },
        { name: 'designation', align: 'center', label: 'Designation', field: 'Designation', sortable: true },
        { name: 'amount', align: 'center', label: 'Amount', field: 'Amount'},
        { name: 'actions', align: 'center'}
      ],
      
    }
  }, // end of data
  methods: {
    test () {

    }
  }
}
</script>


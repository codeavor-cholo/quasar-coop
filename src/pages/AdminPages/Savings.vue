<template>
  <q-page>
    <div>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Savings </h6>
       <q-separator />
        <!-- <q-btn @click="test">test</q-btn> -->
        <div class="q-pa-lg">
          <q-table
            square
            title="Members Saving"
            :data="MemberData"
            :columns="savings"
            row-key="name"
          >
            <!-- <template v-slot:body-cell-savings="props">
              <q-tr :props="props" >
                <q-td key="savings" :props="props">
                  {{ props.row.SavingsDeposit }}
                </q-td>
              </q-tr>
            </template> -->

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="memberid" :props="props">
                  {{ props.row['.key'] }}
                </q-td>
                <q-td key="designation" :props="props">
                  {{ props.row.Designation }}
                </q-td>
                <q-td key="lastname" :props="props">
                  {{ props.row.LastName }}
                </q-td>
                <q-td key="firstname" :props="props">
                  {{ props.row.FirstName }}
                </q-td>
                <q-td key="savings" :props="props">
                  {{ props.row.SavingsDeposit | currency }}
                </q-td>
                <q-td key="date" :props="props">
                  
                </q-td>
            
              </q-tr>
            </template>
          </q-table>
      </div>
  </div>
  </q-page>
</template>
<script>
import { firebaseDb } from 'boot/firebase'
import { sortBy, takeRight } from 'lodash'

export default {
  firestore () {
    return {
      MemberData: firebaseDb.collection('MemberData'),
      Transactions: firebaseDb.collection('Transactions')
    }
  },
  data () {
    return{
      savings: [
        {
          name: 'memberid',
          required: true,
          label: 'MemberID',
          align: 'left',
          field: row => row['.key'],
          format: val => `${val}`,
          sortable: true
        },
        { name: 'designation', align: 'center', label: 'Designation', field: 'Designation', sortable: true },
        { name: 'lastname', align: 'center', label: 'Last name', field: 'LastName', sortable: true },
        { name: 'firstname', align: 'center', label: 'First name', field: 'FirstName', sortable: true },
        { name: 'savings', align: 'center', label: 'Savings', field: 'SavingsDeposit', sortable: true },
        // { name: 'date', align: 'center', label: 'Last Deposit', field: 'date', sortable: true}
      ],
      savingdata:[
        {
          memberid: 'NGTSC2020001',
          designation: 'Operator',
          lastname: 'Bear',
          firstname: 'Grizzly',
          savings: '₱26000',
          date: '01-03-2020',
        },
        {
            memberid: 'NGTSC2020002',
          designation: 'Driver',
          lastname: 'Hathaway',
          firstname: 'Anne',
          savings: '₱6090',
          date: '01-06-2020',
        },
        {
            memberid: 'NGTSC2020003',
          designation: 'Driver',
          lastname: 'ABC',
          firstname: 'DEF',
          savings: '₱500',
          date: '01-13-2020',
        },
        {
            memberid: 'NGTSC2020004',
          designation: 'Driver',
          lastname: 'QWE',
          firstname: 'ZXC',
          savings: '₱1000',
          date: '01-20-2020',
        },
        {
          memberid: 'NGTSC2020005',
          designation: 'Operator',
          lastname: 'James',
          firstname: 'Lebron',
          savings: '₱512',
          date: '01-23-2020',
        },
        {
            memberid: 'NGTSC2020006',
          designation: 'Driver',
          lastname: 'De leon',
          firstname: 'Jane',
          savings: '₱960',
          date: '01-29-2020',
        }
      ]
    }
  }, // end of data
  methods: {
    async test () {
      // NGTSC2020012
      
      let lastTransaction = await this.lastDepositDate('NGTSC2020012')
      console.log(lastTransaction, 'fsf')
    },
    lastDepositDate (id) {
      this.getMemberLastDepositDate(id)
        .then((transacData) => {
          console.log(transacData)
          if (transacData.length != 0) {
            return transacData[0].timestamp.toDate()
          } else {
            return ''
          }
        }).catch(err => {
          console.log(err)
          return ''
        })
  
    },
    getMemberLastDepositDate (id) {
      return new Promise(async resolve => {
        let query = firebaseDb.collection('Transactions')
                  .where('SavingsDeposit', '>', 0)
                  .where('MemberID', '==', id)
        
        let data = []
        await query.get().then(snapshot => {
      
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              data.push(doc.data())
            })
          }
        })
        resolve(takeRight(sortBy(data, ['timestamp'])))
      })
  
    }
  }, // end of methods
}
</script>
<style scoped>
.no-choice{
    opacity: 0.6;
}
</style>
<template>
  <div>
    <q-table
      title="Unpaid Members"
      :data="UnpaidMembers"
      :columns="nonoperatings"
      :loading="tableLoading"
      :pagination.sync="pagination"
      row-key="['.key]"
    >
      <template v-slot:body-cell-actions="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            <q-btn dense color="primary" no-caps>Pay Fee</q-btn>
            {{ props.row.name }}
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
  async mounted () {
    this.tableLoading = true
    var datenow = new Date();
    datenow.setHours(0, 0, 0, 0)
    await this.$binding('TodayTransactions', firebaseDb.collection('Transactions').where('timestamp', '>', datenow).where('TransactionType', '==', 'Payment'))
      .then((trans) => {
        
        this.$binding('UnpaidMembers', firebaseDb.collection('MemberData'))
          .then((data) => {
            
            let transactions = trans
            let members = data

            for (var i = 0; i < transactions.length; i++) {
              for  (var j = 0; j < members.length; j++) {
                if (transactions[i].MemberID === members[j]['.key']) {
                  members.splice(i, 1)
                }
              }
            }
            this.tableLoading = false
            return members
          })
      })
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
      UnpaidMembers: [], // this tends to prevent undentified instance when loading
      // Start of Operating Units //
      nonoperatings: [
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
        { name: 'licenseplate', align: 'center', label: 'License Plate', field: 'licenseplate', sortable: true },
        { name: 'actions', align: 'center'}
      ],
      nonoperatingdata:[
        {
          memberid: 'NGTSC2020001',
          designation: 'Operasdfsdfatosssr',
          lastname: 'Taylor',
          firstname: 'Swift',
          licenseplate: 'TAS-1989',
          date: '12-13-1989',
        },
        {
            memberid: 'NGTSC2020002',
          designation: 'Driver',
          lastname: 'Hathaway',
          firstname: 'Anne',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
            memberid: 'NGTSC2020003',
          designation: 'Driver',
          lastname: 'ABC',
          firstname: 'DEF',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
            memberid: 'NGTSC2020004',
          designation: 'Driver',
          lastname: 'QWE',
          firstname: 'ZXC',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
            memberid: 'NGTSC2020005',
          designation: 'Operator',
          lastname: 'James',
          firstname: 'Lebron',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
          memberid: 'NGTSC2020006',
          designation: 'Driver',
          lastname: 'De leon',
          firstname: 'Jane',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
      ]
    }
  }, // end of data
  methods: {
    test () {
      // get all the transactions this day
      // compare the transaction today in membersdata
      // console.log(this.TodayTransactions)
      // console.log(this.MembersData)
      // let transactions = this.TodayTransactions
      // let members = this.MembersData

      // let unpaidMembers = []

      // for (var i = 0; i < transactions.length; i++) {
      //   for  (var j = 0; j < members.length; j++) {
      //     if (transactions[i].MemberID === members[j]['.key']) {
      //       members.splice(i, 1)
      //     }
      //   }
      // }
      console.log(this.UnpaidMembers, 'um')

      
    }
  }
}
</script>


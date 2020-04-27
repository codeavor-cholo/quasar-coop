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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="date" :props="props">
            {{ $moment(props.row.timestamp.toDate()).format('LL') }}
          </q-td>

          <q-td key="memberid" :props="props">
            {{ props.row.MemberID }}
          </q-td>

          <q-td key="firstname" :props="props">
            {{ props.row.FirstName }}
          </q-td>

          <q-td key="lastname" :props="props">
            {{ props.row.LastName }}
          </q-td>

          <q-td key="designation" :props="props">
            {{ props.row.Designation }}
          </q-td>

          <q-td key="amount" :props="props">
            {{ props.row.Amount | currency }}
          </q-td>

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
  created () {
    this.tableLoading = true
  },
  firestore () {
    return {
      SavingsApplications: {
        ref: firebaseDb.collection('WithdrawalApplications'),
        object: true,
        resolve: () => {
          this.tableLoading = false
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
        { name: 'amount', align: 'center', label: 'Amount'},
        { name: 'actions', align: 'center', label: 'Actions'}
      ],
      
    }
  }, // end of data
  methods: {
    test () {

    }
  }
}
</script>


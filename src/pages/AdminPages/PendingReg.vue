<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal"> Members <q-icon name="mdi-arrow-right-box" /> Pending Applications </h6>
    <q-separator />
    <div v-if="loading">
      <q-spinner-oval
        color="teal"
        size="200px"
        :thickness="5"
        class="fixed-center"
      />
    </div>
    <div v-if="!loading" class="q-pb-lg">
        <q-input v-model="filter" filled type="search" dense class="q-ma-md" label="Search" clearable="" color="teal">
            <template v-slot:append>
            <q-icon name="search" />
            </template>
        </q-input>
      <q-table
       :filter="filter"
        flat=""
        bordered=""
        class="q-ma-md"
        :data="PendingRegs"
        :columns="columns"
        row-key=".key"
        :pagination.sync="pagination"
        table-header-class="bg-teal text-white"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols.filter(col => col.name !== 'action')" :key="col.name">
              {{col.value}}
            </q-td>
            <td key="action"><q-btn flat label="View Details" icon-right="mdi-arrow-right" @click="loadPreReg(props.row['.key'])"/></td>
          </q-tr>
        </template>
      </q-table>
    </div>  
    <!-- <div v-if="!loading" class="col-xs-10 col-sm-10 col-md-8 q-pa-md">
      <q-markup-table separator="horizontal" flat bordered>
        <thead class="bg-teal">
          <tr class="text-h4 q-ml-md text-white">
            <th class="text-left">Last Name</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Designation</th>
            <th class="text-left">Phone</th>
            <th class="text-left"></th>
          </tr>
        </thead>


        <tbody>
          <tr v-for="(PendingReg, id) in PendingRegs" :key="id">
            <td class="text-left">{{ PendingReg.LastName }}</td>
            <td class="text-left">{{ PendingReg.FirstName }}</td>
            <td class="text-left">{{ PendingReg.Designation }}</td>
            <td class="text-left">{{ PendingReg.Phone }}</td>
            <td class="text-left"><q-btn flat label="View Details" class="full-width" icon-right="mdi-arrow-right" @click="loadPreReg(id)"/></td>
          </tr>
        </tbody>

    </q-markup-table>
    </div> -->
  </div>
</template>

<script>
import { firebaseDb } from 'boot/firebase';

export default {
    data () {
        return{
          loading: false,
          columns: [
              { name: 'lastname', align: 'left', label: 'Last name', field: 'LastName', sortable: true },
              { name: 'firstname', align: 'left', label: 'First name', field: 'FirstName', sortable: true },
              { name: 'designation', align: 'left', label: 'Designation', field: 'Designation', sortable: true },
              { name: 'phone', align: 'left', label: 'Phone', field: 'Phone', sortable: true },
              { name: 'action', align: 'left', label: 'Action', },
          ],
          pagination: {
            page: 1,
            rowsPerPage: 10
          },
          filter: ''
        }
    },
    firestore () {
      return {
        PendingRegs: firebaseDb.collection('PreRegPersonalData'),
      }
    },
    // mounted () {
    //   // Binding Collections
    //   this.$bindCollectionAsObject("PendingRegs", firebaseDb.collection("PreRegPersonalData"))
    //   .then((PendingRegs) => {
    //     // console.log(PendingRegs,'PendingRegs')
    //     this.loading = false
    //   })
    // },
    methods: {
        loadPreReg(id) {
            this.$router.push('/admin/pendingregform/' + id)
        }
    }
}
</script>
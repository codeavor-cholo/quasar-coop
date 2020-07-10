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
    <div v-if="!loading" class="col-xs-10 col-sm-10 col-md-8 q-pa-md">
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
    </div>
  </div>
</template>

<script>
import { firebaseDb } from 'boot/firebase';

export default {
    data () {
        return{
          loading: true
        }
    },
    firestore () {
    return {
    PendingRegs: {
        // collection reference.
            // ref: firebaseDb.collection('PreRegPersonalData'),
            // Bind the collection as an object if you would like to.
            // objects: true,
            // resolve: (data) => {
            //     // collection is resolved
            // },
            // reject: (err) => {
            //     // collection is rejected
            // }
        }
      }
    },
    mounted () {
      // Binding Collections
      this.$bindCollectionAsObject("PendingRegs", firebaseDb.collection("PreRegPersonalData"))
      .then((PendingRegs) => {
        console.log(PendingRegs,'PendingRegs')
        this.loading = false
      })
    },
    methods: {
        loadPreReg(id) {
            this.$router.push('/admin/pendingregform/' + id)
        }
    }
}
</script>
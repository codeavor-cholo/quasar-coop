<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Members <q-icon name="mdi-arrow-right-box" /> All Members</h6>

    <q-separator />
      <!-- <div v-if="loading">
        <q-spinner-oval
        color="primary"
        size="200px"
        :thickness="5"
        class="fixed-center"
        />
      </div> -->


    <div class="q-pa-md col-xs-12 col-sm-12 col-md-12">
      <div class="q-mb-md full-width row justify-end">
        <q-input v-model="filter" class="" filled color="teal" type="search" dense label="Search" clearable="" style="width:250px;">
            <template v-slot:append>
            <q-icon name="search" />
            </template>
        </q-input>
      </div>

      <q-table
        class="q-mb-md"
        :data="getRidOFResigned"
        :columns="columns"
        row-key=".key"
        flat
        :pagination.sync="initialPagination"
        :filter="filter"
      >
        <template v-slot:body="props">
            <q-tr :props="props"  :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : '#'">
            <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                <q-icon name="double_arrow" v-show="col.name == 'MemberID' && props.row == selected" />
                <span v-if="col.typeOf !== 'status'">{{ col.value  }}</span>
                <span v-else>
                  <q-icon name="check_circle" size="md" v-if="col.value == false" color="teal" />
                  <q-icon name="warning" size="md" v-else color="warning" />

                </span>
            </q-td>
            <q-td>
              <q-btn flat 
              color="secondary"
              class="full-width" 
              icon-right="mdi-arrow-right" 
              label="View Profile" 
              @click="loadProfile(props.row['.key'])"
              />              
            </q-td>
            </q-tr>
        </template>        
      </q-table>
      <!-- <q-markup-table separator="horizontal" flat bordered>
      <template>
        <thead color="secondary">
          <tr>
            <th class="text-left">MemberID</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Phone</th>
            <th class="text-left">Membership Fee Paid</th>
            <th class="text-left"></th>
          </tr>
        </thead>
      </template>
      <template>
        <tbody>
          <tr v-for="(data, id) in MemberData" :key="id">
            <td class="text-left">{{id}}</td>
            <td class="text-left">{{data.LastName}}</td>
            <td class="text-left">{{data.FirstName}}</td>
            <td class="text-left">{{data.Phone}}</td>
            <td class="text-left">
                <q-icon name="check_circle" size="md" v-if="!data.isNewMember" color="teal" />
                <q-icon name="warning" size="md" v-else color="warning" />
            </td>
            <td class="text-left">
              <q-btn flat 
              color="secondary"
              class="full-width" 
              icon-right="mdi-arrow-right" 
              label="View Profile" 
              @click="loadProfile(id)"
              />
            </td>
          </tr>
        </tbody>
      </template>
      </q-markup-table> -->
    </div>
    </div>
</template>

<script>
import { firebaseDb } from 'boot/firebase';

export default {
  data() {
    return {
      selected: {},
      initialPagination: {
          descending: false,
          page: 1,
          rowsPerPage:0
          // rowsNumber: xx if getting data from a server
      },
      filter: '',
      columns: [
        { name: 'MemberID', align: 'left', label: 'Member ID', field: '.key', sortable: true },
        { name: 'FirstName', align: 'left', label: 'First Name', field: 'FirstName', sortable: true },
        { name: 'LastName', align: 'left', label: 'Last Name', field: 'LastName', sortable: true }, 
        { name: 'Phone', align: 'left', label: 'Phone#', field: 'Phone', sortable: true },  
         { name: 'Designation', align: 'left', label: 'Designation', field: 'Designation', sortable: true },          
        { name: 'MembershipFee', align: 'left', label: 'MF Paid', field: 'isNewMember', sortable: true, typeOf: 'status' },
        { name: 'Actions', align: 'left', label: 'Actions', },   
      ],
      loading: true,
      active: true,
      inactive: true,
      show_dialog: false,
      editedIndex: -1,
      editedItem: {
        name: "",
        lastname: '',
        firstname: '',
        designation: '',
        licenseplate: '',
        phonenumber: ''
      },
      defaultItem: {
        name: "",
        lastname: '',
        firstname: '',
        designation: '',
        licenseplate: '',
        phonenumber: ''
      },
      // MemberData: {}
    }
  },
    firestore () {
      return {
        MemberData: firebaseDb.collection('MemberData'),
        JeepneyData: firebaseDb.collection('JeepneyData'),
        Transactions: firebaseDb.collection('Transactions'),
        DashboardUsers: firebaseDb.collection('DashboardUsers'),
      }
    },
  computed: {
    // ...mapGetters('store', ['MemberData'])
    getRidOFResigned(){
      try {
        return this.MemberData.filter(a=>{
          return a.resigned !== true
        })
      } catch (error) {
        return []
      }
    }
  },
  mounted () {
      // Binding Collections
      // this.$bindCollectionAsObject("MemberData", firebaseDb.collection("MemberData"))
      // .then((MemberData) => {
      //   this.loading = false
      // })
    },
  methods: {
    loadProfile(id) {
            this.$router.push('/admin/profile/' + id)
        },
    log(){
      console.log(this.MemberData)
    },
    editItem (item) {
        this.editedIndex = this.columns.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
    editMember(){
      
    },
    addRow() {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
      } else {
        this.data.push(this.editedItem);
      }
      this.close()
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.data.splice(index, 1);
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.show_dialog = true;
    },
    close () {
      this.show_dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    }
  },
};
</script>
<style></style>

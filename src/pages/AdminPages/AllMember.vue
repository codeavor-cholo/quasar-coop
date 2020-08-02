<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Members <q-icon name="mdi-arrow-right-box" /> All Members
    <q-btn color="grey-10" icon="settings" label="settings" @click="openSettings = !openSettings" class="print-hide float-right q-mr-md" dense flat/>
    </h6>
    
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
      <div class="q-mb-md full-width row justify-end  print-hide">
        <q-btn color="grey-10" icon="print" label="print report" @click="printMe" class="q-mr-md"/>
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
                <span v-if="col.typeOf == 'status'">
                  <q-icon name="check_circle" size="md" v-if="col.value == false" color="teal" />
                  <q-icon name="warning" size="md" v-else color="warning" />
                </span>
                <span v-else-if="col.typeOf == 'chip'">
                  <q-chip class="" outline color="red" :label="col.value" v-if="col.value =='resigned'"/>
                  <q-chip class="" outline color="teal" :label="col.value" v-else-if="col.value =='active'"/>
                  <q-chip class="" outline color="warning" :label="col.value" v-else/>
                </span>
                <span v-else>
                  {{col.value}}
                </span>
            </q-td>
            <q-td class="print-hide">
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

      <q-dialog v-model="openSettings" persistent>
        <q-card style="width:50vw;" class="q-pa-md">
          <q-card-section class="row items-center">
            <q-avatar icon="settings" color="grey-10" text-color="white" />
            <span class="q-ml-sm text-h6">Settings</span>
            <q-btn color="grey" icon="close" dense @click="openSettings = false" flat class="absolute-right" />
          </q-card-section>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label caption lines="2">Member Inactiveness</q-item-label>
                <q-item-label class="text-h6">{{ZMemberInactiveness.amount}} Months (No Payments)</q-item-label>

              </q-item-section>
              <q-item-section side top> 
                <q-btn color="teal" icon="edit" @click="setInactiveTime" flat/>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </q-dialog>
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
import { date } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      openSettings: false,
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
        { name: 'Status', align: 'left', label: 'Status', field: 'Status', sortable: true,  typeOf: 'chip'},
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
        ZMemberInactiveness: firebaseDb.collection('FixedPayments').doc('ZMemberInactiveness'),
      }
    },
  computed: {
    // ...mapGetters('store', ['MemberData'])
    getRidOFResigned(){
      try {
        return this.MemberData.filter(a=>{
          
          if(a.resigned == true){
            a.Status = 'resigned'
          } else {
            a.Status = this.checkIfActive(a['.key'])
          }
          return a
        })
      } catch (error) {
        console.log(error,'getRidOFResigned')
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
    ...mapMutations('SubModule', {
        closeDrawer: 'setDrawerPrint'
    }),
    printMe(){
        this.closeDrawer()
        let self = this
        setTimeout(function(){ 
          window.print();
        }, 2000);
    },
    setInactiveTime(){
      this.$q.dialog({
        title: 'Edit Member Inactiveness Time ?',
        message: 'Type a number below and click Save to Update.',
        prompt: {
          model: '',
          isValid: val => val >= 1,
          type: 'number' // optional
        },
        ok: 'Save Settings',
        cancel: {
          color: 'grey-10',
          flat: true
        },
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data)
        firebaseDb.collection('FixedPayments').doc('ZMemberInactiveness').update({
          amount: data
        }).then(()=>{
          console.log('settings update')
          this.$q.notify({
              color: 'teal-4',
              textColor: 'white',
              icon: 'check',
              message: "Success Saving Changes",
              }) 
        })
      })      
    },
    checkIfActive(memberID){
      let today = new Date()
      let monthsBase = date.subtractFromDate(today, {month: this.ZMemberInactiveness.amount})

      let transactions = this.Transactions.filter(a=>{
        return a.MemberID == memberID && a.timestamp.toDate() >= monthsBase && a.timestamp.toDate() <= today
      })


      if(transactions.length == 0){
        // console.log(memberID + ' ' + transactions.length+ 'payments',)
        return 'inactive'
      } else {
        // console.log(memberID + ' ' + transactions.length+ 'payments',)
        return 'active'
      }

    },
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

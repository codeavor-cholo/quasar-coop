<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Members <q-icon name="mdi-arrow-right-box" /> All Members</h6>

    <q-separator />
      <div v-if="loading">
        <q-spinner-oval
        color="primary"
        size="200px"
        :thickness="5"
        class="fixed-center"
        />
      </div>
    <div class="q-pa-md col-xs-12 col-sm-12 col-md-12" v-if="!loading">
      <q-markup-table separator="horizontal" flat bordered>
      <template>
        <thead color="secondary">
          <tr>
            <th class="text-left">MemberID</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Phone</th>
            <th class="text-left">Email</th>
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
            <td class="text-left">{{data.Email}}</td>
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
      </q-markup-table>
    </div>
    </div>
</template>

<script>
import { firebaseDb } from 'boot/firebase';

export default {
  data() {
    return {
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
      MemberData: {}
    }
  },
  firestore () {
    return {
      MemberData: {
        }
      }
  },
  computed: {
    // ...mapGetters('store', ['MemberData'])
  },
  mounted () {
      // Binding Collections
      this.$bindCollectionAsObject("MemberData", firebaseDb.collection("MemberData"))
      .then((MemberData) => {
        this.loading = false
      })
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

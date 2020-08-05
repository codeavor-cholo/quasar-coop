<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Dashboard Users</h6>
        <q-separator />        
        <div class="q-pa-md">
            <q-table
                :data="returnDashboardUsers"
                :columns="columns"
                :pagination.sync="pagination"
                row-key=".key"
                flat
                :filter="filter"
            >
            <template v-slot:top>
                <div>
                    <q-banner class="bg-info text-white">
                        <q-icon name="info" class="q-mr-md"/>Click the row to perform actions.
                    </q-banner>
                </div>
                <div class="q-pa-md">
                    <q-input v-model="filter" filled type="search" dense  label="Search" clearable="" class="absolute-right">
                        <template v-slot:append>
                        <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
            </template>  
            <template v-slot:body="props">
                <q-tr :props="props"  @click="onRowClick(props)" :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                    <q-icon name="double_arrow" v-show="col.name == 'Username' && props.row == selected" />
                    {{ col.value }}
                </q-td>
                <q-td key="Actions" v-if="props.row == selected">
                    <q-btn color="teal" icon="edit" label="edit" @click="editGo(props.row)" flat/>
                    <q-btn color="grey-10" icon="delete" label="delete" @click="deleteGo(props.row)" flat/>
                </q-td>
                <q-td key="Actions" v-else></q-td>
                </q-tr>
            </template>          
            </q-table>
        </div>

        <q-dialog v-model="addUserDialog" persistent>
            <q-card style="width:500px;">
                <q-card-section class="row items-center">
                    <span class="text-h6" v-if="editMode !== true">Add New User</span>
                    <span class="text-h6" v-else>Edit User</span>
                </q-card-section>
                <q-card-section class="q-gutter-md">
                    <div class="row justify-between">
                        <q-input v-model="newUser.firstName" type="text" label="First Name" outlined="" color="teal" class="col q-mr-md"/>
                        <q-input v-model="newUser.lastName" type="text" label="Last Name" outlined="" color="teal" class="col"/>
                    </div>
                    <q-input v-model="newUser.username" type="text" label="Username" outlined="" color="teal" :readonly="editMode"/>
                    <q-select v-model="newUser.position" :options="positionsMap" label="Position" filled color="teal"/>
                    <q-input v-model="newUser.password" type="password" label="Password" outlined="" color="teal" v-show="editMode == false"/>
                    <q-input v-model="newUser.confirmPassword" type="password" label="Confirm Password" outlined="" color="teal" v-show="editMode == false"/>                 
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="grey-10" v-close-popup @click="clearForm"/>
                    <q-btn flat label="Create User Account" color="teal" v-close-popup @click="createUser" v-if="editMode !== true"/>
                    <q-btn flat label="Edit User Account" color="teal" v-close-popup @click="editUser" v-else/>
                </q-card-actions>
            </q-card>
        </q-dialog>


        <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="person_add" color="teal" @click="addUserDialog = true">
            <q-tooltip  anchor="top middle" self="bottom middle">
                Add New User
            </q-tooltip>
        </q-btn>
        </q-page-sticky>
  
    </q-page>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2, firebaseAuth } from 'boot/firebase';
import axios from 'axios' 
const sri = require('simple-random-id');
export default {
    data(){
        return {
            editMode: false,
            newUser:{
                firstName: '',
                lastName: '',
                username: '',
                position: '',
                confirmPassword: '',
                password: '',
            },
            selected: {},
            data: [],
            columns: [
                { name: 'Username', align: 'left', label: 'Username', field: 'Username', sortable: true },
                { name: 'Firstname', align: 'left', label: 'First Name', field: 'FirstName', sortable: true },
                { name: 'Lastname', align: 'left', label: 'Last Name', field: 'LastName', sortable: true },            
                { name: 'Position', align: 'left', label: 'Position', field: 'Position', sortable: true },
                { name: 'Actions', align: 'left', label: 'Actions',  },
            ],
            filter: '',
            selectedKey: '',
            addUserDialog: false,
            positionsMap: ['Admin','Collector','Secretary'],
            pagination: {
              sortBy: 'position',
              descending: true,
              page: 1,
              rowsPerPage: 0
              // rowsNumber: xx if getting data from a server
            },
        }
    },
    created(){

    },
    firestore () {
      return {
        DashboardUsers: firebaseDb.collection('DashboardUsers'),
      }
    },
    computed:{
        returnDashboardUsers(){
            try {
                return this.DashboardUsers.filter(a=>{return a.Position !== 'SuperAdmin'})
            } catch (error) {
                return []
            }
        }
    },
    methods:{
        editGo(user){
            console.log(user,'user')
            this.editMode = true
            this.newUser.username = user.Username
            this.newUser.firstName = user.FirstName
            this.newUser.lastName = user.LastName
            this.newUser.position = user.Position
            this.addUserDialog = true
            this.selectedKey = user['.key']
        },
        editUser(){
            let user = this.newUser

            if(user.firstName == '' || user.lastName == '' || user.position == ''){
                this.$q.dialog({
                    title: `Incomplete Details`,
                    message: `Please fill up all fields of the form`,
                    persistent: true,
                }).onOk(() => {
                    this.addUserDialog = true
                })    
            } else {
                this.$q.dialog({
                    title: `Confirm Account Update ?`,
                    message: `Would you like to update the account for this username - ${user.username}?`,
                    persistent: true,
                    cancel: true
                }).onOk(()=>{
                    firebaseDb.collection('DashboardUsers').doc(this.selectedKey).update({
                        Position: user.position,
                        FirstName: user.firstName,
                        LastName: user.lastName,
                    }).then((doc) => {
                        console.log(doc,'update successful')
                        this.$q.notify({
                            icon: 'info',
                            message: 'Update Account Successful',
                            color: 'positive'
                        })     
                        this.clearForm()
                    }).catch((err)=>{
                        this.$q.notify({
                            icon: 'error',
                            message: err+' Update Account Failed',
                            color: 'negative'
                        })                           
                    })

                }).onCancel(()=>{
                    this.addUserDialog = true
                })                
            }
        },
        deleteUserInServer(uid){
            return new Promise(async (resolve) => { 

                var senddata = 'uid=' + uid
                console.log(senddata,'data')
                // const options = {
                //     method: 'POST',
                //     headers: { 'Access-Control-Allow-Origin': '*' },
                //     data: senddata,
                //     url: 'https://fierce-oasis-90806.herokuapp.com/changePassword',
                // }    

                axios.post('https://fierce-oasis-90806.herokuapp.com/deleteUser', senddata)
                .then(response => {
                console.log(response,'response')
                return resolve(response)
                })
                .catch(err =>{
                console.log('deleteUserInServer',err)
                })                
                
            })
        },
        deleteGo(user){
            this.selectedKey = user['.key']
            this.$q.dialog({
                title: `Confirm Account Deletion`,
                message: `Would you like to delete the account for this username - ${user.Username}?`,
                persistent: true,
                cancel: true
            }).onOk(()=>{
                this.deleteUserInServer(user['.key'])
                .then(()=>{
                    firebaseDb.collection('DashboardUsers').doc(user['.key']).delete().then(function() {
                        console.log("Document successfully deleted!")
                        this.$q.notify({
                            icon: 'info',
                            message: 'Deletion of Account Successful',
                            color: 'positive'
                        })    
                    }).catch(function(error) {
                        console.error("Error removing document: ", error)
                        this.$q.notify({
                            icon: 'error',
                            message: error+' Delete Account Failed',
                            color: 'negative'
                        })      
                    })
                })
                .catch((err)=>{
                    console.log('error in deleting server data',err)
                })

            })
        },
        createUser(){
            let user = this.newUser

            if(user.firstName == '' || user.lastName == '' || user.position == '' || user.username == '' || user.password == '' || user.confirmPassword == ''){
                this.$q.dialog({
                    title: `Incomplete Details`,
                    message: `Please fill up all fields of the form`,
                    persistent: true,
                }).onOk(() => {
                    this.addUserDialog = true
                })                
            } else {
                if(user.password !== user.confirmPassword){
                    this.$q.dialog({
                        title: `Password does not match!`,
                        persistent: true,
                    }).onOk(() => {
                        this.password = ''
                        this.confirmPassword = ''
                        this.addUserDialog = true
                    })
                } else {
                    this.$q.dialog({
                        title: `Confirm Account Creation ?`,
                        message: `Would you like to create a account for ${user.firstName} ${user.lastName}?`,
                        persistent: true,
                        cancel: true
                    }).onOk(async () => {
                        await this.createLoginUser(user.username, user.position, user.firstName, user.lastName, user.password)
                        console.log('done creation of account')
                        this.$q.notify({
                            icon: 'info',
                            message: 'Creation of Account Successful',
                            color: 'positive'
                        })      
                        this.clearForm()                  
                    }).onCancel(()=> {
                        this.clearForm()
                    })
                }
            }

        },
        clearForm(){
            this.newUser.username = ''
            this.newUser.position = ''
            this.newUser.firstName = ''
            this.newUser.lastName = ''    
            this.newUser.confirmPassword = ''  
            this.newUser.password = ''  
            this.editMode = false  
            this.selectedKey = ''  
        },
        createLoginUser (username, position, firstName, lastName, password) {
            return new Promise(async (resolve) => {
                const email =`${username}@coopadmin.com`

                Auth2.createUserWithEmailAndPassword(email, password)
                    .then(async (data) => {
                    console.log(data, 'data')
                    const userID = data.uid
                    await firebaseDb.collection('DashboardUsers').doc(data.user.uid).set({
                        Email: email,
                        Username: username,
                        Position: position,
                        FirstName: firstName,
                        LastName: lastName,
                    }).then((doc) => {
                        resolve(doc)
                    }).catch((err) => {
                        console.log(err,'createLoginUser')
                        this.$q.notify({
                            icon: 'error',
                            message: err+' Creation of Account Failed',
                            color: 'negative'
                        })      
                    })
                    
                    })
                    .catch(err => {
                        console.log(err,'createLoginUser')
                        this.$q.notify({
                            icon: 'error',
                            message: err+' Creation of Account Failed',
                            color: 'negative'
                        }) 
                    })          
            })
        },
      onRowClick(props){
          
        if(this.selected != props.row)
        {
          this.selected = props.row
          console.log(this.selected,'selected')
        } else {
          this.selected = {}
        }
      },
    }
}
</script>
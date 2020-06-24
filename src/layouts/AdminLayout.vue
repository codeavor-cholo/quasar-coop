<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-teal text-white noPrint">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="statics/icons/New-GSIS-Cooperative.png" />
          </q-avatar>
          <small class="q-ml-md">Admin Dashboard</small>
          <q-space />
        </q-toolbar-title>
          <q-btn color="teal" class="text-white" icon="mdi-logout-variant" @click="logout"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" none class=" noPrint">
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 200px"
      >
        <div class="absolute-center text-center bg-transparent q-py-md">
          <q-avatar size="100px" class="q-mt-sm" text-color="white" color="grey-10">
            {{LoggedOn.FirstName.slice(0,1)}}
          </q-avatar>
          <div class="text-weight-bold q-mt-sm">{{LoggedOn.FirstName}} {{LoggedOn.LastName}}</div>
          <div>@{{LoggedOn.Username}}</div>
        </div>
      </q-img>
      <q-scroll-area
        style="height: calc(100% - 250px); margin-top: 200px; border-right: 1px solid #ddd"
      >
      <!-- Start of Sidebar Menu inside the Drawer -->
       <q-list separator bordered>
         <q-item
         to="/admin/dashboard"
         exact
         >
          <q-item-section avatar>
              <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-uppercase">Dashboard</q-item-section>
       </q-item>
          <!-- Start of Sidemenu Member -->
          <q-expansion-item
            expand-separator
            icon="people"
            label="MEMBERS"

            :content-inset-level=".6"
            >
                 <q-item
                    expand-separator
                    to="/admin/addmember"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="add_circle" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">Add Member</q-item-section>
                  </q-item>
                    <q-item
                    expand-separator
                    to="/admin/allmember"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="list_alt" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">All Members</q-item-section>
                  </q-item>
                   <q-item
                    expand-separator
                    to="/admin/pendingreg"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="mdi-timer" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">Pending Registration</q-item-section>
                  </q-item>
                   <q-item
                    expand-separator
                    to="/admin/pendingjeeps"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="commute" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">Pending Unit/Jeep Applications</q-item-section>
                  </q-item>
           </q-expansion-item>
          <!-- End of Sidemenu Member -->
         <!-- Start of Payment Member -->
          <q-expansion-item
            expand-separator
            icon="payment"
            label="PAYMENT"
            :content-inset-level="0.5"
            >
                 <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/addpayment"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-cash" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Add Payment</q-item-section>
                </q-item>
                <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/allpayment"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="assessment" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Daily Collections</q-item-section>
                </q-item>
           </q-expansion-item>
            <!-- End of Payment Member -->
            <!-- Start of Tracking -->
            <q-expansion-item
              expand-separator
              icon="mdi-routes"
              label="Monitoring"
              :content-inset-level="0.5"
            >
               <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/billings"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-jeepney" />
                  </q-item-section>
                  <q-item-section class="text-uppercase">MEMBERS</q-item-section>
                </q-item>
                <q-item
                     expand-separator
                    :content-inset-level="0.5"
                     to="/admin/monitoring"
                     exact
                     >
                   <q-item-section avatar>
                     <q-icon name="mdi-account-search" />
                   </q-item-section>
                   <q-item-section class="text-uppercase">Daily Monitoring</q-item-section>
                 </q-item>
            </q-expansion-item>
            <!-- End of Tracking -->
            <q-expansion-item
              expanded-separator
              icon="mdi-credit-card"
              label="Withdrawals"
              :content-inset-level="0.5"
            >
              <q-item
                  expand-separator
                  :content-inset-level="0.5"
                  to="/admin/applications"
                  exact
                  >
                <q-item-section avatar>
                  <q-icon name="mdi-form-dropdown" />
                </q-item-section>
                  <q-item-section class="text-uppercase">Applications</q-item-section>
              </q-item>
              <q-item
                  expand-separator
                  :content-inset-level="0.5"
                  to="/admin/savings"
                  exact
                  >
                <q-item-section avatar>
                  <q-icon name="mdi-bank" />
                </q-item-section>
                  <q-item-section class="text-uppercase">Savings</q-item-section>
              </q-item>
              <q-item
                expand-separator
                :content-inset-level="0.5"
                to="/admin/loans"
                exact
                >
                <q-item-section avatar>
                  <q-icon name="mdi-receipt" />
                </q-item-section>
                  <q-item-section class="text-uppercase">Loan</q-item-section>
              </q-item>
            </q-expansion-item>
             <q-expansion-item
              expanded-separator
              icon="fas fa-user-circle"
              label="Manage"
              :content-inset-level="0.5"
            >
              <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/users"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Add Staff</q-item-section>
                </q-item>
            </q-expansion-item>
             <q-expansion-item
              expanded-separator
              icon="receipt"
              label="Reports"
              :content-inset-level="0.5"
            >
                <q-item
                to="/admin/dailycollections"
                exact
                >
                  <q-item-section avatar>
                      <q-icon name="brightness_low" />
                  </q-item-section>
                  <q-item-section>Daily Collections</q-item-section>
                </q-item>           
             </q-expansion-item>
            <q-item
            to="/admin/paymentmaintenance"
            exact
            >
              <q-item-section avatar>
                  <q-icon name="vertical_split" />
              </q-item-section>
              <q-item-section>Payment Fee Maintenance</q-item-section>
            </q-item>
            <q-item
            to="/admin/generatebilling"
            exact
            >
              <q-item-section avatar>
                  <q-icon name="description" />
              </q-item-section>
              <q-item-section>Billing Statement Generator</q-item-section>
            </q-item>
       </q-list>
      <!-- End of Sidebar Menu inside the Drawer -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-teal text-white noPrint" >
      <q-toolbar>
        <q-toolbar-title>
          <!-- <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" /> -->
          &copy; NEW GSIS COOPERATIVE {{ new Date().getFullYear() }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { firebaseAuth,firebaseApp,firebaseDb } from 'boot/firebase'
export default {
  name: "Layout",
  created(){
    let self = this
    firebaseAuth.onAuthStateChanged(function(user) {
        
        if (user) {
          let gg = {...user}
          console.log('createdUser',user)
          console.log('createdUser',user.uid)
          let username = gg.email.toString().split('@')
          self.memberid = username[0].toUpperCase()
          self.uid = gg.uid
        } else {
            // No user is signed in.
            self.$router.push('/adminlogin')
        }
    })
  },
  data() {
    return {
      left: false,
      memberid: '',
      uid: '',
      log: {}
    };
  },
  firestore () {
    return {
      DashboardUsers: firebaseDb.collection('DashboardUsers'),
    }
  },  
  computed:{
    LoggedOn(){
      try {
        return this.DashboardUsers.filter(a=>{
          return a['.key'] == this.uid
        })[0]
      } catch (error) {
        console.log(error,'LoggedOn')
        return {}
      }
    }
  },
  methods:{
    logout(){
      this.$q.dialog({
          title: `Are you sure you want to logout?`,
          type: 'negative',
          color: 'teal',
          textColor: 'white',
          icon: 'warning',
          ok: 'Ok',
          cancel: 'Cancel'
          
      }).onOk(()=>{
        firebaseAuth.signOut()
          .then(() => {

          })
      })      
    }
  }
};
</script>
<style scoped>
.q-item.q-router-link--active, .q-item--active{
  color:teal;
  }
@media print {
   .noPrint {display:none;}
   .my-card {
       width:100%;
   }

}
</style>

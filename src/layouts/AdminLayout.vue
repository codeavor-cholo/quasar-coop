<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-teal text-white noPrint">
      <q-toolbar class="noPrint">
        <q-btn flat round dense icon="menu" @click="openThis" />

        <q-toolbar-title>
          <q-avatar @click="$router.push('/admin')" class="cursor-pointer">
            <img src="statics/icons/New-GSIS-Cooperative.png" />
          </q-avatar>
          <small class="q-ml-md cursor-pointer" @click="$router.push('/admin')">Admin Dashboard</small>
          <q-space />
        </q-toolbar-title>
          <q-btn color="white" flat icon="notifications" label="notifications" >
            <q-badge color="orange" floating v-show="returnNotif.length > 0">{{returnNotif.length}}</q-badge>
                  <q-menu>
                  <q-list style="min-width: 250px" class="q-py-md">
                      <q-item v-for="notif in returnNotif.slice(0,5)" :key="notif['.key']" clickable :to="returnRoutes(notif.notifType)" v-show="returnNotif">
                        <q-item-section top avatar>
                          <q-avatar color="white" text-color="teal" :icon="returnIcon(notif.notifType)" />
                        </q-item-section>
                        <q-item-section>
                          <!-- <q-item-label>Single line item</q-item-label> -->
                          <q-item-label class="text-weight-bold" caption lines="2">{{notif.message}}
                            <br>
                            <span v-if="notif.notifType == 'jeep'" class="text-weight-light">{{notif.PlateNumber}} </span>
                            <span v-else-if="notif.notifType == 'payments'" class="text-weight-light">{{notif.total | currency}} (#{{notif.transID}}) </span>
                            <span v-else-if="notif.notifType == 'savings'" class="text-weight-light">{{notif.amount | currency}} </span>
                            <span v-else-if="notif.notifType == 'loans'" class="text-weight-light">{{notif.amount | currency}} </span>   
                             <span v-else-if="notif.notifType == 'membership'" class="text-weight-light">{{notif.FirstName}} {{notif.LastName}} - {{notif.Designation}} </span>   
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption v-show="notif.dateTime !== null && $moment.isDate(notif.dateTime.toDate())">{{$moment(notif.dateTime.toDate()).fromNow()}}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable="" class="bg-grey-2" to="/admin/notifications" v-if="returnNotif.length > 0">
                        <q-item-section>
                          <q-item-label class="full-width text-center text-uppercase text-teal" overline>More Notifications</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable="" class="bg-grey-2" to="/admin/notifications" v-else>
                        <q-item-section>
                          <q-item-label class="full-width text-center text-uppercase text-teal" overline>See Old Notifications</q-item-label>
                        </q-item-section>
                      </q-item>
                  </q-list>
                  </q-menu>
          </q-btn>
          <q-btn color="white" flat class="text-white" icon="mdi-logout-variant" @click="logout"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="printDrawerStatus" side="left" none class="noPrint">
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
        class="noPrint"
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
                   <q-item
                    expand-separator
                    to="/admin/allapplications"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="list_alt" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">All Applications</q-item-section>
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
                    to="/admin/dailycollections"
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

            <!-- End of Tracking -->

              <!-- <q-item
                  expand-separator
                  :content-inset-level="0.5"
                  to="/admin/applications"
                  exact
                  >
                <q-item-section avatar>
                  <q-icon name="mdi-form-dropdown" />
                </q-item-section>
                  <q-item-section class="text-uppercase">Applications</q-item-section>
              </q-item> -->
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
                  <q-item-section class="text-uppercase">Cash Advance</q-item-section>
              </q-item>
            <q-item
            to="/admin/paymentmaintenance"
            exact
            >
              <q-item-section avatar>
                  <q-icon name="vertical_split" />
              </q-item-section>
              <q-item-section>MANAGE PAYMENT FEES</q-item-section>
            </q-item>
            <q-item
            to="/admin/generatebilling"
            exact
            >
              <q-item-section avatar>
                  <q-icon name="description" />
              </q-item-section>
              <q-item-section>BILLING GENERATION</q-item-section>
            </q-item>
              <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/users"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Manage Users</q-item-section>
                </q-item>
    
            <!-- <q-expansion-item
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

            </q-expansion-item> -->
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
             <q-expansion-item
              expanded-separator
              icon="receipt"
              label="REPORTS"
              :content-inset-level="0.5"
            >
                <q-item
                to="/admin/dailycollections"
                exact
                >
                  <q-item-section avatar>
                      <q-icon name="brightness_low" />
                  </q-item-section>
                  <q-item-section>DAILY COLLECTIONS</q-item-section>
                </q-item>       


                <q-item
                to="/admin/dailyremittance"
                exact
                >
                  <q-item-section avatar>
                      <q-icon name="money" />
                  </q-item-section>
                  <q-item-section>DAILY REMITTANCE</q-item-section>
                </q-item>  

                <q-item
                to="/admin/memberpayments"
                exact
                >
                  <q-item-section avatar>
                      <q-icon name="recent_actors" />
                  </q-item-section>
                  <q-item-section>MEMBER PAYMENTS</q-item-section>
                </q-item>  

                <q-item
                to="/admin/topshares"
                exact
                >
                  <q-item-section avatar>
                      <q-icon name="leaderboard" />
                  </q-item-section>
                  <q-item-section>TOP SHARE OF STOCKS</q-item-section>
                </q-item> 

             </q-expansion-item>

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
import { date } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'
import { firebaseAuth,firebaseApp,firebaseDb,firefirestore } from 'boot/firebase'
export default {
  name: "Layout",
  created(){
    // firebaseAuth.signOut()
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
      log: {},
      Transactions: [],
      Notifications: [],
      WithdrawalApplications: [],
      LoanApplications: [],
      PreRegPersonalData: [],
      JeepneyData: [],
      length: 0
      // NewTransactions: Object.freeze(this.Transactions),
    };
  },
  watch: {
    'PreRegPersonalData':  function (val) {
      console.log(val,'PreRegPersonalData WATCH')
      let filter = val.filter(a=>{
        let basis = new Date(a.timestamp.toDate())
        let today = new Date()
        let diff = date.getDateDiff(today, basis, 'days')
        if(diff >= 1){
          console.log('REJECT THIS',a)
          console.log(basis,'basis')
        }
        return diff >= 1
      })
      console.log(filter,'TO REJECT')
      filter.forEach(a=>{
        this.rejectMember(a)
      })
    },
  },
  firestore () {
    return {
      DashboardUsers: firebaseDb.collection('DashboardUsers'),
      Transactions: firebaseDb.collection('Transactions'),
      WithdrawalApplications: firebaseDb.collection('WithdrawalApplications'),
      LoanApplications: firebaseDb.collection('LoanApplications'),
      PreRegPersonalData: firebaseDb.collection('PreRegPersonalData'),
      JeepneyData: firebaseDb.collection('JeepneyData'),
      MemberData: firebaseDb.collection('MemberData'),
      ZMemberInactiveness: firebaseDb.collection('FixedPayments').doc('ZMemberInactiveness'),
    }
  },  
  computed:{
    ...mapGetters('SubModule', {
        printDrawerStatus: 'getDrawerPrint',
    }),
    returnNotif(){

      let all = [...this.Transactions,...this.WithdrawalApplications,...this.LoanApplications,...this.PreRegPersonalData,...this.JeepneyData]
      // console.log(all.length,'all')
      let today = all.filter(a=>{
        if(a.ORCR !== undefined){
          a.timestamp = a.dateAdded
          a.notifType = 'jeep'
        }

        if(a.DailyCharge !== undefined){
          a.notifType = 'loans'
        }

        if(a.verificationCode !== undefined){
          a.notifType = 'membership'
          
        }

        if(a.OrNo !== undefined){
          a.notifType = 'payments'
        }

        if(a.RemainingBalance !== undefined && a.SavingsDeposit !== undefined){
          a.notifType = 'savings'
        }

        return a.timestamp !== null && a.timestamp !== undefined && date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY') == date.formatDate(new Date(),'MM-DD-YYYY')
      })
      console.log(today,'today')
      let notifs = []
      today.forEach(a=>{
        notifs.push(this.mapNotifications(a,a.notifType))
      })

      let order = this.$lodash.orderBy(notifs,'dateTime','desc')

      console.log(notifs,'notifs')
      return order.filter(a=>{
        return a.dateTime !== null || a.dateTime !== undefined
      })
    },
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
  mounted() {
          // this.$binding('MemberData', this.$firestoreApp.collection('MemberData'))
  },
  methods:{
    ...mapMutations('SubModule', {
        openDrawer: 'setDrawerOpen'
    }),
    rejectMember(preReg){
        let user = firebaseAuth.currentUser
        let approver = this.DashboardUsers.filter(a=>{
          return a['.key'] == user.uid
        })[0]
        // console.log(approver)

        this.$q.loading.show({
          message: 'Auto Rejecting Expired Applications'
        })
        let reason = 'Expired Application'
        // console.log('>>>> OK, received', data)
        let obj = {...preReg}
        let key = obj['.key']
        delete obj['.key']
        firebaseDb.collection('PreRegPersonalData').doc(key).delete()
        .then(()=>{
          firebaseDb.collection('RejectedApplications').doc(key).set({
            ...obj,
            dateRejected: firefirestore.FieldValue.serverTimestamp(),
            rejectedBy: approver.Username,
            rejectReason: reason
          }).then(()=>{
            // console.log('reject success')
            this.$q.loading.hide()
            this.$q.notify({
              icon: 'info',
              message: 'Rejected Application Success',
              color: 'positive'
            })
            
          })
          .catch((err)=>{
            this.$q.notify({
              icon: 'info',
              message: 'An error occur =>' + err,
              color: 'negative'
            })
          })
        })
        .catch((err)=>{
          this.$q.notify({
            icon: 'info',
            message: 'An error occur =>' + err,
            color: 'negative'
          })
        })

        
      // this.$firestore.PenReg.delete()
    },
    openThis(){
      this.openDrawer()
    },
    returnRoutes(type){
      if(type == 'payments'){
        return '/admin/dailycollections'
      } else if (type == 'jeep') {
        return '/admin/pendingjeeps'
      } else if (type == 'membership'){
        return '/admin/pendingreg'
      } else if (type == 'savings'){
        return '/admin/savings'
      } else if (type == 'loans'){
        return '/admin/loans'
      } else {
        return '/admin/dashboard'
      }
    },
    returnIcon(type){
      if(type == 'payments'){
        return 'payment'
      } else if (type == 'jeep') {
        return 'commute'
      } else if (type == 'membership'){
        return 'person'
      } else if (type == 'savings'){
        return 'account_balance'
      } else if (type == 'loans'){
        return 'receipt'
      } else {
        return 'check'
      }
    },
    mapNotifications(data,type = null){
      if(type !== null){
        const newData = data
        const id = newData['.key']
        if(type == 'payments'){
          return {notifType: type, MemberID: newData.MemberID , notifKey: id, message: `New ${newData.TransactionType} from ${newData.MemberID}`, total: newData.Total, transID: newData.TransactionID, dateTime: newData.timestamp}
        } else if (type == 'jeep'){
            let dateObject = {dateTime: newData.timestamp,message: 'New Unit Application'}
            let object = {...newData,...dateObject}
            return object          
        } else if (type == 'membership'){
            let dateObject = {dateTime: newData.timestamp,message: 'New Membership Application'}
            let object = {...newData,...dateObject} 
            return object        
        } else if (type == 'savings'){
            return {notifType: type, MemberID: newData.MemberID , ApplicationKey: id, message: `New Withdrawal Application from ${newData.MemberID}` , amount: newData.Amount, dateTime: newData.timestamp}
        } else if (type == 'loans'){
            return {notifType: type, MemberID: newData.MemberID, ApplicationKey: id, message: `New Loan Application from ${newData.MemberID}` , amount: newData.Amount, dateTime: newData.timestamp}
        } else {

        }
      }
    },
    ifSavedInNotifs(key){
      let index = this.$lodash.findIndex(this.Notifications,a=>{
        return key == a.notifKey
      })

      if(index > -1){
        return true
      } else {
        return false
      }
    },
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

   .q-header {display:none;}

}
</style>

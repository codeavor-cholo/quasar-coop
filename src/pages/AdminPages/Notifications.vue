<template>
    <q-page class="q-pa-md" style="padding: 50px 200px">
        <div class="text-h4 text-weight-bold text-grey-7">
           <q-chip size="lg" color="orange" text-color="white" :label="returnNotif.length" /> Today's Notifications 
        </div>
        <div class="q-mt-md">
        <q-list separator="">
            <q-item v-for="notif in returnNotif" :key="notif['.key']" clickable :to="returnRoutes(notif.notifType)">
                <q-item-section top avatar>
                    <q-avatar color="white" text-color="teal" :icon="returnIcon(notif.notifType)" />
                </q-item-section>
                <q-item-section>
                    <!-- <q-item-label>Single line item</q-item-label> -->
                    <q-item-label class="text-weight-bold" caption lines="2">{{notif.message}}
                    <br>
                    <span v-if="notif.notifType == 'jeep'" class="text-weight-light">{{notif.PlateNumber}} ({{notif.MemberID}})</span>
                    <span v-else-if="notif.notifType == 'payments'" class="text-weight-light">{{notif.total | currency}} (#{{notif.transID}}) </span>
                    <span v-else-if="notif.notifType == 'savings'" class="text-weight-light">{{notif.amount | currency}} </span>
                    <span v-else-if="notif.notifType == 'loans'" class="text-weight-light">{{notif.amount | currency}} </span>
                    </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{$moment(notif.dateTime.toDate()).fromNow()}}</q-item-label>
                </q-item-section>
                </q-item>
            </q-list>
        </div>
        <div class="text-h4 text-weight-bold text-grey-7 q-mt-md">
            Older Notifications
        </div>
        <div class="q-mt-md">
            <q-list separator="">
            <q-item v-for="notif in returnNotToday.slice(0,showMore)" :key="notif['.key']" clickable :to="returnRoutes(notif.notifType)">
                <q-item-section top avatar>
                    <q-avatar color="white" text-color="teal" :icon="returnIcon(notif.notifType)" />
                </q-item-section>
                <q-item-section>
                    <!-- <q-item-label>Single line item</q-item-label> -->
                    <q-item-label class="text-weight-bold" caption lines="2">{{notif.message}}
                    <br>
                    <span v-if="notif.notifType == 'jeep'" class="text-weight-light">{{notif.PlateNumber}} ({{notif.MemberID}})</span>
                    <span v-else-if="notif.notifType == 'payments'" class="text-weight-light">{{notif.total | currency}} (#{{notif.transID}}) </span>
                    <span v-else-if="notif.notifType == 'savings'" class="text-weight-light">{{notif.amount | currency}} </span>
                    <span v-else-if="notif.notifType == 'loans'" class="text-weight-light">{{notif.amount | currency}} </span>
                    </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{$moment(notif.dateTime.toDate()).fromNow()}}</q-item-label>
                </q-item-section>
                </q-item>
                <q-item v-if="loading" class="q-pa-lg">
                    <q-spinner-dots color="teal" size="20px" v-if="loading" class="full-width text-center"/>
                </q-item>
                <q-item :clickable="!noMore" class="bg-grey-2" @click="showMoreNotifs">
                        
                        <q-item-section v-if="!noMore">
                            <q-item-label class="full-width text-center text-uppercase text-teal" overline>More Notifications</q-item-label>
                        </q-item-section>
                        <q-item-section v-else>
                            <q-item-label class="full-width text-center text-uppercase text-teal" overline>No Notifications Left</q-item-label>
                        </q-item-section>
                </q-item>
            </q-list>

        </div>
        
    </q-page>
</template>
<script>
import { date } from 'quasar'
import { firebaseAuth,firebaseApp,firebaseDb,firefirestore } from 'boot/firebase'
export default {
    data(){
        return {
            showMore: 10,
            noMore: false,
            loading: false,
        }
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
        }
    },  
  computed:{
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

        if(a.isNewMember !== undefined){
          a.notifType = 'membership'
          
        }

        if(a.OrNo !== undefined){
          a.notifType = 'payments'
        }

        if(a.RemainingBalance !== undefined && a.SavingsDeposit !== undefined){
          a.notifType = 'savings'
        }

        return a.timestamp !== undefined && date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY') == date.formatDate(new Date(),'MM-DD-YYYY')
      })
      console.log(today,'today')
      let notifs = []
      today.forEach(a=>{
        notifs.push(this.mapNotifications(a,a.notifType))
      })

      console.log(notifs,'notifs')
      return this.$lodash.orderBy(notifs,'dateTime','desc')
    },
    returnNotToday(){
        let all = [...this.Transactions,...this.WithdrawalApplications,...this.LoanApplications,...this.PreRegPersonalData,...this.JeepneyData]

        let today = all.filter(a=>{
            if(a.ORCR !== undefined){
            a.timestamp = a.dateAdded
            a.notifType = 'jeep'
            }

            if(a.DailyCharge !== undefined){
            a.notifType = 'loans'
            }

            if(a.isNewMember !== undefined){
            a.notifType = 'membership'
            
            }

            if(a.OrNo !== undefined){
            a.notifType = 'payments'
            }

            if(a.RemainingBalance !== undefined && a.SavingsDeposit !== undefined){
            a.notifType = 'savings'
            }

            return a.timestamp !== undefined && date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY') !== date.formatDate(new Date(),'MM-DD-YYYY')
        })
        console.log(today,'today')
        let notifs = []
        today.forEach(a=>{
            notifs.push(this.mapNotifications(a,a.notifType))
        })

        console.log(notifs,'notifs')
        return this.$lodash.orderBy(notifs,'dateTime','desc')
        
    }
  },
  methods:{
    showMoreNotifs(){
        if(this.showMore < this.returnNotToday.length){
            this.loading = true
            setTimeout(() => {
                this.showMore = this.showMore + 10
                this.loading = false
            }, 3000)
        } else {
            console.log(this.showMore,'wtf')
            this.noMore = true
        }
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
            let dateObject = {dateTime: moment().toString(),message: 'New Membership Application'}
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
  }
}
</script>